package com.lensvault.dto;

import com.lensvault.entity.EventClient;
import java.time.LocalDateTime;

public class ClientAssignmentResponse {
    private Long id;
    private Long eventId;
    private String eventName;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private boolean accessEnabled;
    private boolean downloadEnabled;
    private String invitationToken;
    private LocalDateTime assignedAt;

    public ClientAssignmentResponse() {
    }

    public static ClientAssignmentResponse fromEntity(EventClient ec) {
        ClientAssignmentResponse resp = new ClientAssignmentResponse();
        resp.setId(ec.getId());
        if (ec.getEvent() != null) {
            resp.setEventId(ec.getEvent().getId());
            resp.setEventName(ec.getEvent().getEventName());
        }
        if (ec.getClient() != null) {
            resp.setClientId(ec.getClient().getId());
            resp.setClientName(ec.getClient().getFullName());
            resp.setClientEmail(ec.getClient().getEmail());
        }
        resp.setAccessEnabled(ec.isAccessEnabled());
        resp.setDownloadEnabled(ec.isDownloadEnabled());
        resp.setInvitationToken(ec.getInvitationToken());
        resp.setAssignedAt(ec.getCreatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public boolean isAccessEnabled() {
        return accessEnabled;
    }

    public void setAccessEnabled(boolean accessEnabled) {
        this.accessEnabled = accessEnabled;
    }

    public boolean isDownloadEnabled() {
        return downloadEnabled;
    }

    public void setDownloadEnabled(boolean downloadEnabled) {
        this.downloadEnabled = downloadEnabled;
    }

    public String getInvitationToken() {
        return invitationToken;
    }

    public void setInvitationToken(String invitationToken) {
        this.invitationToken = invitationToken;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}
