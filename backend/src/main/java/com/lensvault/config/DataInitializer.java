package com.lensvault.config;

import com.lensvault.entity.*;
import com.lensvault.repository.*;
import com.lensvault.storage.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.lensvault.entity.Event;
import javax.imageio.ImageIO;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.GradientPaint;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final AlbumRepository albumRepository;
    private final MediaRepository mediaRepository;
    private final EventClientRepository eventClientRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    @Value("${app.demo.seed-data:true}")
    private boolean seedData;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           AlbumRepository albumRepository,
                           MediaRepository mediaRepository,
                           EventClientRepository eventClientRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder,
                           StorageService storageService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.albumRepository = albumRepository;
        this.mediaRepository = mediaRepository;
        this.eventClientRepository = eventClientRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.storageService = storageService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedData) {
            return;
        }

        // Check if admin already exists
        if (userRepository.existsByEmail("admin@lensvault.com")) {
            return;
        }

        // 1. Create Administrator
        User admin = new User(
                "System Administrator",
                "admin@lensvault.com",
                passwordEncoder.encode("Admin@123"),
                Role.ADMIN
        );
        userRepository.save(admin);

        // 2. Create Photographer
        User photographer = new User(
                "Alexander Wright",
                "photographer@lensvault.com",
                passwordEncoder.encode("Photographer@123"),
                Role.PHOTOGRAPHER
        );
        photographer = userRepository.save(photographer);

        // 3. Create Clients
        User client1 = new User(
                "Sarah Jenkins",
                "client.sarah@lensvault.com",
                passwordEncoder.encode("Client@123"),
                Role.CLIENT
        );
        client1 = userRepository.save(client1);

        User client2 = new User(
                "David Miller",
                "client.david@lensvault.com",
                passwordEncoder.encode("Client@123"),
                Role.CLIENT
        );
        client2 = userRepository.save(client2);

        // 4. Create Sample Events
        Event weddingEvent = new Event();
        weddingEvent.setEventName("Sarah & Liam Royal Wedding");
        weddingEvent.setEventType("Wedding");
        weddingEvent.setEventDate(LocalDate.now().minusDays(15));
        weddingEvent.setVenue("The Grand Belle Estate, Napa Valley");
        weddingEvent.setDescription("A magical outdoor vineyard ceremony and golden hour reception capturing intimate, candid moments.");
        weddingEvent.setStatus(EventStatus.ACTIVE);
        weddingEvent.setCoverImageUrl("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80");
        weddingEvent.setPhotographer(photographer);
        weddingEvent = eventRepository.save(weddingEvent);

        Event birthdayEvent = new Event();
        birthdayEvent.setEventName("Sophia's 18th Milestone Celebration");
        birthdayEvent.setEventType("Birthday");
        birthdayEvent.setEventDate(LocalDate.now().minusDays(5));
        birthdayEvent.setVenue("Skyline Terrace Ballroom");
        birthdayEvent.setDescription("Vibrant birthday celebration filled with music, laughter, and cinematic portraits under neon ambient lighting.");
        birthdayEvent.setStatus(EventStatus.ACTIVE);
        birthdayEvent.setCoverImageUrl("https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80");
        birthdayEvent.setPhotographer(photographer);
        birthdayEvent = eventRepository.save(birthdayEvent);

        Event farewellEvent = new Event();
        farewellEvent.setEventName("Apex Institute CS Batch Farewell 2026");
        farewellEvent.setEventType("College Farewell");
        farewellEvent.setEventDate(LocalDate.now().minusDays(30));
        farewellEvent.setVenue("Main Auditorium & Campus Quad");
        farewellEvent.setDescription("A nostalgic evening commemorating memories, batch photos, awards, and candid student interactions.");
        farewellEvent.setStatus(EventStatus.COMPLETED);
        farewellEvent.setCoverImageUrl("https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80");
        farewellEvent.setPhotographer(photographer);
        farewellEvent = eventRepository.save(farewellEvent);

        Event engagementEvent = new Event();
        engagementEvent.setEventName("Golden Sunset Engagement Session");
        engagementEvent.setEventType("Engagement");
        engagementEvent.setEventDate(LocalDate.now().plusDays(10));
        engagementEvent.setVenue("Pacific Coast Cliffs & Beach");
        engagementEvent.setDescription("Intimate pre-wedding beach session capturing sunset reflections, waves, and couple portraits.");
        engagementEvent.setStatus(EventStatus.ACTIVE);
        engagementEvent.setCoverImageUrl("https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80");
        engagementEvent.setPhotographer(photographer);
        engagementEvent = eventRepository.save(engagementEvent);

        // 5. Assign Clients to Events
        // Client 1 (Sarah) assigned to Wedding event with Download ENABLED
        EventClient ec1 = new EventClient(
                weddingEvent,
                client1,
                true, // accessEnabled
                true, // downloadEnabled
                UUID.randomUUID().toString().replace("-", "")
        );
        eventClientRepository.save(ec1);

        // Client 2 (David) assigned to Birthday event with Download DISABLED (to test permission enforcement)
        EventClient ec2 = new EventClient(
                birthdayEvent,
                client2,
                true, // accessEnabled
                false, // downloadEnabled (tests client download permission lock)
                UUID.randomUUID().toString().replace("-", "")
        );
        eventClientRepository.save(ec2);

        // 6. Create Albums
        Album weddingAlbum1 = new Album("Ceremony & Vows", "Highlights of exchange of vows and floral walk", weddingEvent);
        weddingAlbum1 = albumRepository.save(weddingAlbum1);

        Album weddingAlbum2 = new Album("Portraits & Reception", "Couples portraits, champagne toasts, and family photos", weddingEvent);
        weddingAlbum2 = albumRepository.save(weddingAlbum2);

        Album birthdayAlbum1 = new Album("Party Highlights", "Cake cutting, confetti moments, and group dance", birthdayEvent);
        birthdayAlbum1 = albumRepository.save(birthdayAlbum1);

        Album farewellAlbum1 = new Album("Batch Memories", "Formal group photos and candid stage moments", farewellEvent);
        farewellAlbum1 = albumRepository.save(farewellAlbum1);

        // 7. Generate Real High-Resolution Photographic Sample Files and Persist Media
        seedMediaSample(weddingAlbum1, photographer, "Ceremony Vows - Golden Hour", "ceremony_vows_01.jpg",
                new Color(30, 25, 20), new Color(212, 175, 55), "Sarah & Liam Wedding — Vows Exchange");
        seedMediaSample(weddingAlbum1, photographer, "First Kiss at The Altar", "ceremony_kiss_02.jpg",
                new Color(40, 20, 25), new Color(230, 190, 138), "Sarah & Liam Wedding — First Kiss");
        seedMediaSample(weddingAlbum1, photographer, "Floral Walk Exit", "floral_walk_03.jpg",
                new Color(25, 35, 30), new Color(200, 220, 190), "Sarah & Liam Wedding — Floral Walk");

        seedMediaSample(weddingAlbum2, photographer, "Sunset Vineyard Portrait", "reception_portrait_01.jpg",
                new Color(45, 30, 20), new Color(245, 200, 100), "Sarah & Liam — Sunset Vineyard Portrait");
        seedMediaSample(weddingAlbum2, photographer, "Champagne Celebration", "reception_toast_02.jpg",
                new Color(20, 25, 35), new Color(210, 180, 120), "Sarah & Liam — Champagne Toast");

        seedMediaSample(birthdayAlbum1, photographer, "Cake Cutting Moment", "birthday_cake_01.jpg",
                new Color(35, 20, 45), new Color(255, 180, 220), "Sophia's 18th — Cake Cutting");
        seedMediaSample(birthdayAlbum1, photographer, "Sparkler Send-off", "birthday_sparklers_02.jpg",
                new Color(25, 25, 25), new Color(255, 215, 0), "Sophia's 18th — Golden Sparklers");

        seedMediaSample(farewellAlbum1, photographer, "Computer Science Class of 2026", "batch_photo_01.jpg",
                new Color(20, 30, 40), new Color(130, 190, 250), "Apex CS 2026 — Batch Commemorative");

        // 8. Create Initial Audit Logs
        AuditLog log1 = new AuditLog("system", "SYSTEM_INITIALIZATION", "SYSTEM", "1",
                "LensVault demo environment seeded with users, events, albums, and authentic media assets.");
        auditLogRepository.save(log1);
    }

    private void seedMediaSample(Album album, User uploader, String title, String originalFilename,
                                 Color bg1, Color accent, String bannerText) {
        try {
            int width = 1280;
            int height = 853;
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = image.createGraphics();

            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            // Draw rich dark background gradient
            GradientPaint gradient = new GradientPaint(0, 0, bg1, width, height, bg1.darker());
            g2d.setPaint(gradient);
            g2d.fillRect(0, 0, width, height);

            // Draw decorative grid & camera viewfinder frame
            g2d.setColor(new Color(255, 255, 255, 25));
            g2d.setStroke(new BasicStroke(2));
            int pad = 50;
            g2d.drawRect(pad, pad, width - (pad * 2), height - (pad * 2));

            // Corner marks (viewfinder style)
            g2d.setColor(accent);
            g2d.setStroke(new BasicStroke(4));
            int mark = 35;
            // Top-left
            g2d.drawLine(pad, pad, pad + mark, pad);
            g2d.drawLine(pad, pad, pad, pad + mark);
            // Top-right
            g2d.drawLine(width - pad, pad, width - pad - mark, pad);
            g2d.drawLine(width - pad, pad, width - pad, pad + mark);
            // Bottom-left
            g2d.drawLine(pad, height - pad, pad + mark, height - pad);
            g2d.drawLine(pad, height - pad, pad, height - pad - mark);
            // Bottom-right
            g2d.drawLine(width - pad, height - pad, width - pad - mark, height - pad);
            g2d.drawLine(width - pad, height - pad, width - pad, height - pad - mark);

            // Central Camera Aperture Icon / Symbol
            int cx = width / 2;
            int cy = height / 2 - 40;
            g2d.setColor(new Color(accent.getRed(), accent.getGreen(), accent.getBlue(), 40));
            g2d.fillOval(cx - 90, cy - 90, 180, 180);
            g2d.setColor(accent);
            g2d.setStroke(new BasicStroke(3));
            g2d.drawOval(cx - 70, cy - 70, 140, 140);
            g2d.drawOval(cx - 35, cy - 35, 70, 70);

            // Typography
            g2d.setColor(new Color(245, 245, 245));
            g2d.setFont(new Font("SansSerif", Font.BOLD, 36));
            FontMetrics fmTitle = g2d.getFontMetrics();
            int titleX = (width - fmTitle.stringWidth(title)) / 2;
            g2d.drawString(title, titleX, height / 2 + 110);

            g2d.setColor(accent);
            g2d.setFont(new Font("SansSerif", Font.PLAIN, 22));
            FontMetrics fmBanner = g2d.getFontMetrics();
            int bannerX = (width - fmBanner.stringWidth(bannerText)) / 2;
            g2d.drawString(bannerText, bannerX, height / 2 + 155);

            // Watermark / Brand info
            g2d.setColor(new Color(180, 180, 180, 180));
            g2d.setFont(new Font("SansSerif", Font.ITALIC, 16));
            String footer = "LensVault — Secure Digital Event Media Delivery • RAW Master Preview 4K";
            FontMetrics fmFooter = g2d.getFontMetrics();
            g2d.drawString(footer, (width - fmFooter.stringWidth(footer)) / 2, height - pad - 20);

            g2d.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", baos);
            byte[] imageBytes = baos.toByteArray();

            String storedFilename = storageService.storeBytes(imageBytes, originalFilename, "image/jpeg");

            Media media = new Media(
                    originalFilename,
                    storedFilename,
                    "storage/uploads/" + storedFilename,
                    "image/jpeg",
                    (long) imageBytes.length,
                    MediaType.IMAGE,
                    album,
                    uploader
            );
            mediaRepository.save(media);

        } catch (IOException e) {
            System.err.println("Failed to seed media sample: " + originalFilename + " error: " + e.getMessage());
        }
    }
}
