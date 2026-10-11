import React, { useState, useEffect } from 'react';
import { FileText, Shield, Search } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAuditLogs();
        setLogs(res.data || []);
      } catch (err) {
        setError('Failed to fetch audit logs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      log.actorEmail?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.details?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
          Security & Activity Audit Trails
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Immutable server event records for logins, creations, uploads, permission alterations, and deletions
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '400px', position: 'relative' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          className="form-input"
          style={{ width: '100%', paddingLeft: '42px' }}
          placeholder="Filter logs by actor, action, or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Logs Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving audit records..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 18px' }}>Timestamp</th>
                  <th style={{ padding: '12px 18px' }}>Actor</th>
                  <th style={{ padding: '12px 18px' }}>Action</th>
                  <th style={{ padding: '12px 18px' }}>Resource</th>
                  <th style={{ padding: '12px 18px' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    <td style={{ padding: '12px 18px', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--gold-primary)', fontWeight: 600 }}>
                      {log.actorEmail}
                    </td>
                    <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 600 }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '0.8rem' }}>
                      {log.resourceType} {log.resourceId ? `(#${log.resourceId})` : ''}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-primary)' }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogsPage;
