import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Filter, Users } from 'lucide-react';
import { eventApi } from '../../api/eventApi';
import EventCard from '../../components/events/EventCard';
import CreateEventModal from '../../components/events/CreateEventModal';
import ClientAssignmentModal from '../../components/events/ClientAssignmentModal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';

const EventsListPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [clientModalEvent, setClientModalEvent] = useState(null);

  const navigate = useNavigate();

  const fetchEvents = async (query = '') => {
    setLoading(true);
    try {
      const res = await eventApi.getEvents(query);
      setEvents(res.data || []);
    } catch (err) {
      setError('Failed to fetch events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(search);
  }, [search]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? All albums and media will be permanently deleted.')) {
      return;
    }
    try {
      await eventApi.deleteEvent(eventId);
      await fetchEvents(search);
    } catch (err) {
      setError('Failed to delete event: ' + err.message);
    }
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setCreateModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
            Event Portfolio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            All photography shoots, client assignments, and deliverables
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEventToEdit(null);
            setCreateModalOpen(true);
          }}
        >
          Create New Event
        </Button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Search Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '42px' }}
            placeholder="Search events by name or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={search ? 'No matching events found' : 'No events created yet'}
          description={
            search
              ? 'Try modifying your search criteria to find what you are looking for.'
              : 'Create your first event to start organizing albums and sharing media with your clients.'
          }
          actionText={search ? 'Clear Search' : 'Create First Event'}
          onAction={() => {
            if (search) setSearch('');
            else {
              setEventToEdit(null);
              setCreateModalOpen(true);
            }
          }}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={(id) => navigate(`/photographer/events/${id}`)}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
        onSuccess={() => fetchEvents(search)}
      />

      {clientModalEvent && (
        <ClientAssignmentModal
          isOpen={!!clientModalEvent}
          onClose={() => setClientModalEvent(null)}
          eventId={clientModalEvent.id}
          eventName={clientModalEvent.eventName}
        />
      )}
    </div>
  );
};

export default EventsListPage;
