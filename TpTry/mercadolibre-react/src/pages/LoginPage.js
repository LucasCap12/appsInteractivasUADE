// Página de Login/Registro
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

const LoginPage = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Si el usuario ya está logueado, redirigir a home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Determinar el tab inicial basado en la URL
  const getInitialTab = () => {
    if (location.pathname.includes('register')) {
      return 'register';
    }
    return 'login';
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoginModal 
        isOpen={showModal} 
        onClose={handleClose}
        initialTab={getInitialTab()}
      />
    </div>
  );
};

export default LoginPage;
