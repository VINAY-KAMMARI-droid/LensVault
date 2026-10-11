package com.lensvault.controller;

import com.lensvault.dto.AlbumRequest;
import com.lensvault.dto.AlbumResponse;
import com.lensvault.dto.ApiResponse;
import com.lensvault.security.SecurityUtils;
import com.lensvault.service.AlbumService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AlbumController {

    private final AlbumService albumService;
    private final SecurityUtils securityUtils;

    public AlbumController(AlbumService albumService, SecurityUtils securityUtils) {
        this.albumService = albumService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/events/{eventId}/albums")
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getAlbumsByEventId(@PathVariable Long eventId) {
        String email = securityUtils.getCurrentUserEmail();
        List<AlbumResponse> albums = albumService.getAlbumsByEventId(eventId, email);
        return ResponseEntity.ok(ApiResponse.success(albums));
    }

    @PostMapping("/events/{eventId}/albums")
    public ResponseEntity<ApiResponse<AlbumResponse>> createAlbum(
            @PathVariable Long eventId,
            @Valid @RequestBody AlbumRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        AlbumResponse created = albumService.createAlbum(eventId, request, email);
        return new ResponseEntity<>(ApiResponse.success("Album created successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/albums/{albumId}")
    public ResponseEntity<ApiResponse<AlbumResponse>> getAlbumById(@PathVariable Long albumId) {
        String email = securityUtils.getCurrentUserEmail();
        AlbumResponse album = albumService.getAlbumById(albumId, email);
        return ResponseEntity.ok(ApiResponse.success(album));
    }

    @PutMapping("/albums/{albumId}")
    public ResponseEntity<ApiResponse<AlbumResponse>> updateAlbum(
            @PathVariable Long albumId,
            @Valid @RequestBody AlbumRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        AlbumResponse updated = albumService.updateAlbum(albumId, request, email);
        return ResponseEntity.ok(ApiResponse.success("Album updated successfully", updated));
    }

    @DeleteMapping("/albums/{albumId}")
    public ResponseEntity<ApiResponse<Void>> deleteAlbum(@PathVariable Long albumId) {
        String email = securityUtils.getCurrentUserEmail();
        albumService.deleteAlbum(albumId, email);
        return ResponseEntity.ok(ApiResponse.success("Album deleted successfully", null));
    }
}
