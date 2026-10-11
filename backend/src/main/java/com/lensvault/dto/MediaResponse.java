package com.lensvault.dto;

import com.lensvault.entity.Media;
import com.lensvault.entity.MediaType;

import java.time.LocalDateTime;

public class MediaResponse {
    private Long id;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private MediaType mediaType;
    private Long albumId;
    private String albumName;
    private Long eventId;
    private String eventName;
    private String previewUrl;
    private String downloadUrl;
    private LocalDateTime createdAt;

    public MediaResponse() {
    }

    public static MediaResponse fromEntity(Media media) {
        MediaResponse resp = new MediaResponse();
        resp.setId(media.getId());
        resp.setOriginalFilename(media.getOriginalFilename());
        resp.setContentType(media.getContentType());
        resp.setFileSize(media.getFileSize());
        resp.setMediaType(media.getMediaType());
        if (media.getAlbum() != null) {
            resp.setAlbumId(media.getAlbum().getId());
            resp.setAlbumName(media.getAlbum().getAlbumName());
            if (media.getAlbum().getEvent() != null) {
                resp.setEventId(media.getAlbum().getEvent().getId());
                resp.setEventName(media.getAlbum().getEvent().getEventName());
            }
        }
        resp.setPreviewUrl("/api/v1/media/" + media.getId() + "/preview");
        resp.setDownloadUrl("/api/v1/media/" + media.getId() + "/download");
        resp.setCreatedAt(media.getCreatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public MediaType getMediaType() {
        return mediaType;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public Long getAlbumId() {
        return albumId;
    }

    public void setAlbumId(Long albumId) {
        this.albumId = albumId;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
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

    public String getPreviewUrl() {
        return previewUrl;
    }

    public void setPreviewUrl(String previewUrl) {
        this.previewUrl = previewUrl;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
