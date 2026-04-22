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
          >🔴 Google</a>

          <button style={{
            flex: 1, padding: '11px', border: '2px solid var(--gray-light)', borderRadius: 12,
            background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)', color: 'var(--charcoal)', transition: 'var(--transition)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron-light)'; e.currentTarget.style.background = 'var(--saffron-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.background = 'none'; }}
          >🔵 Facebook</button>
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