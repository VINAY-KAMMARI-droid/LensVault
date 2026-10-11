package com.lensvault.dto;

public class ClientPermissionUpdateRequest {
    private boolean accessEnabled;
    private boolean downloadEnabled;

    public ClientPermissionUpdateRequest() {
    }

    public ClientPermissionUpdateRequest(boolean accessEnabled, boolean downloadEnabled) {
        this.accessEnabled = accessEnabled;
        this.downloadEnabled = downloadEnabled;
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
}
