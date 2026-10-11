package com.lensvault.dto;

import com.lensvault.entity.AuditLog;
import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private String actorEmail;
    private String action;
    private String resourceType;
    private String resourceId;
    private String details;
    private LocalDateTime timestamp;

    public AuditLogDto() {
    }

    public static AuditLogDto fromEntity(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setActorEmail(log.getActorEmail());
        dto.setAction(log.getAction());
        dto.setResourceType(log.getResourceType());
        dto.setResourceId(log.getResourceId());
        dto.setDetails(log.getDetails());
        dto.setTimestamp(log.getTimestamp());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(String actorEmail) {
        this.actorEmail = actorEmail;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
