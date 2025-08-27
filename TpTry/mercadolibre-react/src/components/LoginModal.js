// Componente modal para Login/Registro
import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validaciones
    const newErrors = {};
    if (!loginForm.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(loginForm.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!loginForm.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        onClose();
        setLoginForm({ email: '', password: '', rememberMe: false });
      } else {
        setErrors({ general: result.error || 'Error al iniciar sesión' });
      }
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validaciones
    const newErrors = {};
    if (!registerForm.firstName) {
      newErrors.firstName = 'El nombre es requerido';
    }
    if (!registerForm.lastName) {
      newErrors.lastName = 'El apellido es requerido';
    }
    if (!registerForm.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(registerForm.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!registerForm.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(registerForm.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!registerForm.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        name: `${registerForm.firstName} ${registerForm.lastName}`,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password
      });
      
      if (result.success) {
        onClose();
        setRegisterForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false
        });
      } else {
        setErrors({ general: result.error || 'Error al crear cuenta' });
      }
    } catch (error) {
      setErrors({ general: 'Error al crear cuenta' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implementar login social
    console.log(`Login with ${provider}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Mi Cuenta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'login'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'register'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registrarse
          </button>
        </div>

        <div className="p-6">
          {/* Errores generales */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          {/* Formulario de Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email o usuario"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">Recordarme</span>
                </label>
                <button type="button" className="text-sm text-primary hover:text-blue-600">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          )}

          {/* Formulario de Registro */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar contraseña"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={registerForm.acceptTerms}
                    onChange={(e) => setRegisterForm({ ...registerForm, acceptTerms: e.target.checked })}
                    className="mt-1 mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">
                    Acepto los{' '}
                    <button type="button" className="text-primary hover:text-blue-600">
                      términos y condiciones
                    </button>
                    {' '}y la{' '}
                    <button type="button" className="text-primary hover:text-blue-600">
                      política de privacidad
                    </button>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>
          )}

          {/* Login Social */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
