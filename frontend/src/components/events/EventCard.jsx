import React from 'react';
import { Calendar, MapPin, Users, Image as ImageIcon, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';

const EventCard = ({
  event,
  onView,
  onEdit,
  onDelete,
  isClientView = false,
}) => {
  const defaultCover =
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className="card card-hover"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Event Cover Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
        }}
      >
        <img
          src={event.coverImageUrl || defaultCover}
          alt={event.eventName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
          }}
        >
          <Badge variant="gold">{event.eventType}</Badge>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontSize: '1.2rem',
            color: '#fff',
            marginBottom: '10px',
            lineHeight: '1.3',
          }}
        >
          {event.eventName}
        </h3>

        {/* Date and Venue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            <Calendar size={14} color="var(--gold-primary)" />
            <span>{event.eventDate || 'Date TBA'}</span>
          </div>
          {event.venue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              <MapPin size={14} />
              <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{event.venue}</span>
            </div>
          )}
        </div>

        {/* Statistics row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '10px 0',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '18px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ImageIcon size={14} color="var(--gold-primary)" />
            <span>{event.albumCount || 0} Albums</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ImageIcon size={14} color="var(--accent-blue)" />
            <span>{event.mediaCount || 0} Media</span>
          </div>
          {!isClientView && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} color="var(--accent-emerald)" />
              <span>{event.clientCount || 0} Clients</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <button
            onClick={() => onView && onView(event.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--gold-primary)',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            <span>{isClientView ? 'View Gallery' : 'Manage Event'}</span>
            <ArrowRight size={15} />
          </button>

          {!isClientView && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  title="Edit event"
                  style={{ color: 'var(--text-muted)', padding: '6px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Edit3 size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(event.id)}
                  title="Delete event"
                  style={{ color: 'var(--text-muted)', padding: '6px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
