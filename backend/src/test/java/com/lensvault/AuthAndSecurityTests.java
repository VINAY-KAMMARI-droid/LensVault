package com.lensvault;

import com.lensvault.dto.AuthRequest;
import com.lensvault.dto.AuthResponse;
import com.lensvault.dto.RegisterRequest;
import com.lensvault.entity.Role;
import com.lensvault.entity.User;
import com.lensvault.exception.BadRequestException;
import com.lensvault.exception.UnauthorizedException;
import com.lensvault.repository.UserRepository;
import com.lensvault.security.JwtTokenProvider;
import com.lensvault.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthAndSecurityTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Test Photographer Registration and BCrypt Hashing")
    void testRegistrationAndBcryptHashing() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "jane@lensvault.com",
                "SecurePass123!",
                Role.PHOTOGRAPHER
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("jane@lensvault.com", response.getUser().getEmail());
        assertEquals(Role.PHOTOGRAPHER, response.getUser().getRole());

        User saved = userRepository.findByEmail("jane@lensvault.com").orElse(null);
        assertNotNull(saved);
        assertNotEquals("SecurePass123!", saved.getPasswordHash());
        assertTrue(passwordEncoder.matches("SecurePass123!", saved.getPasswordHash()));
    }

    @Test
    @DisplayName("Test Restriction on Public Admin Registration")
    void testAdminRegistrationBlocked() {
        RegisterRequest request = new RegisterRequest(
                "Attacker",
                "attacker@lensvault.com",
                "Password123",
                Role.ADMIN
        );

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    @DisplayName("Test Duplicate Email Registration Rejection")
    void testDuplicateEmailRejected() {
        RegisterRequest request1 = new RegisterRequest("User One", "dup@lensvault.com", "Pass123", Role.CLIENT);
        authService.register(request1);

        RegisterRequest request2 = new RegisterRequest("User Two", "dup@lensvault.com", "Pass456", Role.CLIENT);
        assertThrows(BadRequestException.class, () -> authService.register(request2));
    }

    @Test
    @DisplayName("Test Login with Valid Credentials and JWT Generation")
    void testLoginSuccess() {
        RegisterRequest reg = new RegisterRequest("Client User", "client.login@lensvault.com", "MyPassword123", Role.CLIENT);
        authService.register(reg);

        AuthRequest loginRequest = new AuthRequest("client.login@lensvault.com", "MyPassword123");
        AuthResponse loginResponse = authService.login(loginRequest);

        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertTrue(jwtTokenProvider.validateToken(loginResponse.getToken()));
        assertEquals("client.login@lensvault.com", jwtTokenProvider.getUsernameFromJwt(loginResponse.getToken()));
    }

    @Test
    @DisplayName("Test Login with Invalid Password Rejection")
    void testLoginInvalidPassword() {
        RegisterRequest reg = new RegisterRequest("Client User", "client.test@lensvault.com", "CorrectPassword", Role.CLIENT);
        authService.register(reg);

        AuthRequest loginRequest = new AuthRequest("client.test@lensvault.com", "WrongPassword");
        assertThrows(Exception.class, () -> authService.login(loginRequest));
    }

    @Test
    @DisplayName("Test Deactivated User Login Rejection")
    void testDeactivatedUserLogin() {
        RegisterRequest reg = new RegisterRequest("Client Inactive", "client.inactive@lensvault.com", "Pass123", Role.CLIENT);
        authService.register(reg);

        User user = userRepository.findByEmail("client.inactive@lensvault.com").orElseThrow();
        user.setActive(false);
        userRepository.save(user);

        AuthRequest loginRequest = new AuthRequest("client.inactive@lensvault.com", "Pass123");
        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
