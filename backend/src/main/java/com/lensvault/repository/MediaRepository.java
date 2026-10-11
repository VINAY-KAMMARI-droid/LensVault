package com.lensvault.repository;

import com.lensvault.entity.Album;
import com.lensvault.entity.Media;
import com.lensvault.entity.MediaType;
import com.lensvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByAlbumOrderByCreatedAtDesc(Album album);

    List<Media> findByAlbumIdOrderByCreatedAtDesc(Long albumId);

    @Query("SELECT COUNT(m) FROM Media m WHERE m.album.event.photographer = :photographer")
    long countByPhotographer(@Param("photographer") User photographer);

    @Query("SELECT COUNT(m) FROM Media m WHERE m.album.event.photographer = :photographer AND m.mediaType = :type")
    long countByPhotographerAndType(@Param("photographer") User photographer, @Param("type") MediaType type);

    @Query("SELECT COALESCE(SUM(m.fileSize), 0) FROM Media m")
    long totalStorageUsed();

    @Query("SELECT m FROM Media m WHERE m.album.event.photographer = :photographer ORDER BY m.createdAt DESC")
    List<Media> findRecentMediaByPhotographer(@Param("photographer") User photographer);
}
