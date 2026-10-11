package com.lensvault.controller;

import com.lensvault.dto.ApiResponse;
import com.lensvault.dto.AuthRequest;
import com.lensvault.dto.AuthResponse;
import com.lensvault.dto.RegisterRequest;
import com.lensvault.dto.UserDto;
import com.lensvault.security.SecurityUtils;
import com.lensvault.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final SecurityUtils securityUtils;

    public AuthController(AuthService authService, SecurityUtils securityUtils) {
        this.authService = authService;
        this.securityUtils = securityUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        String email = securityUtils.getCurrentUserEmail();
        UserDto userDto = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", userDto));
    }
}
