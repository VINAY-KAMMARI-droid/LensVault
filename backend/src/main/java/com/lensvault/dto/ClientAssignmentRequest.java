package com.lensvault.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ClientAssignmentRequest {
    @NotBlank(message = "Client email is required")
    @Email(message = "Please provide a valid client email")
    private String clientEmail;

    private boolean accessEnabled = true;
    private boolean downloadEnabled = true;

    public ClientAssignmentRequest() {
    }

    public ClientAssignmentRequest(String clientEmail, boolean accessEnabled, boolean downloadEnabled) {
        this.clientEmail = clientEmail;
        this.accessEnabled = accessEnabled;
        this.downloadEnabled = downloadEnabled;
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
}
