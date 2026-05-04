import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Appointment } from '../../../../backend/types/appointments.js';
import type { UserAccount } from '../../../../backend/types/users.js';

import { Header } from '../../components/Header.js';
import './Appointments.css';

type FilterType = 'all' | 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function deriveStatus(apt: Appointment): 'upcoming' | 'completed' | 'cancelled' {
  if (apt.status === 'cancelled') return 'cancelled';
  const aptDate = new Date(apt.date);
  return aptDate >= new Date() ? 'upcoming' : 'completed';
}

function StatusBadge({ status }: { status: 'upcoming' | 'completed' | 'cancelled' }) {
  return (
    <span className={`apt-badge apt-badge--${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function AppointmentCard({
  apt,
  onCancel,
}: {
  apt: Appointment;
  onCancel: (id: string) => void;
}) {
  const navigate = useNavigate();
  const status = deriveStatus(apt);

  return (
    <div className="apt-card">
      <div className="apt-num">#{apt.id}</div>

      <div className="apt-status-row">
        <span className="apt-status-label">Status:</span>
        <StatusBadge status={status} />
      </div>

      <div className="apt-divider" />

      <div className="apt-content-row">
        <div className="apt-svc-img">✦</div>

        <div className="apt-svc-info">
          <p className="apt-svc-name">{apt.service || '—'}</p>

          <div className="apt-meta-list">
            <div className="apt-meta-item">
              <span className="apt-meta-key">Branch</span>
              <span className="apt-meta-sep">—</span>
              <span className="apt-meta-val">{apt.branch || '—'}</span>
            </div>
            <div className="apt-meta-item">
              <span className="apt-meta-key">Date</span>
              <span className="apt-meta-sep">—</span>
              <span className="apt-meta-val">{apt.date || '—'}</span>
            </div>
            <div className="apt-meta-item">
              <span className="apt-meta-key">Time</span>
              <span className="apt-meta-sep">—</span>
              <span className="apt-meta-val">{apt.time || '—'}</span>
            </div>
            <div className="apt-meta-item">
              <span className="apt-meta-key">Guests</span>
              <span className="apt-meta-sep">—</span>
              <span className="apt-meta-val">{apt.guests}</span>
            </div>
          </div>

          <div className="apt-actions">
            <button
              className="apt-btn apt-btn--primary"
              onClick={() => navigate('/booking', { state: { service: apt.service } })}
            >
              Book Again
            </button>
            {status === 'upcoming' && (
              <button
                className="apt-btn apt-btn--ghost"
                onClick={() => onCancel(apt.id)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Appointments() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const currentUser: UserAccount | null = (() => {
    try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null'); }
    catch { return null; }
  })();

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const user: UserAccount | null = JSON.parse(sessionStorage.getItem('currentUser') ?? 'null');
      return user?.appointments ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const user: UserAccount | null = JSON.parse(sessionStorage.getItem('currentUser') ?? 'null');
      setAppointments(user?.appointments ?? []);
    } catch {
      setAppointments([]);
    }
  }, []);

  const handleCancel = (id: string) => {
    const user: UserAccount | null = (() => {
      try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null'); }
      catch { return null; }
    })();
    if (!user) return;
    const updated = user.appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' as const } : apt,
    );
    sessionStorage.setItem('currentUser', JSON.stringify({ ...user, appointments: updated }));
    setAppointments(updated);
  };

  const filtered = [...appointments].reverse().filter(apt =>
    activeFilter === 'all' ? true : deriveStatus(apt) === activeFilter,
  );

  return (
    <div className='apt-page'>
      <title>GILDED - Appointments</title>
      <Header />

      <div className="apt-wrap">
        <div className="apt-inner">

          <header className="apt-hdr">
            <button className="apt-back-btn" onClick={() => history.back()}>
              Back
            </button>
            <h1 className="apt-page-title">Appointments</h1>
          </header>

          <div className="apt-gold-rule" />

          <div className="apt-filter-tabs" role="tablist" aria-label="Appointment filters">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`apt-tab${activeFilter === f.value ? ' active' : ''}`}
                role="tab"
                aria-selected={activeFilter === f.value}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="apt-cards-container">
            {appointments.length === 0 ? (
              <div className="apt-empty">
                <div className="apt-empty-icon">✦</div>
                <p>You have no appointments yet.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="apt-empty">
                <div className="apt-empty-icon">✦</div>
                <p>No appointments in this category.</p>
              </div>
            ) : (
              filtered.map(apt => (
                <AppointmentCard
                  key={apt.id}
                  apt={apt}
                  onCancel={handleCancel}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
