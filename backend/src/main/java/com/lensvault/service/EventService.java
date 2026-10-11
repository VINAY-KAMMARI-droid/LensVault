package com.lensvault.service;

import com.lensvault.dto.EventRequest;
import com.lensvault.dto.EventResponse;
import com.lensvault.dto.PhotographerDashboardDto;
import com.lensvault.dto.MediaResponse;
import com.lensvault.entity.*;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.*;
import com.lensvault.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final MediaRepository mediaRepository;
    private final EventClientRepository eventClientRepository;
    private final StorageService storageService;
    private final AuditService auditService;

    public EventService(EventRepository eventRepository,
                        UserRepository userRepository,
                        AlbumRepository albumRepository,
                        MediaRepository mediaRepository,
                        EventClientRepository eventClientRepository,
                        StorageService storageService,
                        AuditService auditService) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.albumRepository = albumRepository;
        this.mediaRepository = mediaRepository;
        this.eventClientRepository = eventClientRepository;
        this.storageService = storageService;
        this.auditService = auditService;
    }

    private User getPhotographer(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Photographer not found with email: " + email));
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, String photographerEmail) {
        User photographer = getPhotographer(photographerEmail);

        Event event = new Event();
        event.setEventName(request.getEventName());
        event.setEventType(request.getEventType());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setDescription(request.getDescription());
        event.setStatus(request.getStatus() != null ? request.getStatus() : EventStatus.ACTIVE);
        event.setCoverImageUrl(request.getCoverImageUrl());
        event.setPhotographer(photographer);

        Event savedEvent = eventRepository.save(event);

        auditService.log(photographerEmail, "CREATE_EVENT", "EVENT", savedEvent.getId().toString(),
                "Created event: " + savedEvent.getEventName());

        return EventResponse.fromEntity(savedEvent);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsForPhotographer(String photographerEmail, String search) {
        User photographer = getPhotographer(photographerEmail);
        List<Event> events;

        if (search != null && !search.trim().isEmpty()) {
            events = eventRepository.findByPhotographerAndEventNameContainingIgnoreCaseOrderByCreatedAtDesc(photographer, search.trim());
        } else {
            events = eventRepository.findByPhotographerOrderByCreatedAtDesc(photographer);
        }

        return events.stream().map(EventResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id, String currentUserEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        // Check ownership or admin
        if (user.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have access to view this event.");
        }

        return EventResponse.fromEntity(event);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request, String photographerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        User user = getPhotographer(photographerEmail);
        if (user.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this event.");
        }

        event.setEventName(request.getEventName());
        event.setEventType(request.getEventType());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }
        if (request.getCoverImageUrl() != null) {
            event.setCoverImageUrl(request.getCoverImageUrl());
        }

        Event updated = eventRepository.save(event);

        auditService.log(photographerEmail, "UPDATE_EVENT", "EVENT", updated.getId().toString(),
                "Updated event: " + updated.getEventName());

        return EventResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteEvent(Long id, String photographerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        User user = getPhotographer(photographerEmail);
        if (user.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this event.");
        }

        // Delete physical files for all media in this event's albums
        if (event.getAlbums() != null) {
            for (Album album : event.getAlbums()) {
                if (album.getMediaList() != null) {
                    for (Media media : album.getMediaList()) {
                        storageService.delete(media.getStoredFilename());
                    }
                }
            }
        }

        eventRepository.delete(event);

        auditService.log(photographerEmail, "DELETE_EVENT", "EVENT", id.toString(),
                "Deleted event: " + event.getEventName());
    }

    @Transactional(readOnly = true)
    public PhotographerDashboardDto getPhotographerDashboardStats(String photographerEmail) {
        User photographer = getPhotographer(photographerEmail);

        long totalEvents = eventRepository.countByPhotographer(photographer);
        long totalAlbums = albumRepository.countByPhotographer(photographer);
        long totalMedia = mediaRepository.countByPhotographer(photographer);
        long totalImages = mediaRepository.countByPhotographerAndType(photographer, MediaType.IMAGE);
        long totalVideos = mediaRepository.countByPhotographerAndType(photographer, MediaType.VIDEO);
        long totalClients = eventClientRepository.countDistinctClientsByPhotographer(photographer);

        List<EventResponse> recentEvents = eventRepository.findTop5ByPhotographerOrderByCreatedAtDesc(photographer)
                .stream().map(EventResponse::fromEntity).collect(Collectors.toList());

        List<MediaResponse> recentMedia = mediaRepository.findRecentMediaByPhotographer(photographer)
                .stream().limit(8).map(MediaResponse::fromEntity).collect(Collectors.toList());

        PhotographerDashboardDto dto = new PhotographerDashboardDto();
        dto.setTotalEvents(totalEvents);
        dto.setTotalAlbums(totalAlbums);
        dto.setTotalMedia(totalMedia);
        dto.setTotalImages(totalImages);
        dto.setTotalVideos(totalVideos);
        dto.setTotalClients(totalClients);
        dto.setRecentEvents(recentEvents);
        dto.setRecentMedia(recentMedia);

        return dto;
    }
}
