import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center my-5">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/chats" replace />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="text-center mb-4">GeoChat</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 