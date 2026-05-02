import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { BookingForm } from '../../../../backend/types/booking.ts';
import type { UserAccount } from '../../../../backend/types/users.ts';
import type { Appointment } from '../../../../backend/types/appointments.ts';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import './Booking.css';

const BRANCHES = [
  'Cubao, Quezon City',
  'Makati Branch',
  'BGC Branch',
  'Alabang Branch',
  'Cebu Branch',
];

const SERVICES = [
  'Signature Haircut & Style',
  'Deep Hydration Facial',
  'Luxury Gel Manicure',
  'Bridal Make Up',
  'Balayage & Toning',
  'Pedicure & Foot Ritual',
];

const EMPTY_FORM: BookingForm = {
  name: '',
  phone: '',
  email: '',
  serviceType: 'salon',
  date: '',
  time: '',
  branch: '',
  street: '',
  barangay: '',
  city: '',
  zipcode: '',
  service: '',
  notes: '',
};

interface FormErrors { [key: string]: string; }

// ── TOAST ──
function Toast({ message }: { message: string }) {
  return (
    <div className={`bk-toast${message ? ' show' : ''}`}>
      {message}
    </div>
  );
}

function saveAppointment(form: BookingForm, guests: number): void {
  const existing = (() => {
    try { return JSON.parse(localStorage.getItem('gilded_appointments') ?? '[]'); }
    catch { return []; }
  })();
  const next = existing.length + 1;
  const apt = {
    id: `#APT-${String(next).padStart(5, '0')}`,
    form,
    guests,
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem('gilded_appointments', JSON.stringify([...existing, apt]));
}

function formatTimeRange(time: string): string {
  if (!time) return '';
  const colon = time.indexOf(':');
  const startHour = parseInt(time.slice(0, colon), 10);
  const startMin  = parseInt(time.slice(colon + 1), 10);
  const endHour   = (startHour + 1) % 24;
  const fmt = (h: number, m: number) => {
    const period   = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
    return `${displayH}${displayM} ${period}`;
  };
  return `${fmt(startHour, startMin)} – ${fmt(endHour, startMin)}`;
}

export function Booking() {
  const location = useLocation();
  const serviceFromNav = (location.state as { service?: string })?.service ?? '';

  const [form, setForm] = useState<BookingForm>({ ...EMPTY_FORM, service: serviceFromNav });
  const [sameInfo, setSameInfo] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState('');
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  // get current user from session
  const currentUser: UserAccount | null = (() => {
    try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null'); }
    catch { return null; }
  })();

  // autofill from account
  useEffect(() => {
    if (sameInfo && currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone,
        street: currentUser.address?.street ?? '',
        barangay: currentUser.address?.barangay ?? '',
        city: currentUser.address?.city ?? '',
        zipcode: currentUser.address?.zipcode ?? '',
      }));
    } else if (!sameInfo) {
      setForm(prev => ({
        ...prev,
        name: '',
        email: '',
        phone: '',
        street: '',
        barangay: '',
        city: '',
        zipcode: '',
      }));
    }
  }, [sameInfo]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    if (!form.phone.trim()) e.phone = 'Contact number is required.';
    if (!form.date) e.date = 'Preferred date is required.';
    if (!form.time) e.time = 'Preferred time is required.';
    if (!form.service) e.service = 'Please select a service.';

    if (form.serviceType === 'home') {
      if (!form.street?.trim()) e.street = 'Street is required.';
      if (!form.barangay?.trim()) e.barangay = 'Barangay is required.';
      if (!form.city?.trim()) e.city = 'City is required.';
      if (!form.zipcode?.trim()) e.zipcode = 'Zip code is required.';
    } else {
      if (!form.branch) e.branch = 'Please select a branch.';
    }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      showToast('Please fill in all required fields.');
      return;
    }

    if (currentUser) {
      const newApt: Appointment = {
        id: `APT-${String(Date.now()).slice(-5)}`,
        status: 'upcoming',
        service: form.service,
        branch: form.serviceType === 'home'
          ? [form.street, form.barangay, form.city].filter(Boolean).join(', ')
          : form.branch ?? '',
        date: form.date,
        time: formatTimeRange(form.time),
        guests,
      }
      const updatedUser = {
        ...currentUser,
        appointments: [...currentUser.appointments, newApt],
      };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      console.log('saved appointments:', updatedUser.appointments);
    }

    saveAppointment(form, guests);
    showToast('Appointment booked!');
    setTimeout(() => {
      setForm({ ...EMPTY_FORM, service: serviceFromNav });
      setSameInfo(true);
      setErrors({});
      navigate('/appointments');
    }, 1200);
  };

  const handleClear = () => {
    setForm({ ...EMPTY_FORM, service: serviceFromNav });
    setSameInfo(true);
    setErrors({});
    setGuests(1);
  };

  const set = (field: keyof BookingForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bk-page">
      <title>GILDED - Book an Appointment</title>
      <Header />

      <section className="bk-hero">
        <h1>Book Your <span>Visit</span></h1>
        <p>Premium beauty rituals, arranged around you</p>
        <div className="bk-hero-line" />
      </section>

      <main className="bk-shell">
        <div className="bk-grid">

          {/* ── FORM CARD ── */}
          <section className="bk-card">
            <div className="bk-section-head">
              <div className="bk-section-title">Appointment Details</div>
              <div className="bk-section-copy">Refined booking, tailored to your preferences</div>
            </div>

            <div className="bk-body">

              {/* SAME INFO CHECKBOX */}
              <label className="bk-same-info-row">
                <input
                  type="checkbox"
                  checked={sameInfo}
                  onChange={e => setSameInfo(e.target.checked)}
                />
                <span>Same info as account dashboard</span>
              </label>

              {/* PERSONAL INFO */}
              <div className="bk-form-grid">
                <div className="bk-form-group">
                  <label className="bk-label">Full Name</label>
                  <input className={`bk-input${errors.name ? ' bk-input-error' : ''}`}
                    type="text" placeholder="Full Name"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                  {errors.name && <span className="bk-error-msg">{errors.name}</span>}
                </div>
                <div className="bk-form-group">
                  <label className="bk-label">Contact No.</label>
                  <input className={`bk-input${errors.phone ? ' bk-input-error' : ''}`}
                    type="tel" placeholder="09XX XXX XXXX"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                  {errors.phone && <span className="bk-error-msg">{errors.phone}</span>}
                </div>
                <div className="bk-form-group">
                  <label className="bk-label">Email Address</label>
                  <input className={`bk-input${errors.email ? ' bk-input-error' : ''}`}
                    type="email" placeholder="Email address"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                  {errors.email && <span className="bk-error-msg">{errors.email}</span>}
                </div>
                <div className="bk-form-group">
                  <label className="bk-label">Service Type</label>
                  <select className="bk-select"
                    value={form.serviceType}
                    onChange={e => set('serviceType', e.target.value)}>
                    <option value="salon">Walk-in Service</option>
                    <option value="home">Home Service</option>
                  </select>
                </div>
              </div>

              {/* DATE & TIME */}
              <div className="bk-form-grid">
                <div className="bk-form-group">
                  <label className="bk-label">Preferred Date</label>
                  <input className={`bk-input${errors.date ? ' bk-input-error' : ''}`}
                    type="date" value={form.date}
                    onChange={e => set('date', e.target.value)} />
                  {errors.date && <span className="bk-error-msg">{errors.date}</span>}
                </div>
                <div className="bk-form-group">
                  <label className="bk-label">Preferred Time</label>
                  <input className={`bk-input${errors.time ? ' bk-input-error' : ''}`}
                    type="time" value={form.time}
                    onChange={e => set('time', e.target.value)} />
                  {errors.time && <span className="bk-error-msg">{errors.time}</span>}
                </div>
              </div>

              {/* BRANCH or ADDRESS */}
              {form.serviceType === 'salon' ? (
                <div className="bk-conditional-panel">
                  <div className="bk-conditional-title">Salon Visit</div>
                  <div className="bk-form-group">
                    <label className="bk-label">Select preferred / nearest branch</label>
                    <select className={`bk-select${errors.branch ? ' bk-input-error' : ''}`}
                      value={form.branch ?? ''}
                      onChange={e => set('branch', e.target.value)}>
                      <option value="" disabled>Select branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.branch && <span className="bk-error-msg">{errors.branch}</span>}
                  </div>
                </div>
              ) : (
                <div className="bk-conditional-panel">
                  <div className="bk-conditional-title">Home Service Address</div>
                  <div className="bk-form-grid">
                    <div className="bk-form-group">
                      <label className="bk-label">Street / Home No.</label>
                      <input className={`bk-input${errors.street ? ' bk-input-error' : ''}`}
                        type="text" placeholder="123 Sample St."
                        value={form.street ?? ''} onChange={e => set('street', e.target.value)} />
                      {errors.street && <span className="bk-error-msg">{errors.street}</span>}
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-label">Barangay</label>
                      <input className={`bk-input${errors.barangay ? ' bk-input-error' : ''}`}
                        type="text" placeholder="Barangay"
                        value={form.barangay ?? ''} onChange={e => set('barangay', e.target.value)} />
                      {errors.barangay && <span className="bk-error-msg">{errors.barangay}</span>}
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-label">Municipality / City</label>
                      <input className={`bk-input${errors.city ? ' bk-input-error' : ''}`}
                        type="text" placeholder="City / Municipality"
                        value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
                      {errors.city && <span className="bk-error-msg">{errors.city}</span>}
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-label">Zip Code</label>
                      <input className={`bk-input${errors.zipcode ? ' bk-input-error' : ''}`}
                        type="text" placeholder="Zip Code"
                        value={form.zipcode ?? ''} onChange={e => set('zipcode', e.target.value)} />
                      {errors.zipcode && <span className="bk-error-msg">{errors.zipcode}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE HIGHLIGHT */}
              <div className="bk-service-highlight">
                <span className="bk-service-chip">Preferred Service</span>
                <div className="bk-service-name">
                  {form.service || 'Choose the service you want to reserve'}
                </div>
                <p className="bk-service-note">
                  {serviceFromNav && form.service === serviceFromNav
                    ? 'Selected from the services page and added to your booking automatically.'
                    : 'You can still change the service below before submitting.'}
                </p>
              </div>

              {/* SERVICE SELECT */}
              <div className="bk-form-group bk-full">
                <label className="bk-label">Select preferred service</label>
                <select className={`bk-select${errors.service ? ' bk-input-error' : ''}`}
                  value={form.service}
                  onChange={e => set('service', e.target.value)}>
                  <option value="" disabled>Select service</option>
                  {serviceFromNav && !SERVICES.includes(serviceFromNav) && (
                    <option value={serviceFromNav}>{serviceFromNav}</option>
                  )}
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <span className="bk-error-msg">{errors.service}</span>}
              </div>

              {/* NOTES */}
              <div className="bk-form-group bk-full">
                <label className="bk-label">Personalize Your Visit</label>
                <textarea className="bk-textarea"
                  placeholder="Share any preferences, special requests, or notes..."
                  value={form.notes ?? ''}
                  onChange={e => set('notes', e.target.value)} />
              </div>

              {/* ACTIONS */}
              <div className="bk-action-row">
                <button className="bk-btn bk-btn-submit" onClick={handleSubmit}>Submit</button>
                <button className="bk-btn bk-btn-clear" onClick={handleClear}>Clear</button>
              </div>
            </div>
          </section>

          {/* ── ASIDE ── */}
          <aside className="bk-aside">
            <div className="bk-section-head">
              <div className="bk-section-title">At a Glance</div>
              <div className="bk-section-copy">Everything you selected, beautifully organized</div>
            </div>
            <div className="bk-aside-body">
              <div className="bk-aside-block">
                <div className="bk-aside-kicker">Preferred Service</div>
                <div className="bk-aside-main">{form.service || 'No service selected yet'}</div>
              </div>
              <div className="bk-aside-block">
                <div className="bk-aside-kicker">Service Type</div>
                <div className="bk-aside-text">
                  {form.serviceType === 'home'
                    ? 'Home service selected. Your saved address is ready and you can adjust it if needed.'
                    : 'Walk-in service selected. Choose the branch that is most convenient for you.'}
                </div>
              </div>
              <div className="bk-aside-block">
                <div className="bk-aside-kicker">Date & Time</div>
                <div className="bk-aside-text">
                  {form.date && form.time ? `${form.date} at ${form.time}` : 'Not selected yet'}
                </div>
              </div>

              {/* ── GUESTS ── */}
              <div className="bk-aside-block">
                <div className="bk-aside-kicker">Guests</div>
                <div className="bk-aside-main" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className="qty-update dec-btn"
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                  >
                    -
                  </button>
                  <input
                    className="qty-input"
                    type="number"
                    value={guests}
                    min={1}
                    max={10}
                    onChange={e => setGuests(Math.min(10, Math.max(1, Number(e.target.value))))}
                  />
                  <button
                    className="qty-update add-btn"
                    onClick={() => setGuests(g => Math.min(10, g + 1))}
                  >
                    +
                  </button>
                </div>
                <div className="bk-aside-text">
                  {guests === 1 ? '1 guest' : `${guests} guests`} for this appointment
                </div>
              </div>

              <div className="bk-aside-block">
                <div className="bk-aside-kicker">Autofill</div>
                <div className="bk-aside-text">
                  Your booking details can start with the same information from your account dashboard,
                  including your saved address.
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer />
      <Toast message={toast} />
    </div>
  );
}