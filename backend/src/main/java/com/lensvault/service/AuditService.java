package com.lensvault.service;

import com.lensvault.dto.AuditLogDto;
import com.lensvault.entity.AuditLog;
import com.lensvault.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(String actorEmail, String action, String resourceType, String resourceId, String details) {
        AuditLog log = new AuditLog(actorEmail, action, resourceType, resourceId, details);
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc().stream()
                .map(AuditLogDto::fromEntity)
                .collect(Collectors.toList());
    }
}
