import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { users } from '../../../../backend/data/users';
import type { UserAccount } from '../../../../backend/types/users.ts';
import './Auth.css';

// ── TYPES ──
interface LoginForm {
  identifier: string;
  password: string;
}

interface SignupForm {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginForm, setLoginForm] = useState<LoginForm>({ identifier: '', password: '' });
  const [signupForm, setSignupForm] = useState<SignupForm>({ fullName: '', phone: '', email: '', password: '', terms: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState('');

  // ── VALIDATION ──
  const validateLogin = (): FormErrors => {
    const e: FormErrors = {};
    if (!loginForm.identifier.trim()) e.identifier = 'Email or phone is required.';
    if (!loginForm.password) e.password = 'Password is required.';
    return e;
  };

  const validateSignup = (): FormErrors => {
    const e: FormErrors = {};
    if (!signupForm.fullName.trim()) e.fullName = 'Full name is required.';
    if (!signupForm.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^09\d{9}$/.test(signupForm.phone)) e.phone = 'Enter a valid PH number (09XXXXXXXXX).';
    if (!signupForm.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) e.email = 'Enter a valid email.';
    if (!signupForm.password) e.password = 'Password is required.';
    else if (signupForm.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!signupForm.terms) e.terms = 'You must agree to the terms.';
    return e;
  };

  // ── LOGIN ──
  const handleLogin = () => {
    const e = validateLogin();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const found = users.find(u =>
      (u.email === loginForm.identifier || u.phone === loginForm.identifier)
    );

    if (!found) {
      setErrors({ general: 'No account found with that email or phone.' });
      return;
    }

    sessionStorage.setItem('currentUser', JSON.stringify(found));

    // check for pending booking redirect
    const redirect = (() => {
      try { return JSON.parse(sessionStorage.getItem('redirectAfterLogin') ?? 'null'); }
      catch { return null; }
    })();

    if (redirect) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirect.path, { state: redirect.state, replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  // ── SIGNUP ──
  const handleSignup = () => {
    const e = validateSignup();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const exists = users.find(u => u.email === signupForm.email || u.phone === signupForm.phone);
    if (exists) {
      setErrors({ general: 'An account with that email or phone already exists.' });
      return;
    }

    const newUser: UserAccount = {
      id: `USR-${String(users.length + 1).padStart(5, '0')}`,
      fullName: signupForm.fullName,
      email: signupForm.email,
      phone: signupForm.phone,
      joinedDate: new Date().toISOString().split('T')[0] ?? '',
      orders: [],
      appointments: [],
      cart: [],
      address: null,
      paymentMethod: null,
    };

    users.push(newUser);
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    setSuccessMsg('Account created! Redirecting...');
    setTimeout(() => navigate(from, { replace: true }), 1200);
  };

  const switchToSignup = () => { setMode('signup'); setErrors({}); setSuccessMsg(''); };
  const switchToLogin = () => { setMode('login'); setErrors({}); setSuccessMsg(''); };

  // ── SLIDES ──
  const loginSlides = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
  ];
  const signupSlides = [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&w=1200&q=80',
  ];
  const slides = mode === 'login' ? loginSlides : signupSlides;

  return (
    <div className={`auth-container${mode === 'signup' ? ' signup-mode' : ''}`}>

      {/* IMAGE SIDE */}
      <div className="image-side">
        <div className="image-slider">
          {slides.map((src, i) => (
            <div
              key={i}
              className="slide active"
              style={{ backgroundImage: `url('${src}')`, animationDelay: `${i * 2}s` }}
            />
          ))}
        </div>
        <div className="image-overlay">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Join Gilded'}</h2>
          <p>{mode === 'login'
            ? 'Your beauty journey continues here. Sign in to manage your appointments.'
            : 'Start your personalized beauty experience today. Experience luxury like never before.'
          }</p>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="form-side">

        {/* LOGIN */}
        <div className={`auth-form${mode === 'login' ? ' active' : ''}`}>
          <h1 className="form-title">Log in</h1>
          <p className="form-subtitle">Access your account</p>

          {errors.general && <p className="error-general">{errors.general}</p>}

          <div className="input-group">
            <label className="labels">Email or Phone Number</label>
            <input type="text" placeholder="your@email.com" value={loginForm.identifier}
              onChange={e => setLoginForm({ ...loginForm, identifier: e.target.value })} />
            {errors.identifier && <span className="error-msg">{errors.identifier}</span>}
          </div>

          <div className="input-group">
            <label className="labels">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button className="btn-main" onClick={handleLogin}>Log in</button>

          <p className="toggle-text">
            Don't have an account? <span onClick={switchToSignup}>Create Account Now</span>
          </p>

          <div className="social-btns">
            <button className="social-btn">Google</button>
            <button className="social-btn">Apple</button>
          </div>
        </div>

        {/* SIGNUP */}
        <div className={`auth-form${mode === 'signup' ? ' active' : ''}`}>
          <h1 className="form-title">Sign Up</h1>
          <p className="form-subtitle">Join the Gilded community</p>

          {errors.general && <p className="error-general">{errors.general}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}

          <div className="form-grid">
            <div className="input-group">
              <label className="labels">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={signupForm.fullName}
                onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
              />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>
            <div className="input-group">
              <label className="labels">Phone No.</label>
              <input
                type="text"
                placeholder="09XX XXX XXXX"
                value={signupForm.phone}
                onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>
          </div>

          <div className="input-group">
            <label className="labels">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={signupForm.email}
              onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label className="labels">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={signupForm.password}
              onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <label className="terms-check">
            <input
              type="checkbox"
              checked={signupForm.terms}
              onChange={e => setSignupForm({ ...signupForm, terms: e.target.checked })}
            />
            <span>I agree to the <button className="inline-link" type="button">Terms & Privacy</button></span>
          </label >
          {errors.terms && <span className="error-msg">{errors.terms}</span>}

          <button className="btn-main" onClick={handleSignup}>Create Account</button>

          <p className="toggle-text">
            Already have an account? <span onClick={switchToLogin}>Log in here.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
