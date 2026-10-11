package com.lensvault.dto;

import com.lensvault.entity.Event;
import com.lensvault.entity.EventStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventResponse {
    private Long id;
    private String eventName;
    private String eventType;
    private LocalDate eventDate;
    private String venue;
    private String description;
    private EventStatus status;
    private String coverImageUrl;
    private Long photographerId;
    private String photographerName;
    private int albumCount;
    private int mediaCount;
    private int clientCount;
    private boolean downloadAllowedForClient; // populated for client role
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EventResponse() {
    }

    public static EventResponse fromEntity(Event event) {
        EventResponse resp = new EventResponse();
        resp.setId(event.getId());
        resp.setEventName(event.getEventName());
        resp.setEventType(event.getEventType());
        resp.setEventDate(event.getEventDate());
        resp.setVenue(event.getVenue());
        resp.setDescription(event.getDescription());
        resp.setStatus(event.getStatus());
        resp.setCoverImageUrl(event.getCoverImageUrl());
        if (event.getPhotographer() != null) {
            resp.setPhotographerId(event.getPhotographer().getId());
            resp.setPhotographerName(event.getPhotographer().getFullName());
        }
        resp.setAlbumCount(event.getAlbums() != null ? event.getAlbums().size() : 0);
        int totalMedia = 0;
        if (event.getAlbums() != null) {
            for (var album : event.getAlbums()) {
                if (album.getMediaList() != null) {
                    totalMedia += album.getMediaList().size();
                }
            }
        }
        resp.setMediaCount(totalMedia);
        resp.setClientCount(event.getEventClients() != null ? event.getEventClients().size() : 0);
        resp.setCreatedAt(event.getCreatedAt());
        resp.setUpdatedAt(event.getUpdatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public Long getPhotographerId() {
        return photographerId;
    }

    public void setPhotographerId(Long photographerId) {
        this.photographerId = photographerId;
    }

    public String getPhotographerName() {
        return photographerName;
    }

    public void setPhotographerName(String photographerName) {
        this.photographerName = photographerName;
    }

    public int getAlbumCount() {
        return albumCount;
    }

    public void setAlbumCount(int albumCount) {
        this.albumCount = albumCount;
    }

    public int getMediaCount() {
        return mediaCount;
    }

    public void setMediaCount(int mediaCount) {
        this.mediaCount = mediaCount;
    }

    public int getClientCount() {
        return clientCount;
    }

    public void setClientCount(int clientCount) {
        this.clientCount = clientCount;
    }

    public boolean isDownloadAllowedForClient() {
        return downloadAllowedForClient;
    }

    public void setDownloadAllowedForClient(boolean downloadAllowedForClient) {
        this.downloadAllowedForClient = downloadAllowedForClient;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
