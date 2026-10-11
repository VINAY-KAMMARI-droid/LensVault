package com.lensvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AlbumRequest {
    @NotBlank(message = "Album name is required")
    @Size(min = 2, max = 120, message = "Album name must be between 2 and 120 characters")
    private String albumName;

    private String description;

    public AlbumRequest() {
    }

    public AlbumRequest(String albumName, String description) {
        this.albumName = albumName;
        this.description = description;
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
}
