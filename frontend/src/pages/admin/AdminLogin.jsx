import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/api';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-dark px-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-900/70 backdrop-blur-xl p-8 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Admin</p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Secure Login</h1>
        <p className="text-sm text-ink-400 mb-6">JWT + bcrypt protected dashboard access</p>

        <label className="text-xs font-semibold text-ink-300 mb-1.5 block" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-4 !bg-ink-950/60 !border-ink-700 !text-white"
        />

        <label className="text-xs font-semibold text-ink-300 mb-1.5 block" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-4 !bg-ink-950/60 !border-ink-700 !text-white"
        />

        {error && <p role="alert" className="text-sm text-red-400 mb-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="mt-4 text-xs text-ink-500 text-center">
          Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in <code>backend/.env</code>, then run{' '}
          <code>npm run seed</code>.
        </p>
        <Link to="/" className="block text-center text-sm text-brand-400 mt-4 hover:underline">
          ← Back to website
        </Link>
      </motion.form>
    </div>
  );
}
