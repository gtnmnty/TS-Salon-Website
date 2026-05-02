import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import type { UserAccount } from '../../../../backend/types/users';
import { Header } from '../../components/Header'
import './Account.css'

type Panel = 'profile' | 'address' | 'payment' | 'preferences' | 'appointments' | 'orders' | 'help'

export function Account() {
  const [activePanel, setActivePanel] = useState<Panel>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [toast, setToast] = useState('')
  const [avatarSrc, setAvatarSrc] = useState('')
  const [accountGroupOpen, setAccountGroupOpen] = useState(true)
  const [savedAddresses, setSavedAddresses] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('savedAddresses') ?? '[]') } catch { return [] }
  })
  const [addressForm, setAddressForm] = useState<{ street: string; barangay: string; city: string; zip: string; country: string }>(() => {
    try { return JSON.parse(localStorage.getItem('addressForm') ?? 'null') ?? { street: '', barangay: '', city: '', zip: '', country: 'Philippines' } } catch { return { street: '', barangay: '', city: '', zip: '', country: 'Philippines' } }
  })

  const [payType, setPayType] = useState<'Visa' | 'MasterCard' | 'Amex' | 'Maya' | 'GCash' | 'Paypal' | ''>('')
  const cardTypes = ['Visa', 'MasterCard', 'Amex'] as const
  const ewalletTypes = ['Maya', 'GCash', 'Paypal'] as const
  const [savedPayments, setSavedPayments] = useState<{ label: string; type: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('savedPayments') ?? '[]') } catch { return [] }
  })
  const [cardForm, setCardForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedCardForm') ?? 'null') ?? { name: '', address: '', number: '', expiry: '', cvv: '' } } catch { return { name: '', address: '', number: '', expiry: '', cvv: '' } }
  })
  const [ewalletForm, setEwalletForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedEwalletForm') ?? 'null') ?? { number: '', accountName: '' } } catch { return { number: '', accountName: '' } }
  })

  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: 'Jon Snow',
    email: 'jdncanthtall8678@mail.com',
    phone: '09354334633',
    bday: '02-01-1500',
    password: ''
  })

  function saveAddress() {
    const label = `${addressForm.street}, ${addressForm.barangay}, ${addressForm.city}, ${addressForm.zip}`
    const next = [...savedAddresses.filter(a => a !== label), label]
    setSavedAddresses(next)
    localStorage.setItem('savedAddresses', JSON.stringify(next))
    localStorage.setItem('addressForm', JSON.stringify(addressForm))
    setShowAddressForm(false)
    showToast('Address saved.')
  }

  const [payErrors, setPayErrors] = useState<Record<string, string>>({})

  function validatePayment(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!payType) { e.payType = 'Please select a payment type.'; return e }

    const isCard = cardTypes.includes(payType as any)

    if (isCard) {
      if (!cardForm.name.trim()) e.name = 'Cardholder name is required.'
      if (!cardForm.address.trim()) e.address = 'Billing address is required.'
      if (!cardForm.number.trim()) e.number = 'Card number is required.'
      else if (!/^\d[\d\s]{13,18}\d$/.test(cardForm.number.replace(/\s/g, '')) || !/^\d{13,19}$/.test(cardForm.number.replace(/\s/g, '')))
        e.number = 'Card number must be 13–19 digits.'
      if (!cardForm.expiry.trim()) e.expiry = 'Expiry date is required.'
      else if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(cardForm.expiry.trim()))
        e.expiry = 'Use MM / YY format.'
      if (!cardForm.cvv.trim()) e.cvv = 'CVV is required.'
      else if (!/^\d{3,4}$/.test(cardForm.cvv.trim()))
        e.cvv = 'CVV must be 3–4 digits.'
    } else {
      if (!ewalletForm.accountName.trim()) e.accountName = 'Mobile number is required.'
      else if (!/^09\d{9}$/.test(ewalletForm.accountName.replace(/\s/g, '')))
        e.accountName = 'Enter a valid PH number (09XXXXXXXXX).'
      if (!ewalletForm.number.trim()) e.number = 'Account name is required.'
    }
    return e
  }

  function savePayment() {
    const e = validatePayment()
    if (Object.keys(e).length > 0) { setPayErrors(e); return }
    setPayErrors({})

    const isCard = cardTypes.includes(payType as any)
    const label = isCard
      ? `${payType} •••• ${cardForm.number.replace(/\s/g, '').slice(-4)}`
      : `${payType} — ${ewalletForm.accountName}`
    const next = [{ label, type: payType }]
    setSavedPayments(next)
    localStorage.setItem('savedPayments', JSON.stringify(next))
    if (isCard) localStorage.setItem('savedCardForm', JSON.stringify(cardForm))
    else localStorage.setItem('savedEwalletForm', JSON.stringify(ewalletForm))
    setShowPaymentForm(false)
    showToast('Payment method saved.')
  }

  function handleDeleteAccount() {
    localStorage.clear()
    setAvatarSrc('')
    setProfile({ name: '', email: '', phone: '', bday: '', password: '' })
    setSavedAddresses([])
    setSavedPayments([])
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

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null'); }
    catch { return null; }
  });

  const orders = currentUser?.orders ?? [];


  return (
    <div className='acc-page'>
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Upload Photo
                </button>

                <button
                  className="btn btn-sm"
                  onClick={() => {
                    if (currentUser) {
                      sessionStorage.removeItem('currentUser');
                      setCurrentUser(null);
                      showToast('Signed out.');
                    } else {
                      navigate('/auth');
                    }
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {currentUser ? 'Sign Out' : 'Sign In'}
                </button>

                <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteModal(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
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
                  <button className="btn btn-sm" id="edit-btn" onClick={() => setIsEditing(e => !e)}>
                    {isEditing ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </>
                    )}
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
                    {showAddressForm ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        {savedAddresses.length > 0 ? 'Edit' : '+ Add Address'}
                      </>
                    )}
                  </button>
                </div>

                {!showAddressForm && savedAddresses.length === 0 && (
                  <div className="placeholder-msg">No saved addresses yet.</div>
                )}

                {(showAddressForm || savedAddresses.length > 0) && (
                  <div id="address-form-wrap">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Street Address / House No.</label>
                        <input className="form-input" type="text" placeholder="e.g. 123 Rizal St."
                          value={addressForm.street}
                          readOnly={!showAddressForm} // 👈 read-only when not editing
                          onChange={e => setAddressForm(a => ({ ...a, street: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Barangay</label>
                        <input className="form-input" type="text" placeholder="Barangay"
                          value={addressForm.barangay}
                          readOnly={!showAddressForm}
                          onChange={e => setAddressForm(a => ({ ...a, barangay: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>City / Municipality</label>
                        <input className="form-input" type="text" placeholder="City"
                          value={addressForm.city}
                          readOnly={!showAddressForm}
                          onChange={e => setAddressForm(a => ({ ...a, city: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Zip Code</label>
                        <input className="form-input form-zip" type="text" placeholder="0000"
                          value={addressForm.zip}
                          readOnly={!showAddressForm}
                          onChange={e => setAddressForm(a => ({ ...a, zip: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-grid-1 form-group">
                      <label>Country</label>
                      <input className="form-input" type="text" placeholder="Philippines" style={{ maxWidth: '280px' }}
                        value={addressForm.country}
                        readOnly={!showAddressForm}
                        onChange={e => setAddressForm(a => ({ ...a, country: e.target.value }))} />
                    </div>

                    {/* Only show Save/Cancel when editing */}
                    {showAddressForm && (
                      <div className="submit-row" style={{ marginTop: '8px' }}>
                        <button className="btn btn-accent btn-sm" onClick={saveAddress}>Save</button>
                        <button className="btn btn-sm" onClick={() => setShowAddressForm(false)}>Cancel</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Panel */}
              <div className={`content-panel ${activePanel === 'payment' ? 'active' : ''}`} id="panel-payment">

                {/* ── SAVED STATE: show saved card info + Edit button ── */}
                {!showPaymentForm && savedPayments.length > 0 && (
                  <>
                    <div className="panel-header">
                      <button className="btn btn-sm btn-accent pay-edit-btn" onClick={() => {
                        setPayType('')
                        setCardForm({ name: '', address: '', number: '', expiry: '', cvv: '' })
                        setEwalletForm({ number: '', accountName: '' })
                        setPayErrors({})
                        setShowPaymentForm(true)
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    </div>

                    {/* Saved card display matching the screenshot layout */}
                    <div id="payment-form-wrap">
                      <div className="pay-type-row">
                        {[...cardTypes, ...ewalletTypes].map(name => (
                          <button
                            key={name}
                            className={`pay-type-btn ${savedPayments[0]?.type === name ? 'active' : ''}`}
                            disabled
                          >
                            {name}
                          </button>
                        ))}
                      </div>

                      {cardTypes.includes(savedPayments[0]?.type as any) && (
                        <div id="pay-card-form">
                          <div className="form-group form-grid-1" style={{ marginBottom: '14px' }}>
                            <label>Billing Full Name</label>
                            <input className="form-input" type="text" value={cardForm.name || 'Name on card'} readOnly />
                          </div>
                          <div className="form-group form-grid-1" style={{ marginBottom: '14px' }}>
                            <label>Billing Address</label>
                            <input className="form-input" type="text" value={cardForm.address || 'Billing address'} readOnly />
                          </div>
                          <div className="card-form-grid">
                            <div className="form-group">
                              <label>Card Number</label>
                              <input className="form-input" type="text"
                                value={cardForm.number ? `.... .... .... ${cardForm.number.slice(-4)}` : '.... .... .... ....'}
                                readOnly />
                            </div>
                            <div className="form-group">
                              <label>Expiration Date</label>
                              <input className="form-input" type="text" value={cardForm.expiry || 'MM / YY'} readOnly />
                            </div>
                            <div className="form-group">
                              <label>CVV</label>
                              <input className="form-input" type="text" value="..." readOnly />
                            </div>
                          </div>
                        </div>
                      )}

                      {ewalletTypes.includes(savedPayments[0]?.type as any) && (
                        <div id="pay-ewallet-form">
                          <div className="form-group" style={{ marginBottom: '14px' }}>
                            <label>Account / Mobile Number</label>
                            <input className="form-input" type="text" value={ewalletForm.accountName} readOnly style={{ maxWidth: '280px' }} />
                          </div>
                          <div className="form-group" style={{ marginBottom: '14px' }}>
                            <label>Account Name</label>
                            <input className="form-input" type="text" value={ewalletForm.number} readOnly style={{ maxWidth: '320px' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── EMPTY STATE ── */}
                {!showPaymentForm && savedPayments.length === 0 && (
                  <>
                    <div className="panel-header">
                      <button className="btn btn-sm btn-accent" onClick={() => setShowPaymentForm(true)}>
                        + Add Payment Method
                      </button>
                    </div>
                    <div className="placeholder-msg">No saved payment methods yet.</div>
                  </>
                )}

                {/* ── EDIT / ADD FORM ── */}
                {showPaymentForm && (
                  <>
                    <div className="panel-header">
                      <button className="btn btn-sm" onClick={() => { setShowPaymentForm(false); setPayType(''); setPayErrors({}) }}>
                        Cancel
                      </button>
                    </div>
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

                      {payErrors.payType && <p className="pay-error">{payErrors.payType}</p>}

                      {cardTypes.includes(payType as any) && (
                        <div id="pay-card-form">
                          <div className="form-group form-grid-1" style={{ marginBottom: '14px' }}>
                            <label>Billing Full Name</label>
                            <input className={`form-input${payErrors.name ? ' input-error' : ''}`} type="text" placeholder="Name on card"
                              value={cardForm.name} onChange={e => { setCardForm(c => ({ ...c, name: e.target.value })); setPayErrors(er => ({ ...er, name: '' })) }} />
                            {payErrors.name && <span className="pay-error">{payErrors.name}</span>}
                          </div>
                          <div className="form-group form-grid-1" style={{ marginBottom: '14px' }}>
                            <label>Billing Address</label>
                            <input className={`form-input${payErrors.address ? ' input-error' : ''}`} type="text" placeholder="Billing address"
                              value={cardForm.address} onChange={e => { setCardForm(c => ({ ...c, address: e.target.value })); setPayErrors(er => ({ ...er, address: '' })) }} />
                            {payErrors.address && <span className="pay-error">{payErrors.address}</span>}
                          </div>
                          <div className="card-form-grid">
                            <div className="form-group">
                              <label>Card Number</label>
                              <input className={`form-input${payErrors.number ? ' input-error' : ''}`} type="text" placeholder=".... .... .... ...." maxLength={19}
                                value={cardForm.number} onChange={e => {
                                  const val = e.target.value.replace(/[^\d\s]/g, '')
                                  setCardForm(c => ({ ...c, number: val }))
                                  setPayErrors(er => ({ ...er, number: '' }))
                                }} />
                              {payErrors.number && <span className="pay-error">{payErrors.number}</span>}
                            </div>
                            <div className="form-group">
                              <label>Expiration Date</label>
                              <input className={`form-input${payErrors.expiry ? ' input-error' : ''}`} type="text" placeholder="MM / YY" maxLength={8}
                                value={cardForm.expiry} onChange={e => { setCardForm(c => ({ ...c, expiry: e.target.value })); setPayErrors(er => ({ ...er, expiry: '' })) }} />
                              {payErrors.expiry && <span className="pay-error">{payErrors.expiry}</span>}
                            </div>
                            <div className="form-group">
                              <label>CVV</label>
                              <input className={`form-input${payErrors.cvv ? ' input-error' : ''}`} type="text" placeholder="..." maxLength={4}
                                value={cardForm.cvv} onChange={e => {
                                  const val = e.target.value.replace(/\D/g, '')
                                  setCardForm(c => ({ ...c, cvv: val }))
                                  setPayErrors(er => ({ ...er, cvv: '' }))
                                }} />
                              {payErrors.cvv && <span className="pay-error">{payErrors.cvv}</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {ewalletTypes.includes(payType as any) && (
                        <div id="pay-ewallet-form">
                          <div className="form-group" style={{ marginBottom: '14px' }}>
                            <label>Account / Mobile Number</label>
                            <input className={`form-input${payErrors.accountName ? ' input-error' : ''}`} type="tel" placeholder="09XX XXX XXXX" style={{ maxWidth: '280px' }}
                              value={ewalletForm.accountName} onChange={e => {
                                const val = e.target.value.replace(/[^\d\s]/g, '')
                                setEwalletForm(w => ({ ...w, accountName: val }))
                                setPayErrors(er => ({ ...er, accountName: '' }))
                              }} />
                            {payErrors.accountName && <span className="pay-error">{payErrors.accountName}</span>}
                          </div>
                          <div className="form-group" style={{ marginBottom: '14px' }}>
                            <label>Account Name</label>
                            <input className={`form-input${payErrors.number ? ' input-error' : ''}`} type="text" placeholder="Full name on e-wallet" style={{ maxWidth: '320px' }}
                              value={ewalletForm.number} onChange={e => { setEwalletForm(w => ({ ...w, number: e.target.value })); setPayErrors(er => ({ ...er, number: '' })) }} />
                            {payErrors.number && <span className="pay-error">{payErrors.number}</span>}
                          </div>
                        </div>
                      )}

                      <div className="submit-row" style={{ marginTop: '8px' }}>
                        <button className="btn btn-accent btn-sm" onClick={savePayment}>Save</button>
                        <button className="btn btn-sm" onClick={() => { setShowPaymentForm(false); setPayType(''); setPayErrors({}) }}>Cancel</button>
                      </div>
                    </div>
                  </>
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
                {(() => {
                  try {
                    const user = JSON.parse(sessionStorage.getItem('currentUser') ?? 'null');
                    const appointments = user?.appointments ?? [];

                    if (appointments.length === 0) {
                      return (
                        <p className="placeholder-msg">
                          No appointments yet.{' '}
                          <Link to="/booking" style={{ color: 'var(--mauve)', textDecoration: 'none' }}>
                            Book now →
                          </Link>
                        </p>
                      );
                    }

                    return (
                      <>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Service</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Status</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.map((apt: any) => {
                              const statusClass =
                                apt.status === 'upcoming' ? 'badge-green' :
                                  apt.status === 'completed' ? 'badge-gray' : 'badge-yellow';

                              const formattedDate = apt.date
                                ? new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : '—';

                              const formattedTime = apt.time
                                ? (() => {
                                  const [h, m] = apt.time.split(':');
                                  const hour = parseInt(h);
                                  const ampm = hour >= 12 ? 'PM' : 'AM';
                                  const hour12 = hour % 12 || 12;
                                  return `${hour12}:${m} ${ampm}`;
                                })()
                                : apt.time;

                              return (
                                <tr key={apt.id}>
                                  <td>{apt.service}</td>
                                  <td>{formattedDate}</td>
                                  <td>{formattedTime}</td>
                                  <td>
                                    <span className={`badge ${statusClass}`}>
                                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                    </span>
                                  </td>
                                  <td>
                                    <Link to="/booking" style={{ color: 'var(--mauve)', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.04em' }}>
                                      View
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* View All button */}
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                          <Link
                            to="/appointments"
                            style={{ color: 'var(--mauve)', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                          >
                            View All Appointments →
                          </Link>
                        </div>
                      </>
                    );
                  } catch {
                    return <p className="placeholder-msg">Unable to load appointments.</p>;
                  }
                })()}
              </div>

              {/* Orders Panel */}
              <div className={`content-panel ${activePanel === 'orders' ? 'active' : ''}`} id="panel-orders">
                <div id="account-orders-wrap">
                  {orders.length === 0 ? (
                    <p className="placeholder-msg">
                      No orders yet. <Link to="/products" style={{ color: 'var(--mauve)', textDecoration: 'none' }}>Shop now →</Link>
                    </p>
                  ) : (
                    <>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o: any, idx: number) => {
                            const statusClass =
                              o.status === 'delivered' ? 'badge-green' :
                                o.status === 'shipped' ? 'badge-yellow' : 'badge-gray';

                            const formattedDate = o.date
                              ? new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : '—';

                            return (
                              <tr key={idx}>
                                <td>{o.id}</td>
                                <td>{formattedDate}</td>
                                <td>₱ {Number(o.total).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                                <td>
                                  <span className={`badge ${statusClass}`}>
                                    {o.status
                                      ? o.status.charAt(0).toUpperCase() + o.status.slice(1)
                                      : 'Processing'}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to="/orders"
                                    style={{ color: 'var(--mauve)', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.04em' }}
                                  >
                                    View
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <Link
                          to="/orders"
                          style={{ color: 'var(--mauve)', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                        >
                          View All Orders →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Help Panel */}
              <div className={`content-panel ${activePanel === 'help' ? 'active' : ''}`} id="panel-help">
                <ul className="help-list">
                  <li><Link to="/faqs" className="help-link">FAQs</Link> <span className="help-arrow">›</span></li>
                  <li><Link to="/help#contacts" className="help-link">Contact Support</Link><span className="help-arrow">›</span></li>
                  <li><Link to="/help#warranty" className="help-link">Return &amp; Refund Policy</Link><span className="help-arrow">›</span></li>
                  <li><Link to="/help#privacy" className="help-link">Privacy Policy</Link> <span className="help-arrow">›</span></li>
                  <li><Link to="/help#terms" className="help-link">Terms &amp; Conditions</Link> <span className="help-arrow">›</span></li>
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
    </div>
  )
}