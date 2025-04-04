import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyRegistrationForm: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { verifyRegistration } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('User ID is missing');
      return;
    }

    try {
      await verifyRegistration(userId, code);
      setSuccess('Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify email');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Verify Email</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <p className="mb-3">Please enter the verification code sent to your email address.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">Verification Code</label>
            <input
              type="text"
              className="form-control"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Verify Email</button>
        </form>
        <div className="mt-3 text-center">
          <p>Didn't receive the code? <a href="/login">Try again later</a></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegistrationForm; 