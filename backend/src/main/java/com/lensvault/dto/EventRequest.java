package com.lensvault.dto;

import com.lensvault.entity.EventStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class EventRequest {
    @NotBlank(message = "Event name is required")
    @Size(min = 2, max = 150, message = "Event name must be between 2 and 150 characters")
    private String eventName;

    @NotBlank(message = "Event type is required")
    @Size(max = 50, message = "Event type cannot exceed 50 characters")
    private String eventType;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    private String venue;
    private String description;
    private EventStatus status = EventStatus.ACTIVE;
    private String coverImageUrl;

    public EventRequest() {
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
}
