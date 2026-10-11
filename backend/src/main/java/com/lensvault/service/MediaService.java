package com.lensvault.service;

import com.lensvault.dto.MediaResponse;
import com.lensvault.entity.*;
import com.lensvault.exception.BadRequestException;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.AlbumRepository;
import com.lensvault.repository.EventClientRepository;
import com.lensvault.repository.MediaRepository;
import com.lensvault.repository.UserRepository;
import com.lensvault.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;
    private final EventClientRepository eventClientRepository;
    private final StorageService storageService;
    private final AuditService auditService;

    public MediaService(MediaRepository mediaRepository,
                        AlbumRepository albumRepository,
                        UserRepository userRepository,
                        EventClientRepository eventClientRepository,
                        StorageService storageService,
                        AuditService auditService) {
        this.mediaRepository = mediaRepository;
        this.albumRepository = albumRepository;
        this.userRepository = userRepository;
        this.eventClientRepository = eventClientRepository;
        this.storageService = storageService;
        this.auditService = auditService;
    }

    @Transactional
    public List<MediaResponse> uploadMedia(Long albumId, MultipartFile[] files, String currentUserEmail) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with ID: " + albumId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        Event event = album.getEvent();
        if (user.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the event photographer can upload media to this album.");
        }

        if (files == null || files.length == 0) {
            throw new BadRequestException("No files were provided for upload.");
        }

        List<MediaResponse> savedMediaList = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            String contentType = storageService.validateAndDetermineContentType(file);
            String storedFilename = storageService.store(file);
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");

            MediaType mediaType = contentType.startsWith("video") ? MediaType.VIDEO : MediaType.IMAGE;

            Media media = new Media(
                    originalFilename,
                    storedFilename,
                    "storage/uploads/" + storedFilename,
                    contentType,
                    file.getSize(),
                    mediaType,
                    album,
                    user
            );

            Media saved = mediaRepository.save(media);
            savedMediaList.add(MediaResponse.fromEntity(saved));
        }

        auditService.log(currentUserEmail, "UPLOAD_MEDIA", "ALBUM", albumId.toString(),
                "Uploaded " + savedMediaList.size() + " files to album: " + album.getAlbumName());

        return savedMediaList;
    }

    @Transactional(readOnly = true)
    public List<MediaResponse> getMediaByAlbumId(Long albumId, String currentUserEmail) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with ID: " + albumId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Event event = album.getEvent();

        if (user.getRole() == Role.CLIENT) {
            EventClient assignment = eventClientRepository.findByEventAndClient(event, user)
                    .orElseThrow(() -> new UnauthorizedException("You are not assigned to this event."));
            if (!assignment.isAccessEnabled()) {
                throw new UnauthorizedException("Access to this event has been revoked.");
            }
        } else if (user.getRole() == Role.PHOTOGRAPHER && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have access to this album's media.");
        }

        List<Media> mediaList = mediaRepository.findByAlbumOrderByCreatedAtDesc(album);
        return mediaList.stream().map(MediaResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Media getMediaEntityWithAccessCheck(Long mediaId, String currentUserEmail, boolean checkDownloadPermission) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with ID: " + mediaId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        Event event = media.getAlbum().getEvent();

        if (user.getRole() == Role.CLIENT) {
            EventClient assignment = eventClientRepository.findByEventAndClient(event, user)
                    .orElseThrow(() -> new UnauthorizedException("You do not have access to media from this event."));

            if (!assignment.isAccessEnabled()) {
                throw new UnauthorizedException("Your access to this event has been revoked.");
            }

            if (checkDownloadPermission && !assignment.isDownloadEnabled()) {
                throw new UnauthorizedException("Downloads are disabled for your account on this event.");
            }
        } else if (user.getRole() == Role.PHOTOGRAPHER && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access media from this event.");
        }

        return media;
    }

    public Resource loadMediaResource(String storedFilename) {
        return storageService.loadAsResource(storedFilename);
    }

    @Transactional
    public void deleteMedia(Long mediaId, String currentUserEmail) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with ID: " + mediaId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Event event = media.getAlbum().getEvent();
        if (user.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this media.");
        }

        storageService.delete(media.getStoredFilename());
        mediaRepository.delete(media);

        auditService.log(currentUserEmail, "DELETE_MEDIA", "MEDIA", mediaId.toString(),
                "Deleted media file: " + media.getOriginalFilename());
    }
}
