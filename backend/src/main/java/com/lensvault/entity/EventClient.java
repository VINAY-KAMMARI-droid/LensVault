package com.lensvault.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_clients", uniqueConstraints = {
    @UniqueConstraint(name = "uk_event_client", columnNames = {"event_id", "client_id"})
}, indexes = {
    @Index(name = "idx_client_id", columnList = "client_id"),
    @Index(name = "idx_invitation_token", columnList = "invitationToken")
})
public class EventClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private boolean accessEnabled = true;

    @Column(nullable = false)
    private boolean downloadEnabled = true;

    @Column(unique = true, length = 64)
    private String invitationToken;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public EventClient() {
    }

    public EventClient(Event event, User client, boolean accessEnabled, boolean downloadEnabled, String invitationToken) {
        this.event = event;
        this.client = client;
        this.accessEnabled = accessEnabled;
        this.downloadEnabled = downloadEnabled;
        this.invitationToken = invitationToken;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
