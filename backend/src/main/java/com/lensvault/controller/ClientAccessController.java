package com.lensvault.controller;

import com.lensvault.dto.AlbumResponse;
import com.lensvault.dto.ApiResponse;
import com.lensvault.dto.EventResponse;
import com.lensvault.security.SecurityUtils;
import com.lensvault.service.AlbumService;
import com.lensvault.service.ClientAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/client")
public class ClientAccessController {

    private final ClientAccessService clientAccessService;
    private final AlbumService albumService;
    private final SecurityUtils securityUtils;

    public ClientAccessController(ClientAccessService clientAccessService,
                                  AlbumService albumService,
                                  SecurityUtils securityUtils) {
        this.clientAccessService = clientAccessService;
        this.albumService = albumService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getClientEvents() {
        String email = securityUtils.getCurrentUserEmail();
        List<EventResponse> events = clientAccessService.getEventsAssignedToClient(email);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<EventResponse>> getClientEventDetails(@PathVariable Long eventId) {
        String email = securityUtils.getCurrentUserEmail();
        EventResponse event = clientAccessService.getClientEventDetails(eventId, email);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    @GetMapping("/events/{eventId}/albums")
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getClientEventAlbums(@PathVariable Long eventId) {
        String email = securityUtils.getCurrentUserEmail();
        // The album service verifies whether the client is assigned and has active access
        List<AlbumResponse> albums = albumService.getAlbumsByEventId(eventId, email);
        return ResponseEntity.ok(ApiResponse.success(albums));
    }
}
