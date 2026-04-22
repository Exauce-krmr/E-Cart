import { useState, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/Features/ProductDetail';
import Login from './pages/Features/Login';
import Signup from './pages/Features/Signup';
import Cart from './pages/Features/Cart';
import Wishlist from './pages/Features/Wishlist';
import SearchResults from './pages/Features/SearchResults';
import OrdersPage from './pages/Features/OrdersPage';
import OAuthSuccess from './pages/Features/OAuthSuccess';
import './styles/global.css';

// ── Simple client-side router ──────────────────────────────────────────────
const CATEGORY_KEYS = {
  '/groceries': 'groceries',
  '/footwear': 'footwear',
  '/clothes': 'clothes',
  '/electronics': 'electronics',
  '/beauty': 'beauty',
  '/home': 'home',
};

function AppShell() {
  const [page, setPage] = useState({ 
    route: window.location.pathname !== '/' && window.location.pathname !== '' ? window.location.pathname : '/', 
    data: {} 
  });

  const navigate = useCallback((route, data = {}) => {
    setPage({ route, data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    const { route, data } = page;

    if (CATEGORY_KEYS[route]) return <CategoryPage categoryKey={CATEGORY_KEYS[route]} navigate={navigate} />;

    switch (route) {
      case '/': return <Home navigate={navigate} />;
      case '/login': return <Login navigate={navigate} />;
      case '/signup': return <Signup navigate={navigate} />;
      case '/cart': return <Cart navigate={navigate} />;
      case '/wishlist': return <Wishlist navigate={navigate} />;
      case '/orders': return <OrdersPage navigate={navigate} />;
      case '/auth/success': return <OAuthSuccess navigate={navigate} />;
      case '/profile': return <ProfilePage navigate={navigate} />;
      case '/track': return <TrackPage navigate={navigate} />;
      case '/about': return <AboutPage navigate={navigate} />;
      case '/contact': return <ContactPage navigate={navigate} />;
      case 'product': return data.product ? <ProductDetail product={data.product} navigate={navigate} /> : <Home navigate={navigate} />;
      case 'search': return <SearchResults query={data.query} navigate={navigate} />;
      default: return <Home navigate={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar navigate={navigate} currentPage={page.route} />
      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>
      <Footer navigate={navigate} />
      <Toast />
    </div>
  );
}

// ── Simple placeholder pages ───────────────────────────────────────────────
function ProfilePage({ navigate }) {
  const { user } = { user: { name: 'Ishant Sharma', email: 'Ishant@example.com', phone: '9876543210' } };
  return (
    <main style={{ padding: '60px 24px', minHeight: '70vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--charcoal)', marginBottom: 32 }}>My Profile ⚙️</h1>
        <div style={{ background: 'white', borderRadius: 20, padding: '32px', boxShadow: 'var(--shadow)', border: '1px solid rgba(249,115,22,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, background: 'var(--saffron)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white', fontWeight: 700 }}>RS</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--charcoal)' }}>Rahul Sharma</div>
              <div style={{ color: 'var(--gray-mid)' }}>Member since January 2024</div>
            </div>
          </div>
          {[['👤 Full Name', 'Rahul Sharma'], ['📧 Email', 'rahul@example.com'], ['📱 Phone', '+91 9876543210'], ['📍 Address', '123 MG Road, Bengaluru, Karnataka']].map(([lbl, val]) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--gray-light)', fontSize: 15 }}>
              <span style={{ color: 'var(--gray-mid)', fontWeight: 500 }}>{lbl}</span>
              <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{val}</span>
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 24 }}>✏️ Edit Profile</button>
        </div>
      </div>
    </main>
  );
}

function TrackPage({ navigate }) {
  const [trackId, setTrackId] = useState('');
  const [result, setResult] = useState(null);
  const track = () => {
    if (trackId.trim()) setResult({
      id: trackId,
      status: 'In Transit',
      steps: [
        { label: 'Order Placed', done: true, date: '22 Jan, 10:30 AM' },
        { label: 'Confirmed', done: true, date: '22 Jan, 11:00 AM' },
        { label: 'Shipped', done: true, date: '23 Jan, 2:00 PM' },
        { label: 'Out for Delivery', done: false, date: 'Expected 24 Jan' },
        { label: 'Delivered', done: false, date: '' },
      ],
    });
  };
  return (
    <main style={{ padding: '60px 24px', minHeight: '70vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--charcoal)', marginBottom: 8 }}>Track Your Order 📦</h1>
        <p style={{ color: 'var(--gray-mid)', marginBottom: 32 }}>Enter your order ID to get real-time tracking updates.</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="e.g. #ORD-2024001"
            style={{ flex: 1, padding: '13px 18px', border: '2px solid var(--saffron-light)', borderRadius: 12, fontSize: 15, outline: 'none', background: 'var(--saffron-pale)', fontFamily: 'var(--font-body)', color: 'var(--charcoal)' }}
            onKeyDown={e => e.key === 'Enter' && track()} />
          <button className="btn-primary" onClick={track}>Track</button>
        </div>
        {result && (
          <div style={{ background: 'white', borderRadius: 20, padding: '28px', boxShadow: 'var(--shadow)', border: '1px solid rgba(249,115,22,0.10)', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
              <span>Order {result.id}</span>
              <span style={{ background: 'rgba(249,115,22,0.12)', color: 'var(--saffron)', padding: '4px 14px', borderRadius: 50, fontSize: 13 }}>{result.status}</span>
            </div>
            {result.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: i < result.steps.length - 1 ? 0 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.done ? 'var(--saffron)' : 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: s.done ? 'white' : 'var(--gray-mid)', fontWeight: 700 }}>
                    {s.done ? '✓' : i + 1}
                  </div>
                  {i < result.steps.length - 1 && <div style={{ width: 2, height: 36, background: s.done ? 'var(--saffron-light)' : 'var(--gray-light)', marginTop: 4 }} />}
                </div>
                <div style={{ paddingBottom: i < result.steps.length - 1 ? 28 : 0, paddingTop: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: s.done ? 'var(--charcoal)' : 'var(--gray-mid)' }}>{s.label}</div>
                  {s.date && <div style={{ fontSize: 12, color: 'var(--gray-mid)', marginTop: 2 }}>{s.date}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AboutPage() {
  return (
    <main style={{ padding: '60px 24px 80px', minHeight: '70vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--charcoal)', marginBottom: 16 }}>About e-cart 🛒</h1>
          <div className="section-line" />
          <p style={{ color: 'var(--gray-mid)', fontSize: 16, maxWidth: 600, margin: '16px auto 0', lineHeight: 1.75 }}>
            We are India's fastest growing e-commerce platform, connecting millions of shoppers with authentic, quality products sourced directly from verified sellers and artisans.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-3">
          {[
            { icon: '🌿', title: 'Our Mission', desc: 'Making quality products accessible to every Indian household at fair prices.' },
            { icon: '🤝', title: 'Our Values', desc: 'Transparency, authenticity, and customer delight in every interaction.' },
            { icon: '🚀', title: 'Our Vision', desc: 'Becoming the most trusted name in Indian e-commerce by 2030.' },
          ].map(c => (
            <div key={c.title} style={{ background: 'white', borderRadius: 20, padding: '32px 24px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{c.icon}</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: 12 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--gray-mid)', lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
          {[['50K+', 'Happy Customers'], ['10K+', 'Products Listed'], ['500+', 'Verified Sellers'], ['4.9★', 'Average Rating']].map(([val, lbl]) => (
            <div key={lbl} style={{ flex: 1, minWidth: 140, background: 'var(--saffron-pale)', border: '2px solid var(--saffron-light)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--saffron)', fontFamily: 'var(--font-display)' }}>{val}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-mid)', marginTop: 6 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  if (sent) return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: '1.9rem', color: 'var(--charcoal)', marginBottom: 12 }}>Message Sent!</h2>
        <p style={{ color: 'var(--gray-mid)', fontSize: 15 }}>We'll get back to you within 24 hours.</p>
      </div>
    </main>
  );
  const inp = f => ({ value: form[f], onChange: e => setForm(p => ({ ...p, [f]: e.target.value })) });
  const inpStyle = { width: '100%', padding: '12px 16px', border: '2px solid var(--saffron-light)', borderRadius: 10, fontSize: 15, outline: 'none', background: 'var(--saffron-pale)', fontFamily: 'var(--font-body)', color: 'var(--charcoal)' };
  return (
    <main style={{ padding: '60px 24px 80px', minHeight: '70vh' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--charcoal)', marginBottom: 8 }}>Contact Us 💬</h1>
        <p style={{ color: 'var(--gray-mid)', marginBottom: 32 }}>Have a question or feedback? We'd love to hear from you!</p>
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 20, padding: '36px', boxShadow: 'var(--shadow)', border: '1px solid rgba(249,115,22,0.10)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>👤 Name</label><input {...inp('name')} required placeholder="Your name" style={inpStyle} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>📧 Email</label><input {...inp('email')} required type="email" placeholder="you@example.com" style={inpStyle} /></div>
          </div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>📝 Subject</label><input {...inp('subject')} required placeholder="How can we help?" style={inpStyle} /></div>
          <div style={{ marginBottom: 24 }}><label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>💬 Message</label><textarea {...inp('message')} required rows={5} placeholder="Write your message here…" style={{ ...inpStyle, resize: 'vertical' }} /></div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>Send Message →</button>
        </form>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
          {[['📞', 'Call Us', '+91 89991 20020'], ['✉️', 'Email Us', 'care@ecart.com'], ['📍', 'Visit Us', 'Ahmedabad, Gujarat']].map(([ico, lbl, val]) => (
            <div key={lbl} style={{ background: 'var(--saffron-pale)', border: '1px solid var(--saffron-light)', borderRadius: 14, padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{ico}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--saffron)', marginBottom: 4 }}>{lbl}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-mid)' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}