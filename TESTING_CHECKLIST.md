# LensVault — Faculty Demonstration & Manual Testing Checklist

Use this checklist during your academic evaluation or demonstration to faculty members.

---

### Step 1: Start Applications
- [ ] Run `start-all.bat` (or start `start-backend.bat` and `start-frontend.bat` separately)
- [ ] Verify backend is listening on `http://localhost:8080/api/v1`
- [ ] Verify frontend is running on `http://localhost:5173`

---

### Step 2: Public Experience & Branding
- [ ] Open `http://localhost:5173` in the browser
- [ ] Inspect the Landing page: Hero headline, "Every Event. Every Memory. One Secure Gallery."
- [ ] Inspect Key Features, How It Works (4 steps), and Benefits sections
- [ ] Click "Sign In" to open the Login page

---

### Step 3: Test Photographer Experience
- [ ] On the Login page, click the quick-fill button **"Photographer"** (`photographer@lensvault.com` / `Photographer@123`) and click **Sign In**
- [ ] **Photographer Dashboard**:
  - [ ] Inspect KPI cards (Total Events, Albums, Media Files, Clients)
  - [ ] Inspect the Recharts Bar Chart showing deliverables breakdown
- [ ] **Create Event**:
  - [ ] Click **"Create New Event"**
  - [ ] Enter event name (e.g., *"Emerald Gala 2026"*), select Type (*Corporate*), select date
  - [ ] Submit and verify the event appears in the portfolio
- [ ] **Album Creation & Media Upload**:
  - [ ] Click on an event (e.g., *"Sarah & Liam Royal Wedding"*)
  - [ ] Click **"New Album"** and create an album (e.g., *"Reception Dance"*)
  - [ ] Click into the album and click **"Upload Media"**
  - [ ] Select image files (JPEG/PNG/WebP) or short MP4 video
  - [ ] Verify real-time progress bar and successful upload
- [ ] **Gallery Preview & Lightbox**:
  - [ ] Click on a photo in the grid to open the full-screen Lightbox
  - [ ] Use keyboard arrow keys (Left/Right) to navigate between photographs
  - [ ] Verify original resolution rendering
- [ ] **Client Access & Download Permission Controls**:
  - [ ] Return to the event and click **"Manage Clients"**
  - [ ] Inspect assigned clients (*Sarah Jenkins*, *David Miller*)
  - [ ] Note that Sarah has downloads enabled, and David has downloads restricted
  - [ ] Toggle David's download permission on or off to demonstrate dynamic backend control

---

### Step 4: Test Client Experience (Isolation & Permission Enforcement)
- [ ] Sign out from Photographer account
- [ ] On the Login page, click **"Client (Sarah)"** (`client.sarah@lensvault.com` / `Client@123`) and sign in
- [ ] **Assigned Events**:
  - [ ] Verify Sarah only sees the events assigned to her (*Sarah & Liam Royal Wedding*)
  - [ ] Verify she does NOT see other clients' private events
- [ ] **Download Permitted**:
  - [ ] Open the wedding album (*Ceremony & Vows*)
  - [ ] Click **"Download"** on a photo — verify the high-resolution file downloads directly to the browser
- [ ] Sign out and log in as **"Client (David)"** (`client.david@lensvault.com` / `Client@123`)
- [ ] **Download Locked Enforcement**:
  - [ ] Open David's assigned event (*Sophia's 18th Milestone Celebration*)
  - [ ] Open an album and view a photo in the Lightbox
  - [ ] Notice the lock indicator: *"Downloads Restricted by Photographer"*
  - [ ] Verify the backend rejects any direct download attempt with 403 Forbidden!

---

### Step 5: Test Administrator Experience
- [ ] Sign out and log in as **"Administrator"** (`admin@lensvault.com` / `Admin@123`)
- [ ] **Admin Dashboard**:
  - [ ] Inspect platform telemetry: Total users, total events, total albums, total media files, and total disk storage used
  - [ ] Inspect the live audit trail of recent user actions
- [ ] **User Moderation**:
  - [ ] Navigate to **User Management**
  - [ ] Filter by role (*Photographers* or *Clients*)
  - [ ] Click **"Deactivate"** on a test client account
  - [ ] Attempt to sign in with the deactivated account — verify Spring Security blocks login with: *"Your account has been deactivated"*
  - [ ] Reactivate the account from the admin dashboard
- [ ] **Audit Trail Inspection**:
  - [ ] Navigate to **Audit Logs**
  - [ ] Verify timestamps, actor email, actions (`USER_LOGIN`, `CREATE_EVENT`, `UPLOAD_MEDIA`, `UPDATE_CLIENT_PERMISSIONS`)

---

### Step 6: Automated Test Verification
- [ ] In the terminal inside `backend/`, run:
  ```powershell
  mvn test
  ```
- [ ] Confirm all 9 automated tests pass with `BUILD SUCCESS` (0 failures, 0 errors).
