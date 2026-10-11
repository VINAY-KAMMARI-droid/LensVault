-- ==============================================================================
-- LensVault - Secure Digital Event Media Delivery Platform
-- Database Schema Reference Script for MySQL 8.x
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS lensvault_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE lensvault_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PHOTOGRAPHER', 'CLIENT', 'ADMIN') NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(200),
    description TEXT,
    status ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    cover_image_url VARCHAR(500),
    photographer_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_event_photographer (photographer_id),
    INDEX idx_event_date (event_date),
    CONSTRAINT fk_event_photographer FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Event Clients Table (Assignments & Permissions)
CREATE TABLE IF NOT EXISTS event_clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    access_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    download_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    invitation_token VARCHAR(64) UNIQUE,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uk_event_client (event_id, client_id),
    INDEX idx_client_id (client_id),
    INDEX idx_invitation_token (invitation_token),
    CONSTRAINT fk_event_client_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_client_user FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Albums Table
CREATE TABLE IF NOT EXISTS albums (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    album_name VARCHAR(120) NOT NULL,
    description TEXT,
    event_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_album_event (event_id),
    CONSTRAINT fk_album_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Media Table
CREATE TABLE IF NOT EXISTS media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    storage_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    media_type ENUM('IMAGE', 'VIDEO') NOT NULL,
    album_id BIGINT NOT NULL,
    uploader_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_media_album (album_id),
    INDEX idx_media_uploader (uploader_id),
    CONSTRAINT fk_media_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_uploader FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_email VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL,
    resource_type VARCHAR(80) NOT NULL,
    resource_id VARCHAR(80),
    details TEXT,
    timestamp DATETIME NOT NULL,
    INDEX idx_audit_actor (actor_email),
    INDEX idx_audit_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
