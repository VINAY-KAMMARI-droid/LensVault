package com.lensvault.dto;

import com.lensvault.entity.Album;
import java.time.LocalDateTime;

public class AlbumResponse {
    private Long id;
    private String albumName;
    private String description;
    private Long eventId;
    private String eventName;
    private int mediaCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AlbumResponse() {
    }

    public static AlbumResponse fromEntity(Album album) {
        AlbumResponse resp = new AlbumResponse();
        resp.setId(album.getId());
        resp.setAlbumName(album.getAlbumName());
        resp.setDescription(album.getDescription());
        if (album.getEvent() != null) {
            resp.setEventId(album.getEvent().getId());
            resp.setEventName(album.getEvent().getEventName());
        }
        resp.setMediaCount(album.getMediaList() != null ? album.getMediaList().size() : 0);
        resp.setCreatedAt(album.getCreatedAt());
        resp.setUpdatedAt(album.getUpdatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public int getMediaCount() {
        return mediaCount;
    }

    public void setMediaCount(int mediaCount) {
        this.mediaCount = mediaCount;
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
