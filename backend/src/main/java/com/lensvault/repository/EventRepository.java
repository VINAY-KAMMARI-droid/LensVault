package com.lensvault.repository;

import com.lensvault.entity.Event;
import com.lensvault.entity.EventStatus;
import com.lensvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByPhotographerOrderByCreatedAtDesc(User photographer);

    List<Event> findByPhotographerAndEventNameContainingIgnoreCaseOrderByCreatedAtDesc(User photographer, String query);

    long countByPhotographer(User photographer);

    @Query("SELECT e FROM Event e WHERE LOWER(e.eventName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> searchEvents(@Param("query") String query);

    List<Event> findTop5ByPhotographerOrderByCreatedAtDesc(User photographer);
}
