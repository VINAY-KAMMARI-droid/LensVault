package com.lensvault.service;

import com.lensvault.dto.AlbumRequest;
import com.lensvault.dto.AlbumResponse;
import com.lensvault.entity.*;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.AlbumRepository;
import com.lensvault.repository.EventClientRepository;
import com.lensvault.repository.EventRepository;
import com.lensvault.repository.UserRepository;
import com.lensvault.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventClientRepository eventClientRepository;
    private final StorageService storageService;
    private final AuditService auditService;

    public AlbumService(AlbumRepository albumRepository,
                        EventRepository eventRepository,
                        UserRepository userRepository,
                        EventClientRepository eventClientRepository,
                        StorageService storageService,
                        AuditService auditService) {
        this.albumRepository = albumRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventClientRepository = eventClientRepository;
        this.storageService = storageService;
        this.auditService = auditService;
    }

    @Transactional
    public AlbumResponse createAlbum(Long eventId, AlbumRequest request, String currentUserEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the event photographer can create albums for this event.");
        }

        Album album = new Album(request.getAlbumName(), request.getDescription(), event);
        Album saved = albumRepository.save(album);

        auditService.log(currentUserEmail, "CREATE_ALBUM", "ALBUM", saved.getId().toString(),
                "Created album '" + saved.getAlbumName() + "' in event: " + event.getEventName());

        return AlbumResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<AlbumResponse> getAlbumsByEventId(Long eventId, String currentUserEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Verify access: owner, admin, or assigned client with accessEnabled
        if (user.getRole() == Role.CLIENT) {
            EventClient assignment = eventClientRepository.findByEventAndClient(event, user)
                    .orElseThrow(() -> new UnauthorizedException("You are not assigned to this event."));
            if (!assignment.isAccessEnabled()) {
                throw new UnauthorizedException("Access to this event has been revoked by the photographer.");
            }
        } else if (user.getRole() == Role.PHOTOGRAPHER && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have access to this event's albums.");
        }

        List<Album> albums = albumRepository.findByEventOrderByCreatedAtDesc(event);
        return albums.stream().map(AlbumResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AlbumResponse getAlbumById(Long albumId, String currentUserEmail) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with ID: " + albumId));

        return AlbumResponse.fromEntity(album);
    }

    @Transactional
    public AlbumResponse updateAlbum(Long albumId, AlbumRequest request, String currentUserEmail) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with ID: " + albumId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getRole() != Role.ADMIN && !album.getEvent().getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this album.");
        }

        album.setAlbumName(request.getAlbumName());
        album.setDescription(request.getDescription());
        Album updated = albumRepository.save(album);

        auditService.log(currentUserEmail, "UPDATE_ALBUM", "ALBUM", updated.getId().toString(),
                "Updated album: " + updated.getAlbumName());

        return AlbumResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteAlbum(Long albumId, String currentUserEmail) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with ID: " + albumId));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getRole() != Role.ADMIN && !album.getEvent().getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this album.");
        }

        // Delete physical files
        if (album.getMediaList() != null) {
            for (Media media : album.getMediaList()) {
                storageService.delete(media.getStoredFilename());
            }
        }

        albumRepository.delete(album);

        auditService.log(currentUserEmail, "DELETE_ALBUM", "ALBUM", albumId.toString(),
                "Deleted album: " + album.getAlbumName());
    }
}
