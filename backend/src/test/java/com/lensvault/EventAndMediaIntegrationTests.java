package com.lensvault;

import com.lensvault.dto.*;
import com.lensvault.entity.EventStatus;
import com.lensvault.entity.Role;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.*;
import com.lensvault.service.*;
import com.lensvault.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class EventAndMediaIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private EventService eventService;

    @Autowired
    private AlbumService albumService;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private ClientAccessService clientAccessService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    private String photographer1Email = "photo1@lensvault.com";
    private String photographer2Email = "photo2@lensvault.com";
    private String client1Email = "client1@lensvault.com";
    private String client2Email = "client2@lensvault.com";

    @BeforeEach
    void setUp() {
        authService.register(new RegisterRequest("Photo One", photographer1Email, "Pass123!", Role.PHOTOGRAPHER));
        authService.register(new RegisterRequest("Photo Two", photographer2Email, "Pass123!", Role.PHOTOGRAPHER));
        authService.register(new RegisterRequest("Client One", client1Email, "Pass123!", Role.CLIENT));
        authService.register(new RegisterRequest("Client Two", client2Email, "Pass123!", Role.CLIENT));
    }

    @Test
    @DisplayName("Test Event Creation and Ownership Isolation")
    void testEventCreationAndOwnership() {
        EventRequest eventRequest = new EventRequest();
        eventRequest.setEventName("Beach Wedding");
        eventRequest.setEventType("Wedding");
        eventRequest.setEventDate(LocalDate.now());
        eventRequest.setVenue("Sunny Beach");
        eventRequest.setDescription("Beautiful sunset ceremony");
        eventRequest.setStatus(EventStatus.ACTIVE);

        EventResponse created = eventService.createEvent(eventRequest, photographer1Email);
        assertNotNull(created.getId());
        assertEquals("Beach Wedding", created.getEventName());

        // Photographer 1 can access it
        EventResponse fetched = eventService.getEventById(created.getId(), photographer1Email);
        assertEquals("Beach Wedding", fetched.getEventName());

        // Photographer 2 is rejected
        assertThrows(UnauthorizedException.class, () ->
                eventService.getEventById(created.getId(), photographer2Email));
    }

    @Test
    @DisplayName("Test Client Assignment and Controlled Event Visibility")
    void testClientAccessControl() {
        EventRequest eventRequest = new EventRequest();
        eventRequest.setEventName("Corporate Gala");
        eventRequest.setEventType("Corporate");
        eventRequest.setEventDate(LocalDate.now());
        EventResponse event = eventService.createEvent(eventRequest, photographer1Email);

        // Client 1 is assigned to event
        ClientAssignmentRequest assignReq = new ClientAssignmentRequest(client1Email, true, true);
        clientAccessService.assignClientToEvent(event.getId(), assignReq, photographer1Email);

        // Client 1 can view assigned event
        List<EventResponse> client1Events = clientAccessService.getEventsAssignedToClient(client1Email);
        assertEquals(1, client1Events.size());
        assertEquals("Corporate Gala", client1Events.get(0).getEventName());

        // Client 2 (not assigned) has 0 events and is forbidden from viewing details
        List<EventResponse> client2Events = clientAccessService.getEventsAssignedToClient(client2Email);
        assertEquals(0, client2Events.size());

        assertThrows(UnauthorizedException.class, () ->
                clientAccessService.getClientEventDetails(event.getId(), client2Email));
    }

    @Test
    @DisplayName("Test Media Upload, Album Creation, and Client Download Permission Enforcement")
    void testMediaAndDownloadPermissions() {
        EventRequest eventRequest = new EventRequest();
        eventRequest.setEventName("Anniversary Soiree");
        eventRequest.setEventType("Anniversary");
        eventRequest.setEventDate(LocalDate.now());
        EventResponse event = eventService.createEvent(eventRequest, photographer1Email);

        // Create Album
        AlbumRequest albumRequest = new AlbumRequest("Portraits", "Formal couple portraits");
        AlbumResponse album = albumService.createAlbum(event.getId(), albumRequest, photographer1Email);
        assertNotNull(album.getId());

        // Assign Client 1 with downloads DISABLED
        ClientAssignmentRequest assignReq = new ClientAssignmentRequest(client1Email, true, false);
        clientAccessService.assignClientToEvent(event.getId(), assignReq, photographer1Email);

        // Upload a valid test photo
        MockMultipartFile photo = new MockMultipartFile(
                "files",
                "test_portrait.jpg",
                "image/jpeg",
                new byte[]{1, 2, 3, 4, 5, 6}
        );

        List<MediaResponse> uploaded = mediaService.uploadMedia(album.getId(), new MockMultipartFile[]{photo}, photographer1Email);
        assertEquals(1, uploaded.size());
        Long mediaId = uploaded.get(0).getId();

        // Client 1 can preview media (checkDownloadPermission = false)
        assertDoesNotThrow(() ->
                mediaService.getMediaEntityWithAccessCheck(mediaId, client1Email, false));

        // Client 1 CANNOT download media because downloadEnabled is false!
        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () ->
                mediaService.getMediaEntityWithAccessCheck(mediaId, client1Email, true));
        assertTrue(ex.getMessage().contains("Downloads are disabled"));

        // Update permission to enable download
        clientAccessService.updateClientPermissions(
                event.getId(),
                userRepository.findByEmail(client1Email).orElseThrow().getId(),
                new ClientPermissionUpdateRequest(true, true),
                photographer1Email
        );

        // Now download succeeds
        assertDoesNotThrow(() ->
                mediaService.getMediaEntityWithAccessCheck(mediaId, client1Email, true));
    }
}
