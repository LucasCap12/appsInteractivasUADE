import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, Mail, Lock, AlertCircle, Loader2, Phone, MapPin, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores al escribir
    setError('');
    setFieldErrors({});
  };

  // @TASK: validateForm - Validación exhaustiva con RegEx para cumplimiento académico
  // @AI_CONTEXT: Client-side validation (primera línea de defensa, backend también valida con @Valid)
  // @VALIDATION: RegEx patterns para email, password strength, teléfono argentino
  // @SECURITY: Password strength enforcement (mínimo 8 chars, letras + números)
  const validateForm = () => {
    const errors = {};

    // STEP 1: Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'Debe tener al menos 2 caracteres';
    }

    // STEP 2: Validar apellido
    if (!formData.apellido.trim()) {
      errors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      errors.apellido = 'Debe tener al menos 2 caracteres';
    }

    // STEP 3: Validar nombre de usuario
    if (!formData.nombreUsuario.trim()) {
      errors.nombreUsuario = 'El nombre de usuario es requerido';
    } else if (formData.nombreUsuario.length < 3) {
      errors.nombreUsuario = 'Debe tener al menos 3 caracteres';
    }

    // STEP 4: Validar email con RegEx (RFC 5322 simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido (ejemplo: usuario@dominio.com)';
    }

    // STEP 5: Validar contraseña con requisitos robustos (password strength)
    // RegEx: Mínimo 8 caracteres, al menos 1 letra y 1 número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = 'Debe tener mínimo 8 caracteres, al menos 1 letra y 1 número';
    }

    // STEP 6: Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // STEP 7: Validar teléfono con RegEx (formato argentino: 10-15 dígitos)
    const telefonoRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!telefonoRegex.test(formData.telefono)) {
      errors.telefono = 'Formato inválido (ejemplo: 1134567890 o +54 11 3456-7890)';
    }

    // STEP 8: Validar dirección
    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es requerida';
    } else if (formData.direccion.trim().length < 5) {
      errors.direccion = 'Debe tener al menos 5 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      // Enviar datos sin confirmPassword
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error al crear la cuenta');
      }
    } catch (err) {
      setError('Error al registrarse. Por favor, intenta nuevamente.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 transition-colors duration-300">
      <section aria-label="Formulario de registro" className="max-w-2xl mx-auto">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary p-4 rounded-full shadow-lg">
              <ShoppingCart className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
            Crear cuenta nueva
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary">
            Únete y comienza a disfrutar de nuestras ofertas
          </p>
        </div>

        {/* Formulario de registro */}
        <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-xl p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Nombre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      fieldErrors.nombre ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    placeholder="Juan"
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.nombre}
                    aria-describedby={fieldErrors.nombre ? "nombre-error" : undefined}
                  />
                </div>
                {fieldErrors.nombre && (
                  <p id="nombre-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.nombre}</p>
                )}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 border ${
                    fieldErrors.apellido ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                  placeholder="Pérez"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.apellido}
                  aria-describedby={fieldErrors.apellido ? "apellido-error" : undefined}
                />
                {fieldErrors.apellido && (
                  <p id="apellido-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.apellido}</p>
                )}
              </div>
            </div>

            {/* Nombre de Usuario */}
            <div>
              <label htmlFor="nombreUsuario" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Nombre de Usuario *
              </label>
              <input
                type="text"
                id="nombreUsuario"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                className={`block w-full px-3 py-3 border ${
                  fieldErrors.nombreUsuario ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                placeholder="juanperez"
                disabled={isLoading}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.nombreUsuario}
                aria-describedby={fieldErrors.nombreUsuario ? "nombreUsuario-error" : undefined}
              />
              {fieldErrors.nombreUsuario && (
                <p id="nombreUsuario-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.nombreUsuario}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Email *
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
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    fieldErrors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                  placeholder="juan@email.com"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Contraseña y Confirmar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Contraseña *
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
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      fieldErrors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  />
                </div>
                {fieldErrors.password && (
                  <p id="password-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      fieldErrors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="confirmPassword-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    fieldErrors.telefono ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                  placeholder="1134567890"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.telefono}
                  aria-describedby={fieldErrors.telefono ? "telefono-error" : undefined}
                />
              </div>
              {fieldErrors.telefono && (
                <p id="telefono-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.telefono}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Dirección *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    fieldErrors.direccion ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                  placeholder="Av. Corrientes 1234, Buenos Aires"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.direccion}
                  aria-describedby={fieldErrors.direccion ? "direccion-error" : undefined}
                />
              </div>
              {fieldErrors.direccion && (
                <p id="direccion-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.direccion}</p>
              )}
            </div>

            {/* Mensaje de error general */}
            {error && (
              <div id="register-error" role="alert" className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle aria-hidden="true" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary dark:text-primary-light font-semibold hover:underline">
                Inicia sesión
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

export default Register;
