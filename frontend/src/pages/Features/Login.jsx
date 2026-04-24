import { useState } from 'react';
import { useApp, API_URL } from '../../context/AppContext';

export default function Login({ navigate }) {
  const { login } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be 6+ characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setErrors({ email: data.message || 'Login failed' });
      }

    } catch (error) {
      console.error("Login error:", error);
      setErrors({ email: 'Failed to connect to the server. Is the backend running?' });
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) => ({
    value: form[field],
    onChange: e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: '' })); },
  });

  return (
    <main style={{
      minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.09), transparent 60%),
                   radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.07), transparent 50%),
                   var(--cream)`,
      padding: '40px 24px',
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 'clamp(32px,5vw,56px)',
        boxShadow: '0 20px 60px rgba(249,115,22,0.12)', width: '100%', maxWidth: 460,
        border: '1px solid rgba(249,115,22,0.10)', animation: 'scaleIn 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: 'var(--saffron)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(249,115,22,0.30)',
          }}>🛒</div>
          <h1 style={{ fontSize: '1.9rem', color: 'var(--charcoal)', marginBottom: 6 }}>Welcome Back!</h1>
          <p style={{ color: 'var(--gray-mid)', fontSize: 15 }}>Sign in to your e-<span style={{ color: 'var(--saffron)' }}>cart</span> account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Email Address" icon="📧" error={errors.email}>
            <input {...inp('email')} type="email" placeholder="you@example.com" style={inputStyle(errors.email)} />
          </Field>

          <Field label="Password" icon="🔒" error={errors.password}>
            <div style={{ position: 'relative' }}>
              <input {...inp('password')} type={showPass ? 'text' : 'password'} placeholder="Enter your password" style={{ ...inputStyle(errors.password), paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
              }}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </Field>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, marginTop: -8 }}>
            <span style={{ fontSize: 13, color: 'var(--saffron)', cursor: 'pointer', fontWeight: 600 }}>Forgot Password?</span>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: loading ? 'var(--saffron-light)' : 'var(--saffron)',
            color: 'white', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer', transition: 'var(--transition)',
            fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 20px rgba(249,115,22,0.30)',
          }}>
            {loading ? <><span style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Signing in…</> : '🔑 Sign In'}
          </button>
        </form>

        {/* Social login */}
        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-light)' }} />
          <span style={{ fontSize: 13, color: 'var(--gray-mid)' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-light)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="http://localhost:3000/api/auth/google" style={{
            flex: 1, padding: '11px', border: '2px solid var(--gray-light)', borderRadius: 12,
            background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)', color: 'var(--charcoal)', transition: 'var(--transition)',
            textDecoration: 'none'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron-light)'; e.currentTarget.style.background = 'var(--saffron-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg> Google
          </a>

          <button style={{
            flex: 1, padding: '11px', border: '2px solid var(--gray-light)', borderRadius: 12,
            background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)', color: 'var(--charcoal)', transition: 'var(--transition)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron-light)'; e.currentTarget.style.background = 'var(--saffron-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.005 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg> Facebook
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--gray-mid)' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ color: 'var(--saffron)', fontWeight: 700, cursor: 'pointer' }}>
            Sign Up Free →
          </span>
        </p>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
        {icon} {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--error)', marginTop: 4, display: 'block' }}>⚠️ {error}</span>}
    </div>
  );
}

const inputStyle = (error) => ({
  width: '100%', padding: '12px 16px',
  border: `2px solid ${error ? 'var(--error)' : 'var(--saffron-light)'}`,
  borderRadius: 12, fontSize: 15, color: 'var(--charcoal)',
  background: error ? '#fef2f2' : 'var(--saffron-pale)',
  outline: 'none', transition: 'border-color 0.25s',
  fontFamily: 'var(--font-body)',
});