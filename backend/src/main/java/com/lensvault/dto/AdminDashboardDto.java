package com.lensvault.dto;

import java.util.List;

public class AdminDashboardDto {
    private long totalUsers;
    private long totalPhotographers;
    private long totalClients;
    private long totalAdmins;
    private long totalEvents;
    private long totalAlbums;
    private long totalMedia;
    private long totalStorageBytes;
    private List<AuditLogDto> recentActivity;

    public AdminDashboardDto() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalPhotographers() {
        return totalPhotographers;
    }

    public void setTotalPhotographers(long totalPhotographers) {
        this.totalPhotographers = totalPhotographers;
    }

    public long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(long totalClients) {
        this.totalClients = totalClients;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
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

    public long getTotalStorageBytes() {
        return totalStorageBytes;
    }

    public void setTotalStorageBytes(long totalStorageBytes) {
        this.totalStorageBytes = totalStorageBytes;
    }

    public List<AuditLogDto> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<AuditLogDto> recentActivity) {
        this.recentActivity = recentActivity;
    }
}
