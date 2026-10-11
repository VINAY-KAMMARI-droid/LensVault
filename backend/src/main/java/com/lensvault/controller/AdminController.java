package com.lensvault.controller;

import com.lensvault.dto.*;
import com.lensvault.entity.Role;
import com.lensvault.security.SecurityUtils;
import com.lensvault.service.AdminService;
import com.lensvault.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuditService auditService;
    private final SecurityUtils securityUtils;

    public AdminController(AdminService adminService, AuditService auditService, SecurityUtils securityUtils) {
        this.adminService = adminService;
        this.auditService = auditService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardStats() {
        AdminDashboardDto dto = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search) {
        List<UserDto> users = adminService.getAllUsers(role, search);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UserStatusUpdateRequest request) {
        String adminEmail = securityUtils.getCurrentUserEmail();
        UserDto updated = adminService.updateUserStatus(userId, request.isActive(), adminEmail);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs() {
        List<AuditLogDto> logs = auditService.getRecentLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
