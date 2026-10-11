package com.lensvault.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Path;

public interface StorageService {
    void init();

    String store(MultipartFile file);

    String storeBytes(byte[] content, String originalFilename, String contentType);

    Path load(String filename);

    Resource loadAsResource(String filename);

    void delete(String filename);

    String validateAndDetermineContentType(MultipartFile file);
}
