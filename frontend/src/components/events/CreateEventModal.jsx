import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { eventApi } from '../../api/eventApi';

const CreateEventModal = ({ isOpen, onClose, eventToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Wedding',
    eventDate: '',
    venue: '',
    description: '',
    coverImageUrl: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        eventName: eventToEdit.eventName || '',
        eventType: eventToEdit.eventType || 'Wedding',
        eventDate: eventToEdit.eventDate || '',
        venue: eventToEdit.venue || '',
        description: eventToEdit.description || '',
        coverImageUrl: eventToEdit.coverImageUrl || '',
        status: eventToEdit.status || 'ACTIVE',
      });
    } else {
      setFormData({
        eventName: '',
        eventType: 'Wedding',
        eventDate: new Date().toISOString().split('T')[0],
        venue: '',
        description: '',
        coverImageUrl: '',
        status: 'ACTIVE',
      });
    }
    setError('');
  }, [eventToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.eventDate || !formData.eventType) {
      setError('Please fill in event name, type, and date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (eventToEdit) {
        await eventApi.updateEvent(eventToEdit.id, formData);
      } else {
        await eventApi.createEvent(formData);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Event Details' : 'Create New Photography Event'}
      maxWidth="620px"
    >
      <Alert type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Name *</label>
          <input
            type="text"
            name="eventName"
            className="form-input"
            placeholder="e.g. Liam & Sarah Wedding"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Event Type *</label>
            <select
              name="eventType"
              className="form-input"
              value={formData.eventType}
              onChange={handleChange}
            >
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="College Farewell">College Farewell</option>
              <option value="Engagement">Engagement</option>
              <option value="Corporate">Corporate Gala</option>
              <option value="Portrait">Portrait Session</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Event Date *</label>
            <input
              type="date"
              name="eventDate"
              className="form-input"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Venue / Location</label>
          <input
            type="text"
            name="venue"
            className="form-input"
            placeholder="e.g. Grand Belle Estate, Napa Valley"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image URL (Optional preview banner)</label>
          <input
            type="url"
            name="coverImageUrl"
            className="form-input"
            placeholder="https://images.unsplash.com/..."
            value={formData.coverImageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description & Client Notes</label>
          <textarea
            name="description"
            rows="3"
            className="form-input"
            placeholder="Describe the shooting plan, mood, or deliverables..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {eventToEdit ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventModal;
