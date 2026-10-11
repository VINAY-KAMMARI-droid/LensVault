package com.lensvault.repository;

import com.lensvault.entity.Event;
import com.lensvault.entity.EventClient;
import com.lensvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventClientRepository extends JpaRepository<EventClient, Long> {
    List<EventClient> findByEvent(Event event);

    List<EventClient> findByClientAndAccessEnabledTrue(User client);

    Optional<EventClient> findByEventAndClient(Event event, User client);

    Optional<EventClient> findByEventIdAndClientId(Long eventId, Long clientId);

    Optional<EventClient> findByInvitationToken(String token);

    boolean existsByEventAndClient(Event event, User client);

    @Query("SELECT COUNT(ec) FROM EventClient ec WHERE ec.event.photographer = :photographer")
    long countDistinctClientsByPhotographer(@Param("photographer") User photographer);
}
