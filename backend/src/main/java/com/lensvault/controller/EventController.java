package com.lensvault.controller;

import com.lensvault.dto.*;
import com.lensvault.security.SecurityUtils;
import com.lensvault.service.ClientAccessService;
import com.lensvault.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final ClientAccessService clientAccessService;
    private final SecurityUtils securityUtils;

    public EventController(EventService eventService,
                           ClientAccessService clientAccessService,
                           SecurityUtils securityUtils) {
        this.eventService = eventService;
        this.clientAccessService = clientAccessService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getPhotographerEvents(
            @RequestParam(required = false) String search) {
        String email = securityUtils.getCurrentUserEmail();
        List<EventResponse> events = eventService.getEventsForPhotographer(email, search);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        EventResponse event = eventService.createEvent(request, email);
        return new ResponseEntity<>(ApiResponse.success("Event created successfully", event), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        String email = securityUtils.getCurrentUserEmail();
        EventResponse event = eventService.getEventById(id, email);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        EventResponse updated = eventService.updateEvent(id, request, email);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        String email = securityUtils.getCurrentUserEmail();
        eventService.deleteEvent(id, email);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<ApiResponse<PhotographerDashboardDto>> getDashboardStats() {
        String email = securityUtils.getCurrentUserEmail();
        PhotographerDashboardDto stats = eventService.getPhotographerDashboardStats(email);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // --- Client Assignment & Permissions Endpoints ---

    @GetMapping("/{eventId}/clients")
    public ResponseEntity<ApiResponse<List<ClientAssignmentResponse>>> getEventClients(@PathVariable Long eventId) {
        String email = securityUtils.getCurrentUserEmail();
        List<ClientAssignmentResponse> clients = clientAccessService.getClientsForEvent(eventId, email);
        return ResponseEntity.ok(ApiResponse.success(clients));
    }

    @PostMapping("/{eventId}/clients")
    public ResponseEntity<ApiResponse<ClientAssignmentResponse>> assignClient(
            @PathVariable Long eventId,
            @Valid @RequestBody ClientAssignmentRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        ClientAssignmentResponse assigned = clientAccessService.assignClientToEvent(eventId, request, email);
        return new ResponseEntity<>(ApiResponse.success("Client assigned to event successfully", assigned), HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}/clients/{clientId}/permissions")
    public ResponseEntity<ApiResponse<ClientAssignmentResponse>> updateClientPermissions(
            @PathVariable Long eventId,
            @PathVariable Long clientId,
            @RequestBody ClientPermissionUpdateRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        ClientAssignmentResponse updated = clientAccessService.updateClientPermissions(eventId, clientId, request, email);
        return ResponseEntity.ok(ApiResponse.success("Client permissions updated successfully", updated));
    }

    @DeleteMapping("/{eventId}/clients/{clientId}")
    public ResponseEntity<ApiResponse<Void>> revokeClientAccess(
            @PathVariable Long eventId,
            @PathVariable Long clientId) {
        String email = securityUtils.getCurrentUserEmail();
        clientAccessService.revokeClientAccess(eventId, clientId, email);
        return ResponseEntity.ok(ApiResponse.success("Client access revoked successfully", null));
    }
}
