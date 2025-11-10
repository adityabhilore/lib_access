import React, { useState } from 'react';
import { apiPost } from '../../api/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      await apiPost('/auth/forgot-password', { email });
      setStatus({ loading: false, message: 'If this email exists, a reset link has been sent.', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Something went wrong' });
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: '40px auto' }}>
      <div className="header">
        <div className="text">Forgot Password</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={submit}>
        {status.error && <div className="error-message">{status.error}</div>}
        {status.message && <div className="success-message" style={{ color: '#16a34a' }}>{status.message}</div>}

        <div className="inputs">
          <div className="input">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="btn primary" disabled={status.loading}>
            {status.loading ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
