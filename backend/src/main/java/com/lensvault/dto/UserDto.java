package com.lensvault.dto;

import com.lensvault.entity.Role;
import com.lensvault.entity.User;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.active = user.isActive();
        this.createdAt = user.getCreatedAt();
    }

    public static UserDto fromEntity(User user) {
        return new UserDto(user);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
