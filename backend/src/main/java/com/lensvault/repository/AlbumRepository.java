package com.lensvault.repository;

import com.lensvault.entity.Album;
import com.lensvault.entity.Event;
import com.lensvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByEventOrderByCreatedAtDesc(Event event);

    List<Album> findByEventIdOrderByCreatedAtDesc(Long eventId);

    @Query("SELECT COUNT(a) FROM Album a WHERE a.event.photographer = :photographer")
    long countByPhotographer(@Param("photographer") User photographer);
}
