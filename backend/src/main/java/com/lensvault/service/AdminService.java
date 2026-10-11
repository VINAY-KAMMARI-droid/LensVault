package com.lensvault.service;

import com.lensvault.dto.AdminDashboardDto;
import com.lensvault.dto.AuditLogDto;
import com.lensvault.dto.UserDto;
import com.lensvault.entity.Role;
import com.lensvault.entity.User;
import com.lensvault.exception.BadRequestException;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final AlbumRepository albumRepository;
    private final MediaRepository mediaRepository;
    private final AuditService auditService;

    public AdminService(UserRepository userRepository,
                        EventRepository eventRepository,
                        AlbumRepository albumRepository,
                        MediaRepository mediaRepository,
                        AuditService auditService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.albumRepository = albumRepository;
        this.mediaRepository = mediaRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalPhotographers(userRepository.countByRole(Role.PHOTOGRAPHER));
        dto.setTotalClients(userRepository.countByRole(Role.CLIENT));
        dto.setTotalAdmins(userRepository.countByRole(Role.ADMIN));
        dto.setTotalEvents(eventRepository.count());
        dto.setTotalAlbums(albumRepository.count());
        dto.setTotalMedia(mediaRepository.count());
        dto.setTotalStorageBytes(mediaRepository.totalStorageUsed());
        dto.setRecentActivity(auditService.getRecentLogs());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(Role roleFilter, String search) {
        List<User> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search.trim(), search.trim());
        } else if (roleFilter != null) {
            users = userRepository.findByRole(roleFilter);
        } else {
            users = userRepository.findAll();
        }

        return users.stream().map(UserDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, boolean active, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new BadRequestException("Administrators cannot deactivate their own account.");
        }

        user.setActive(active);
        User saved = userRepository.save(user);

        auditService.log(adminEmail, "UPDATE_USER_STATUS", "USER", userId.toString(),
                "Set active=" + active + " for user: " + user.getEmail());

        return UserDto.fromEntity(saved);
    }
}
