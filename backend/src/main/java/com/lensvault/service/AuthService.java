package com.lensvault.service;

import com.lensvault.dto.*;
import com.lensvault.entity.Role;
import com.lensvault.entity.User;
import com.lensvault.exception.BadRequestException;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.UserRepository;
import com.lensvault.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrator registration is restricted. Please contact platform administrators.");
        }

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );

        User savedUser = userRepository.save(user);

        auditService.log(savedUser.getEmail(), "USER_REGISTERED", "USER", savedUser.getId().toString(),
                "New " + savedUser.getRole() + " registered: " + savedUser.getFullName());

        String token = jwtTokenProvider.generateTokenFromEmail(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole().name(),
                savedUser.getFullName()
        );

        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact an administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        auditService.log(user.getEmail(), "USER_LOGIN", "USER", user.getId().toString(), "User logged in successfully");

        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDto.fromEntity(user);
    }
}
