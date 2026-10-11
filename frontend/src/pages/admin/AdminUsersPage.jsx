import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, Users } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers(roleFilter || undefined, search || undefined);
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const handleToggleStatus = async (user) => {
    const actionName = user.active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${actionName} account for ${user.email}?`)) {
      return;
    }

    try {
      await adminApi.updateUserStatus(user.id, !user.active);
      await fetchUsers();
    } catch (err) {
      setError('Failed to update user status: ' + err.message);
    }
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'rose';
      case 'PHOTOGRAPHER': return 'gold';
      default: return 'blue';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
          User Moderation & Access Control
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Inspect registered photographers, clients, and platform accounts
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '42px' }}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-input"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="">All Roles</option>
          <option value="PHOTOGRAPHER">Photographers</option>
          <option value="CLIENT">Clients</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div
          className="card"
          style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>User</th>
                  <th style={{ padding: '14px 20px' }}>Email</th>
                  <th style={{ padding: '14px 20px' }}>Role</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#fff' }}>
                      {u.fullName}
                    </td>
                    <td style={{ padding: '14px 20px' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge variant={getRoleVariant(u.role)}>{u.role}</Badge>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: u.active ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: u.active ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                          }}
                        />
                        <span>{u.active ? 'Active' : 'Deactivated'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: u.active ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: u.active ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                          border: `1px solid ${u.active ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        }}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
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

export default AdminUsersPage;
