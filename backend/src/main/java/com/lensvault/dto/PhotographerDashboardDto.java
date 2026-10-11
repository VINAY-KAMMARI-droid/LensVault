package com.lensvault.dto;

import java.util.List;

public class PhotographerDashboardDto {
    private long totalEvents;
    private long totalAlbums;
    private long totalMedia;
    private long totalImages;
    private long totalVideos;
    private long totalClients;
    private List<EventResponse> recentEvents;
    private List<MediaResponse> recentMedia;

    public PhotographerDashboardDto() {
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalAlbums() {
        return totalAlbums;
    }

    public void setTotalAlbums(long totalAlbums) {
        this.totalAlbums = totalAlbums;
    }

    public long getTotalMedia() {
        return totalMedia;
    }

    public void setTotalMedia(long totalMedia) {
        this.totalMedia = totalMedia;
    }

    public long getTotalImages() {
        return totalImages;
    }

    public void setTotalImages(long totalImages) {
        this.totalImages = totalImages;
    }

    public long getTotalVideos() {
        return totalVideos;
    }

    public void setTotalVideos(long totalVideos) {
        this.totalVideos = totalVideos;
    }

    public long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(long totalClients) {
        this.totalClients = totalClients;
    }

    public List<EventResponse> getRecentEvents() {
        return recentEvents;
    }

    public void setRecentEvents(List<EventResponse> recentEvents) {
        this.recentEvents = recentEvents;
    }

    public List<MediaResponse> getRecentMedia() {
        return recentMedia;
    }

    public void setRecentMedia(List<MediaResponse> recentMedia) {
        this.recentMedia = recentMedia;
    }
}
