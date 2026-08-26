import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Rocket, Person, Mail, Lock, Eye, EyeOff } from '../components/icons';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm } = form;

    if (!name || !email || !password || !confirm) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Account created! Welcome to SkillVerse 🎉');
      navigate('/app/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Rocket />
        <span>Skill<span className="verse">Verse</span></span>
      </div>

      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p className="auth-sub">Start your skill journey today</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <div className="input-icon-wrap">
              <Person />
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Full Name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <div className="input-icon-wrap">
              <Mail />
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <div className="input-icon-wrap">
              <Lock />
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="field">
            <div className="input-icon-wrap">
              <Lock />
              <input
                className="input"
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                placeholder="Confirm Password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label="Toggle confirm password"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;