package com.lensvault.service;

import com.lensvault.dto.*;
import com.lensvault.entity.*;
import com.lensvault.exception.BadRequestException;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.EventClientRepository;
import com.lensvault.repository.EventRepository;
import com.lensvault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClientAccessService {

    private final EventClientRepository eventClientRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public ClientAccessService(EventClientRepository eventClientRepository,
                               EventRepository eventRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder,
                               AuditService auditService) {
        this.eventClientRepository = eventClientRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Transactional
    public ClientAssignmentResponse assignClientToEvent(Long eventId, ClientAssignmentRequest request, String currentUserEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        if (currentUser.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the event photographer can assign clients to this event.");
        }

        String clientEmail = request.getClientEmail().trim().toLowerCase();
        User clientUser = userRepository.findByEmail(clientEmail).orElseGet(() -> {
            // Automatically provision a client account with default password if not existing
            User newClient = new User(
                    clientEmail.split("@")[0],
                    clientEmail,
                    passwordEncoder.encode("Client@123"),
                    Role.CLIENT
            );
            return userRepository.save(newClient);
        });

        if (clientUser.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrators cannot be assigned as clients.");
        }

        if (eventClientRepository.existsByEventAndClient(event, clientUser)) {
            throw new BadRequestException("Client " + clientEmail + " is already assigned to this event.");
        }

        String invitationToken = UUID.randomUUID().toString().replace("-", "");

        EventClient eventClient = new EventClient(
                event,
                clientUser,
                request.isAccessEnabled(),
                request.isDownloadEnabled(),
                invitationToken
        );

        EventClient saved = eventClientRepository.save(eventClient);

        auditService.log(currentUserEmail, "ASSIGN_CLIENT", "EVENT_CLIENT", saved.getId().toString(),
                "Assigned client " + clientEmail + " to event: " + event.getEventName());

        return ClientAssignmentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ClientAssignmentResponse> getClientsForEvent(Long eventId, String currentUserEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        if (currentUser.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the event photographer can view client assignments.");
        }

        List<EventClient> eventClients = eventClientRepository.findByEvent(event);
        return eventClients.stream().map(ClientAssignmentResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public ClientAssignmentResponse updateClientPermissions(Long eventId, Long clientId,
                                                            ClientPermissionUpdateRequest request,
                                                            String currentUserEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        if (currentUser.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the event photographer can update client permissions.");
        }

        EventClient assignment = eventClientRepository.findByEventIdAndClientId(eventId, clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found for client ID " + clientId + " in event " + eventId));

        assignment.setAccessEnabled(request.isAccessEnabled());
        assignment.setDownloadEnabled(request.isDownloadEnabled());
        EventClient updated = eventClientRepository.save(assignment);

        auditService.log(currentUserEmail, "UPDATE_CLIENT_PERMISSIONS", "EVENT_CLIENT", updated.getId().toString(),
                "Updated permissions for client " + updated.getClient().getEmail() + " in event: " + event.getEventName());

        return ClientAssignmentResponse.fromEntity(updated);
    }

    @Transactional
    public void revokeClientAccess(Long eventId, Long clientId, String currentUserEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + currentUserEmail));

        if (currentUser.getRole() != Role.ADMIN && !event.getPhotographer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the event photographer can revoke client access.");
        }

        EventClient assignment = eventClientRepository.findByEventIdAndClientId(eventId, clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found for client ID " + clientId + " in event " + eventId));

        eventClientRepository.delete(assignment);

        auditService.log(currentUserEmail, "REVOKE_CLIENT_ACCESS", "EVENT_CLIENT", assignment.getId().toString(),
                "Revoked access for client ID: " + clientId + " from event: " + event.getEventName());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsAssignedToClient(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientEmail));

        List<EventClient> assignments = eventClientRepository.findByClientAndAccessEnabledTrue(client);

        return assignments.stream().map(assignment -> {
            EventResponse resp = EventResponse.fromEntity(assignment.getEvent());
            resp.setDownloadAllowedForClient(assignment.isDownloadEnabled());
            return resp;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getClientEventDetails(Long eventId, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientEmail));

        EventClient assignment = eventClientRepository.findByEventIdAndClientId(eventId, client.getId())
                .orElseThrow(() -> new UnauthorizedException("You are not assigned to this event."));

        if (!assignment.isAccessEnabled()) {
            throw new UnauthorizedException("Your access to this event has been revoked by the photographer.");
        }

        EventResponse resp = EventResponse.fromEntity(assignment.getEvent());
        resp.setDownloadAllowedForClient(assignment.isDownloadEnabled());
        return resp;
    }
}
