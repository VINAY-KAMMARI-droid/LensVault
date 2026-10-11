package com.lensvault.controller;

import com.lensvault.dto.ApiResponse;
import com.lensvault.dto.MediaResponse;
import com.lensvault.entity.Media;
import com.lensvault.security.SecurityUtils;
import com.lensvault.service.MediaService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class MediaController {

    private final MediaService mediaService;
    private final SecurityUtils securityUtils;

    public MediaController(MediaService mediaService, SecurityUtils securityUtils) {
        this.mediaService = mediaService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/albums/{albumId}/media")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> getAlbumMedia(@PathVariable Long albumId) {
        String email = securityUtils.getCurrentUserEmail();
        List<MediaResponse> mediaList = mediaService.getMediaByAlbumId(albumId, email);
        return ResponseEntity.ok(ApiResponse.success(mediaList));
    }

    @PostMapping(value = "/albums/{albumId}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<MediaResponse>>> uploadMedia(
            @PathVariable Long albumId,
            @RequestParam("files") MultipartFile[] files) {
        String email = securityUtils.getCurrentUserEmail();
        List<MediaResponse> uploaded = mediaService.uploadMedia(albumId, files, email);
        return new ResponseEntity<>(ApiResponse.success("Media uploaded successfully", uploaded), HttpStatus.CREATED);
    }

    @GetMapping("/media/{mediaId}/preview")
    public ResponseEntity<Resource> previewMedia(@PathVariable Long mediaId) {
        String email = securityUtils.getCurrentUserEmail();
        Media media = mediaService.getMediaEntityWithAccessCheck(mediaId, email, false);
        Resource resource = mediaService.loadMediaResource(media.getStoredFilename());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, media.getContentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getOriginalFilename() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(resource);
    }

    @GetMapping("/media/{mediaId}/download")
    public ResponseEntity<Resource> downloadMedia(@PathVariable Long mediaId) {
        String email = securityUtils.getCurrentUserEmail();
        Media media = mediaService.getMediaEntityWithAccessCheck(mediaId, email, true);
        Resource resource = mediaService.loadMediaResource(media.getStoredFilename());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, media.getContentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + media.getOriginalFilename() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(resource);
    }

    @DeleteMapping("/media/{mediaId}")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable Long mediaId) {
        String email = securityUtils.getCurrentUserEmail();
        mediaService.deleteMedia(mediaId, email);
        return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
    }
}
