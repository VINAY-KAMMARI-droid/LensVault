# LensVault — Architecture & System Design Document

## 1. System Overview

**LensVault** is an enterprise-grade digital media delivery and event gallery platform engineered specifically for professional photographers and their clients. The platform addresses a critical challenge in modern event photography: delivering massive quantities of high-resolution photographic and video media safely, quickly, and with strict intellectual property and download permission controls.

```mermaid
graph TD
    ClientBrowser[React Client App\n(Port 5173)] -->|Axios REST / JWT Bearer| SpringSecurity[Spring Security 6\n(Port 8080)]
    SpringSecurity --> JwtFilter[JwtAuthenticationFilter\n(Bearer / Token Stream)]
    JwtFilter --> Controllers[REST Controllers\n(/api/v1/*)]
    Controllers --> ServiceLayer[Service Business Logic Layer]
    ServiceLayer --> StorageInterface[StorageService Interface]
    StorageInterface --> LocalStorage[Private Local Disk Storage\n(storage/uploads)]
    ServiceLayer --> JpaRepositories[Spring Data JPA Repositories]
    JpaRepositories --> MySQL[(MySQL 8.0 Database\nlensvault_db)]
    ServiceLayer --> AuditLogger[Audit Logging Engine]
    AuditLogger --> JpaRepositories
```

---

## 2. Layered Architecture

The backend implements a clean, decoupled n-tier architecture:

| Layer | Responsibility | Key Components |
|---|---|---|
| **Controller** | HTTP endpoint binding, request validation, response serialization | `AuthController`, `EventController`, `AlbumController`, `MediaController`, `ClientAccessController`, `AdminController` |
| **Service** | Core business logic, ownership checks, permission verification | `AuthService`, `EventService`, `AlbumService`, `MediaService`, `ClientAccessService`, `AdminService`, `AuditService` |
| **Security** | Authentication, token validation, principal hydration, authorization filters | `JwtTokenProvider`, `JwtAuthenticationFilter`, `UserPrincipal`, `CustomUserDetailsService`, `SecurityConfig` |
| **Storage** | File I/O, path normalization, MIME checking, unique UUID naming | `StorageService` (interface), `LocalStorageService` (implementation) |
| **Repository** | Database persistence, relational querying, indexed lookups | `UserRepository`, `EventRepository`, `EventClientRepository`, `AlbumRepository`, `MediaRepository`, `AuditLogRepository` |
| **Entity / DTO** | Domain entities and decoupled API transfer representations | `User`, `Event`, `Album`, `Media`, `EventClient`, `AuditLog`, `AuthResponse`, etc. |

---

## 3. Role-Based Access Control (RBAC) Matrix

| Action / Resource | Anonymous | CLIENT | PHOTOGRAPHER | ADMIN |
|---|:---:|:---:|:---:|:---:|
| User Registration (`/auth/register`) | ✅ | ❌ | ❌ | ❌ |
| User Login (`/auth/login`) | ✅ | ✅ | ✅ | ✅ |
| Create Events (`POST /events`) | ❌ | ❌ | ✅ | ✅ |
| Manage Own Events (`PUT/DELETE /events/{id}`) | ❌ | ❌ | ✅ (Owner) | ✅ |
| Create Albums (`POST /events/{id}/albums`) | ❌ | ❌ | ✅ (Owner) | ✅ |
| Upload Media (`POST /albums/{id}/media`) | ❌ | ❌ | ✅ (Owner) | ✅ |
| Assign Clients & Set Permissions | ❌ | ❌ | ✅ (Owner) | ✅ |
| View Assigned Events (`GET /client/events`) | ❌ | ✅ (Assigned) | ❌ | ✅ |
| Preview Media Stream (`GET /media/{id}/preview`) | ❌ | ✅ (Assigned) | ✅ (Owner) | ✅ |
| Download Media (`GET /media/{id}/download`) | ❌ | ✅ (If downloadEnabled=true) | ✅ (Owner) | ✅ |
| Access Admin Dashboard & Moderation | ❌ | ❌ | ❌ | ✅ |
| View Audit Trail Logs | ❌ | ❌ | ❌ | ✅ |

---

## 4. Media Storage & Delivery Workflow

1. **Storage Isolation**:
   Media files are never saved in public static web roots. All original JPEG, PNG, WebP photos and MP4, WebM videos are stored in `storage/uploads/` with UUID-generated randomized file names (e.g., `3f74b882-f5e9-4e7a-9a9c-0971a8f90264.jpg`).
2. **Path Traversal Protection**:
   All paths are normalized and verified against the canonical root path:
   ```java
   Path destinationFile = this.rootLocation.resolve(storedFilename).normalize().toAbsolutePath();
   if (!destinationFile.getParent().equals(this.rootLocation)) {
       throw new BadRequestException("Path traversal attempted.");
   }
   ```
3. **Dual Stream Authentication**:
   - Standard REST requests pass `Authorization: Bearer <token>`
   - Native HTML5 elements (`<img src="...">`, `<video src="...">`) and anchor downloads pass `?token=<token>`. The backend `JwtAuthenticationFilter` validates both channels seamlessly.
4. **Download Gatekeeper**:
   When a client attempts to download a file, the `MediaService` verifies:
   - Does client have access to the event?
   - Is `accessEnabled == true`?
   - Is `downloadEnabled == true`?
   If `downloadEnabled == false`, the server immediately throws `403 Forbidden` with `"Downloads are disabled for your account on this event."`
