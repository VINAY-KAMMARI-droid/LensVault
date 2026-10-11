package com.lensvault.storage;

import com.lensvault.exception.BadRequestException;
import com.lensvault.exception.ResourceNotFoundException;
import com.lensvault.exception.StorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path rootLocation;
    private final List<String> allowedImageTypes;
    private final List<String> allowedVideoTypes;

    public LocalStorageService(
            @Value("${app.storage.upload-dir:storage/uploads}") String uploadDir,
            @Value("${app.storage.allowed-image-types:image/jpeg,image/png,image/webp}") List<String> allowedImageTypes,
            @Value("${app.storage.allowed-video-types:video/mp4,video/webm}") List<String> allowedVideoTypes) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.allowedImageTypes = allowedImageTypes;
        this.allowedVideoTypes = allowedVideoTypes;
    }

    @Override
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage directory: " + rootLocation, e);
        }
    }

    @Override
    public String validateAndDetermineContentType(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String contentType = file.getContentType();
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");

        // Basic extension verification
        String lowerFilename = originalFilename.toLowerCase();
        boolean validExt = lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")
                || lowerFilename.endsWith(".png") || lowerFilename.endsWith(".webp")
                || lowerFilename.endsWith(".mp4") || lowerFilename.endsWith(".webm");

        if (!validExt) {
            throw new BadRequestException("Unsupported file type. Only JPEG, PNG, WebP images and MP4, WebM videos are allowed.");
        }

        // Content-Type validation
        if (contentType == null || (!allowedImageTypes.contains(contentType.toLowerCase()) && !allowedVideoTypes.contains(contentType.toLowerCase()))) {
            // infer if possible from extension
            if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (lowerFilename.endsWith(".png")) {
                contentType = "image/png";
            } else if (lowerFilename.endsWith(".webp")) {
                contentType = "image/webp";
            } else if (lowerFilename.endsWith(".mp4")) {
                contentType = "video/mp4";
            } else if (lowerFilename.endsWith(".webm")) {
                contentType = "video/webm";
            } else {
                throw new BadRequestException("Unsupported media content-type: " + contentType);
            }
        }

        return contentType;
    }

    @Override
    public String store(MultipartFile file) {
        validateAndDetermineContentType(file);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Cannot store file with relative path outside current directory: " + originalFilename);
        }

        String fileExtension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFilename.substring(dotIndex);
        }

        String storedFilename = UUID.randomUUID().toString() + fileExtension;
        Path destinationFile = this.rootLocation.resolve(storedFilename).normalize().toAbsolutePath();

        if (!destinationFile.getParent().equals(this.rootLocation)) {
            throw new BadRequestException("Cannot store file outside current storage directory.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException e) {
            throw new StorageException("Failed to store file: " + originalFilename, e);
        }
    }

    @Override
    public String storeBytes(byte[] content, String originalFilename, String contentType) {
        String cleanName = StringUtils.cleanPath(originalFilename);
        String fileExtension = "";
        int dotIndex = cleanName.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = cleanName.substring(dotIndex);
        }

        String storedFilename = UUID.randomUUID().toString() + fileExtension;
        Path destinationFile = this.rootLocation.resolve(storedFilename).normalize().toAbsolutePath();

        if (!destinationFile.getParent().equals(this.rootLocation)) {
            throw new BadRequestException("Cannot store file outside current storage directory.");
        }

        try (InputStream inputStream = new ByteArrayInputStream(content)) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException e) {
            throw new StorageException("Failed to store generated file: " + originalFilename, e);
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename).normalize().toAbsolutePath();
            if (!file.startsWith(rootLocation)) {
                throw new BadRequestException("Access denied to requested file path.");
            }
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Could not find file: " + filename);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            Path file = load(filename).normalize().toAbsolutePath();
            if (file.startsWith(rootLocation) && Files.exists(file)) {
                Files.delete(file);
            }
        } catch (IOException e) {
            // Log and allow flow to continue
            System.err.println("Could not delete file: " + filename + " error: " + e.getMessage());
        }
    }
}
