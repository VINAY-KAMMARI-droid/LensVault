import React, { useState, useEffect } from 'react';
import { UserPlus, Copy, Check, Trash2, ShieldCheck, Download, Eye, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Badge from '../common/Badge';
import { eventApi } from '../../api/eventApi';

const ClientAssignmentModal = ({ isOpen, onClose, eventId, eventName }) => {
  const [clients, setClients] = useState([]);
  const [clientEmail, setClientEmail] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [copiedToken, setCopiedToken] = useState('');

  const fetchClients = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await eventApi.getEventClients(eventId);
      setClients(res.data || []);
    } catch (err) {
      setError('Failed to fetch assigned clients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchClients();
      setError('');
      setClientEmail('');
    }
  }, [isOpen, eventId]);

  const handleAssignClient = async (e) => {
    e.preventDefault();
    if (!clientEmail.trim()) return;

    setAssigning(true);
    setError('');

    try {
      await eventApi.assignClient(eventId, {
        clientEmail: clientEmail.trim(),
        accessEnabled: true,
        downloadEnabled: allowDownload,
      });
      setClientEmail('');
      await fetchClients();
    } catch (err) {
      setError(err.message || 'Failed to assign client.');
    } finally {
      setAssigning(false);
    }
  };

  const handleTogglePermissions = async (clientAssignment, type) => {
    try {
      const newAccess = type === 'access' ? !clientAssignment.accessEnabled : clientAssignment.accessEnabled;
      const newDownload = type === 'download' ? !clientAssignment.downloadEnabled : clientAssignment.downloadEnabled;

      await eventApi.updateClientPermissions(eventId, clientAssignment.clientId, {
        accessEnabled: newAccess,
        downloadEnabled: newDownload,
      });
      await fetchClients();
    } catch (err) {
      setError('Failed to update client permissions: ' + err.message);
    }
  };

  const handleRevokeAccess = async (clientId) => {
    if (!window.confirm('Are you sure you want to revoke this client\'s access to the event?')) return;

    try {
      await eventApi.revokeClientAccess(eventId, clientId);
      await fetchClients();
    } catch (err) {
      setError('Failed to revoke client access: ' + err.message);
    }
  };

  const handleCopyLink = (token) => {
    const inviteLink = `${window.location.origin}/login?invite=${token}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(''), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Client Access — ${eventName || 'Event'}`}
      maxWidth="680px"
    >
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Assign Client Form */}
      <form onSubmit={handleAssignClient} style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Grant Access to Client Email
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="email"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="client.name@example.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" loading={assigning} icon={UserPlus}>
            Grant Access
          </Button>
        </div>

        {/* Download Permission Checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={allowDownload}
            onChange={(e) => setAllowDownload(e.target.checked)}
          />
          <span>Enable high-resolution media downloads for this client</span>
        </label>
      </form>

      {/* Assigned Clients List */}
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          Assigned Clients ({clients.length})
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading assigned clients...
          </div>
        ) : clients.length === 0 ? (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
            }}
          >
            No clients assigned yet. Enter a client email above to give them private access.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clients.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                    {c.clientName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {c.clientEmail}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Access Toggle Button */}
                  <button
                    onClick={() => handleTogglePermissions(c, 'access')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: c.accessEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: c.accessEnabled ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                      border: `1px solid ${c.accessEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    }}
                  >
                    <Eye size={12} />
                    <span>{c.accessEnabled ? 'Access On' : 'Revoked'}</span>
                  </button>

                  {/* Download Toggle Button */}
                  <button
                    onClick={() => handleTogglePermissions(c, 'download')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: c.downloadEnabled ? 'rgba(212, 175, 55, 0.15)' : 'rgba(100, 116, 139, 0.2)',
                      color: c.downloadEnabled ? 'var(--gold-primary)' : 'var(--text-muted)',
                      border: `1px solid ${c.downloadEnabled ? 'rgba(212, 175, 55, 0.3)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    <Download size={12} />
                    <span>{c.downloadEnabled ? 'Downloads Allowed' : 'Downloads Locked'}</span>
                  </button>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => handleCopyLink(c.invitationToken)}
                    title="Copy Client Login Link"
                    style={{
                      color: copiedToken === c.invitationToken ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                      padding: '6px',
                    }}
                  >
                    {copiedToken === c.invitationToken ? <Check size={16} /> : <Copy size={16} />}
                  </button>

                  {/* Revoke / Delete */}
                  <button
                    onClick={() => handleRevokeAccess(c.clientId)}
                    title="Remove client"
                    style={{ color: 'var(--text-muted)', padding: '6px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};

export default ClientAssignmentModal;
