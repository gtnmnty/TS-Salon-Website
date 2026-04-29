import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Header } from '../../components/Header'
import './Account.css'

type Panel = 'profile' | 'address' | 'payment' | 'preferences' | 'appointments' | 'orders' | 'help'

export function Account() {
  const [activePanel,         setActivePanel] =       useState<Panel>('profile')
  const [isEditing,           setIsEditing] =         useState(false)
  const [isSignedIn,          setIsSignedIn] =        useState(false)
  const [showDeleteModal,     setShowDeleteModal] =   useState(false)
  const [showAddressForm,     setShowAddressForm] =   useState(false)
  const [showPaymentForm,     setShowPaymentForm] =   useState(false)
  const [toast,               setToast] =             useState('')
  const [avatarSrc,           setAvatarSrc] =         useState('')
  const [accountGroupOpen,    setAccountGroupOpen] =  useState(true)
  const [orders,              setOrders] =            useState<any[]>([])
  const [savedAddresses,      setSavedAddresses] =    useState<string[]>([])
  const [addressForm,         setAddressForm] =       useState({ street: '', barangay: '', city: '', zip: '', country: 'Philippines' })

  const [payType,             setPayType] =           useState<'Visa' | 'MasterCard' | 'Amex' | 'Maya' | 'GCash' | 'Paypal' | ''>('')
  const cardTypes = ['Visa', 'MasterCard', 'Amex'] as const
  const ewalletTypes = ['Maya', 'GCash', 'Paypal'] as const
  const [savedPayments,       setSavedPayments] =     useState<string[]>([])
  const [cardForm,            setCardForm] =          useState({ name: '', address: '', number: '', expiry: '', cvv: '' })
  const [ewalletForm,         setEwalletForm] =       useState({ number: '', accountName: '' })

  const [profile, setProfile] = useState({
    name: 'Jon Snow',
    email: 'jdncanthtall8678@mail.com',
    phone: '09354334633',
    bday: '02-01-1500',
    password: ''
  })


  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      if (Array.isArray(storedOrders)) setOrders(storedOrders)
    } catch {
      setOrders([])
    }
  }, [])


  function saveAddress() {
    setShowAddressForm(true)
    showToast('Address saved.')
  }

  function savePayment() {
    const label = cardTypes.includes(payType as any)
      ? `${payType} •••• ${cardForm.number.slice(-4)}`
      : `${payType} — ${ewalletForm.number}`
    setSavedPayments(p => [...p, label])
    setCardForm({ name: '', address: '', number: '', expiry: '', cvv: '' })
    setEwalletForm({ number: '', accountName: '' })
    setShowPaymentForm(true)
    showToast('Payment method saved.')
  }

  function handleDeleteAccount() {
    localStorage.clear()
    setOrders([])
    setAvatarSrc('')
    setProfile({ name: '', email: '', phone: '', bday: '', password: '' })
    setSavedAddresses([])
    setAddressForm({ street: '', barangay: '', city: '', zip: '', country: 'Philippines' })
    setShowDeleteModal(false)
    showToast('Account deleted.')
  }

  const avatarInputRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setAvatarSrc(URL.createObjectURL(file))
  }

  return (
    <>
      <title>Account Dashboard</title>

      <Header />

      <div id="page-account" className="page active">
        <div className="account-card">

          <div className="profile-header">
            <div className="avatar-wrap">
              <div className="avatar" id="avatar-display">
                {!avatarSrc && (
                  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="18" r="9" stroke="#C5A059" strokeWidth="1.5" />
                    <path d="M6 42c0-10 7-16 18-16s18 6 18 16" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {avatarSrc && <img id="avatar-img" src={avatarSrc} alt="Profile" />}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                id="avatar-input"
                className="avatar-input"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="profile-info">
              <div className="profile-name" id="display-name">{profile.name}</div>
              <div className="profile-email" id="display-email">{profile.email}</div>
              <div className="profile-actions">
                <button className="btn btn-sm btn-gold" onClick={() => avatarInputRef.current?.click()}>
                  Upload Photo
                </button>
                <button
                  className="btn btn-sm"
                  id="auth-btn"
                  onClick={() => setIsSignedIn(s => !s)}
                >
                  {isSignedIn ? 'Sign Out' : 'Sign In'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteModal(true)}>
                  Delete Account
                </button>
              </div>
            </div>
            <button className="close-btn" onClick={() => window.history.back()}>×</button>
          </div>

          <div className="section-divider"></div>

          {/* Body */}
          <div className="account-body">
            <div className="account-sidebar">
              <div className="sidebar-group">
                <span
                  className={`sidebar-label ${accountGroupOpen ? 'active' : ''}`}
                  onClick={() => setAccountGroupOpen(o => !o)}>
                  Account Settings
                </span>
                {accountGroupOpen && (
                  <div className="sidebar-sub">
                    <a className={activePanel === 'profile' ? 'active' : ''}
                      onClick={() => setActivePanel('profile')}>
                      Profile Information
                    </a>
                    <a className={activePanel === 'address' ? 'active' : ''}
                      onClick={() => setActivePanel('address')} >
                      Address
                    </a>
                    <a className={activePanel === 'payment' ? 'active' : ''}
                      onClick={() => setActivePanel('payment')}>
                      Payment Method
                    </a>
                    <a className={activePanel === 'preferences' ? 'active' : ''}
                      onClick={() => setActivePanel('preferences')}>
                      Preferences
                    </a>
                  </div>
                )}
              </div>
              <div className="sidebar-group">
                <span
                  className={`sidebar-label ${activePanel === 'appointments' ? 'active' : ''}`}
                  onClick={() => setActivePanel('appointments')}
                >
                  Appointments
                </span>
              </div>
              <div className="sidebar-group">
                <span
                  className={`sidebar-label ${activePanel === 'orders' ? 'active' : ''}`}
                  onClick={() => setActivePanel('orders')}
                >
                  Orders
                </span>
              </div>
              <div className="sidebar-group">
                <span
                  className={`sidebar-label ${activePanel === 'help' ? 'active' : ''}`}
                  onClick={() => setActivePanel('help')}
                >
                  Help &amp; Support
                </span>
              </div>
            </div>

            <div className="account-content" id="account-content">

              {/* Profile Panel */}
              <div className={`content-panel ${activePanel === 'profile' ? 'active' : ''}`} id="panel-profile">
                <div className="panel-header">
                  <button
                    className="btn btn-sm"
                    id="edit-btn"
                    onClick={() => setIsEditing(e => !e)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {[
                  { label: 'Name', id: 'name', type: 'text' },
                  { label: 'Email', id: 'email', type: 'email' },
                  { label: 'Contact No.', id: 'phone', type: 'tel' },
                  { label: 'Birthday', id: 'bday', type: 'text' },
                ].map(f => (
                  <div className="info-field" key={f.id}>
                    <div className="field-label">{f.label}</div>
                    {isEditing
                      ? <input className="field-input" type={f.type} value={profile[f.id as keyof typeof profile]}
                        onChange={e => setProfile(p => ({ ...p, [f.id]: e.target.value }))} />
                      : <div className="field-value" >{profile[f.id as keyof typeof profile]}</div>
                    }
                  </div>
                ))}
                <div className="info-field">
                  <div className="field-label">Password</div>
                  {isEditing
                    ? <input className="field-input" id="inp-pass" type="password" placeholder="New password"
                      value={profile.password} onFocus={e => e.target.select()}
                      onChange={e => setProfile(p => ({ ...p, password: e.target.value }))} />
                    : <div className="field-value">••••••••••</div>
                  }
                </div>
                {isEditing && (
                  <div className="submit-row" id="save-row">
                    <button className="btn btn-accent btn-sm" onClick={() => { setIsEditing(false); showToast('Profile saved.') }}>
                      Save Changes
                    </button>
                    <button className="btn btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                )}
              </div>

              {/* Address Panel */}
              <div className={`content-panel ${activePanel === 'address' ? 'active' : ''}`} id="panel-address">
                <div className="panel-header">
                  <button className="btn btn-sm btn-accent" onClick={() => setShowAddressForm(f => !f)}>
                    + Add Address
                  </button>
                </div>

                {savedAddresses.length === 0 && !showAddressForm && (
                  <div className="placeholder-msg">No saved addresses yet.</div>
                )}

                {showAddressForm && (
                  <div id="address-form-wrap">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Street Address / House No.</label>
                        <input className="form-input" type="text" placeholder="e.g. 123 Rizal St."
                          value={addressForm.street} onChange={e => setAddressForm(a => ({ ...a, street: e.target.value }))}/>
                      </div>
                      <div className="form-group">
                        <label>Barangay</label>
                        <input className="form-input" type="text" placeholder="Barangay" 
                          value={addressForm.barangay} onChange={e => setAddressForm(a => ({ ...a, barangay: e.target.value }))}/>
                      </div>
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>City / Municipality</label>
                        <input className="form-input" type="text" placeholder="City" 
                          value={addressForm.city} onChange={e => setAddressForm(a => ({ ...a, city: e.target.value }))}/>
                      </div>
                      <div className="form-group">
                        <label>Zip Code</label>
                        <input className="form-input form-zip" type="text" placeholder="0000" 
                          value={addressForm.zip} onChange={e => setAddressForm(a => ({ ...a, zip: e.target.value }))}/>
                      </div>
                    </div>
                    <div className="form-grid-1 form-group">
                      <label>Country</label>
                      <input className="form-input" type="text" placeholder="Philippines" style={{ maxWidth: '280px' }} 
                        value={addressForm.country} onChange={e => setAddressForm(a => ({ ...a, country: e.target.value }))}/>
                    </div>
                    <div className="submit-row" style={{ marginTop: '8px' }}>
                      <button className="btn btn-accent btn-sm" onClick={saveAddress}>Save</button>
                      <button className="btn btn-sm" onClick={() => setShowAddressForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Panel */}
              <div className={`content-panel ${activePanel === 'payment' ? 'active' : ''}`} id="panel-payment">
                <div className="panel-header">
                  <button className="btn btn-sm btn-accent" onClick={() => setShowPaymentForm(f => !f)}>
                    + Add Payment Method
                  </button>
                </div>

                {showPaymentForm && (
                  <div id="payment-form-wrap">
                    <div className="pay-type-row">
                      {cardTypes.map(name => (
                        <button
                          key={name}
                          className={`pay-type-btn ${payType === name ? 'active' : ''}`}
                          onClick={() => setPayType(name)}>
                          {name}
                        </button>
                      ))}

                      {ewalletTypes.map(name => (
                        <button
                          key={name}
                          className={`pay-type-btn ${payType === name ? 'active' : ''}`}
                          onClick={() => setPayType(name)}
                        >
                          {name}
                        </button>
                      ))}
                    </div>

                    {cardTypes.includes(payType as any) && (
                      <div id="pay-card-form">
                        <div className="form-group form-grid-1" style={{ marginBottom: '14px' }}>
                          <label>Billing Full Name</label>
                          <input className="form-input" type="text" placeholder="Name on card" 
                            value={cardForm.name} onChange={e => setCardForm(c => ({ ...c, name: e.target.value }))}/>
                        </div>
                        <div className="form-group form-grid-1" style={{ marginBottom: '14px' }}>
                          <label>Billing Address</label>
                          <input className="form-input" type="text" placeholder="Billing address" 
                            value={cardForm.address} onChange={e => setCardForm(c => ({ ...c, address: e.target.value }))} />
                        </div>
                        <div className="card-form-grid">
                          <div className="form-group">
                            <label>Card Number</label>
                            <input className="form-input" type="text" placeholder="•••• •••• •••• ••••" maxLength={19} 
                              value={cardForm.number} onChange={e => setCardForm(c => ({ ...c, number: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label>Expiration Date</label>
                            <input className="form-input" type="text" placeholder="MM / YY" maxLength={8} 
                              value={cardForm.expiry} onChange={e => setCardForm(c => ({ ...c, expiry: e.target.value }))}/>
                          </div>
                          <div className="form-group">
                            <label>CVV</label>
                            <input className="form-input" type="text" placeholder="•••" maxLength={4} 
                              value={cardForm.cvv} onChange={e => setCardForm(c => ({ ...c, cvv: e.target.value }))}/>
                          </div>
                        </div>
                      </div>
                    )}

                    {ewalletTypes.includes(payType as any) && (
                      <div id="pay-ewallet-form">
                        <div className="form-group" style={{ marginBottom: '14px' }}>
                          <label>Account / Mobile Number</label>
                          <input className="form-input" type="tel" placeholder="09XX XXX XXXX" style={{ maxWidth: '280px' }} 
                            value={ewalletForm.accountName} onChange={e => setEwalletForm(w => ({ ...w, accountName: e.target.value }))} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '14px' }}>
                          <label>Account Name</label>
                          <input className="form-input" type="text" placeholder="Full name on e-wallet" style={{ maxWidth: '320px' }} 
                            value={ewalletForm.number} onChange={e => setEwalletForm(w => ({ ...w, number: e.target.value }))}/>
                        </div>
                      </div>
                    )}

                    <div className="payment-save-row">
                      <button className="btn btn-accent btn-sm" onClick={savePayment}> Save</button>
                      <button className="btn btn-sm" onClick={() => setShowPaymentForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {!showPaymentForm && (
                  <div id="payment-placeholder" className="placeholder-msg" style={{ marginTop: '12px' }}>
                    No saved payment methods yet.
                  </div>
                )}
              </div>

              {/* Preferences Panel */}
              <div className={`content-panel ${activePanel === 'preferences' ? 'active' : ''}`} id="panel-preferences">
                {[
                  { name: 'Notifications', desc: 'Alert me about appointments, such as confirmations, reminders, or cancellations.', defaultOn: false },
                  { name: 'Email', desc: 'Send a notification to your email regarding bookings, orders, receipts, and promotions.', defaultOn: true },
                  { name: 'SMS Notifications', desc: 'Text messages sent to your phone for appointment reminders, confirmations, or promotions.', defaultOn: false },
                  { name: 'Security Alerts', desc: 'Notify about account activity, like logins or password changes, to keep your account secure.', defaultOn: true },
                ].map(p => (
                  <div className="pref-item" key={p.name}>
                    <div className="pref-text">
                      <div className="pref-name">{p.name}</div>
                      <div className="pref-desc">{p.desc}</div>
                    </div>
                    <div className="toggle-wrap">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={p.defaultOn} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Appointments Panel */}
              <div className={`content-panel ${activePanel === 'appointments' ? 'active' : ''}`} id="panel-appointments">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hair Treatment</td>
                      <td>Apr 10, 2026</td>
                      <td>10:00 AM</td>
                      <td><span className="badge badge-green">Confirmed</span></td>
                    </tr>
                    <tr>
                      <td>Facial</td>
                      <td>Apr 15, 2026</td>
                      <td>2:00 PM</td>
                      <td><span className="badge badge-yellow">Pending</span></td>
                    </tr>
                    <tr>
                      <td>Manicure</td>
                      <td>Mar 22, 2026</td>
                      <td>11:30 AM</td>
                      <td><span className="badge badge-gray">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Orders Panel */}
              <div className={`content-panel ${activePanel === 'orders' ? 'active' : ''}`} id="panel-orders">
                <div id="account-orders-wrap">
                  {orders.length === 0 ? (
                    <p className="placeholder-msg">
                      No orders yet. <Link to="/products" style={{ color: 'var(--mauve)', textDecoration: 'none' }}>Shop now →</Link>
                    </p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Est. Arrival</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o: any, idx: number) => {
                          const itemNames = (o.items || []).map((i: any) => i.name).join(', ')
                          const statusClass = o.status === 'Delivered' ? 'badge-green' : o.status === 'Shipped' ? 'badge-yellow' : 'badge-gray'
                          const grandTotal = Number.isFinite(Number(o.grandTotal)) ? Number(o.grandTotal) : 0

                          return (
                            <tr key={idx}>
                              <td>{o.orderId}</td>
                              <td style={{ maxWidth: '180px', whiteSpace: 'normal' }}>{itemNames}</td>
                              <td>₱ {grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td>{o.estimatedArrival || '—'}</td>
                              <td><span className={`badge ${statusClass}`}>{o.status || 'Processing'}</span></td>
                              <td>
                                <Link to="/orders" style={{ color: 'var(--mauve)', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.04em' }}>View</Link>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Help Panel */}
              <div className={`content-panel ${activePanel === 'help' ? 'active' : ''}`} id="panel-help">
                <ul className="help-list">
                  <li>FAQs <span className="help-arrow">›</span></li>
                  <li>Contact Support <span className="help-arrow">›</span></li>
                  <li>Return &amp; Refund Policy <span className="help-arrow">›</span></li>
                  <li>Privacy Policy <span className="help-arrow">›</span></li>
                  <li>Terms &amp; Conditions <span className="help-arrow">›</span></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay open"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Account</h3>
            <p>Are you sure you want to permanently delete your account? This action cannot be undone.</p>
            <div className="modal-actions">
              {/* ✅ now calls handleDeleteAccount */}
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`toast show`} id="toast">{toast}</div>}
    </>
  )
}