import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [loginOrEmail, setLoginOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(loginOrEmail, password);
      navigate('/chats');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="loginOrEmail" className="form-label">Login or Email</label>
            <input
              type="text"
              className="form-control"
              id="loginOrEmail"
              value={loginOrEmail}
              onChange={(e) => setLoginOrEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/register">Register</a></p>
          <p><a href="/forgot-password">Forgot Password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 