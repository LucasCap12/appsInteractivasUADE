import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // @VALIDATION: Validaciones mejoradas con RegEx (cumplimiento académico WCAG + buenas prácticas)
    // @AI_CONTEXT: RegEx para email RFC 5322 simplificado (acepta most common cases)
    // @SECURITY: Validación client-side (primera línea de defensa, backend también valida)
    
    // STEP 1: Validar campos vacíos
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    // STEP 2: Validar formato de email con RegEx
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un email válido (ejemplo: usuario@dominio.com)');
      return;
    }

    // STEP 3: Validar longitud mínima de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  // Función para llenar credenciales de demo
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@market.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'juan@market.com',
        password: '123456'
      });
    }
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <section aria-label="Formulario de inicio de sesión" className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary p-4 rounded-full shadow-lg">
              <ShoppingCart className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary">
            Inicia sesión para continuar comprando
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-xl p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={error && !formData.email}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={error && !formData.password}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div id="login-error" role="alert" className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle aria-hidden="true" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Credenciales de demo */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary text-center mb-3">
              Cuentas de prueba:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                disabled={isLoading}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="flex-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                disabled={isLoading}
              >
                Usuario
              </button>
            </div>
          </div>

          {/* Links adicionales */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/recuperar-password"
              className="block text-sm text-primary dark:text-primary-light hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary dark:text-primary-light font-semibold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Link para volver */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
