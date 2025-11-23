import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefono: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const profile = await userService.getProfile();
      setFormData({
        nombre: profile.nombre || '',
        apellido: profile.apellido || '',
        email: profile.email || '',
        direccion: profile.direccion || '',
        telefono: profile.telefono || ''
      });
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError('No se pudo cargar el perfil. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar mensajes al editar
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('Nombre y apellido son obligatorios');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updatedProfile = await userService.updateProfile({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim()
      });

      // Actualizar contexto de autenticación
      updateUser({
        ...user,
        nombre: updatedProfile.nombre,
        apellido: updatedProfile.apellido
      });

      setSuccess('Perfil actualizado correctamente');
      setEditing(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfile(); // Recargar datos originales
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface dark:bg-surface-dark shadow-lg rounded-lg overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark px-6 py-8 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
            <p className="text-white text-opacity-90 mt-2">
              Gestiona tu información personal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8">
            {/* Mensajes de error/éxito */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    editing 
                      ? 'bg-surface dark:bg-surface-dark border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-dark-primary' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-text-secondary dark:text-text-dark-secondary cursor-not-allowed'
                  }`}
                  placeholder="Ingrese su nombre"
                />
              </div>

              {/* Apellido */}
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
                  disabled={!editing}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    editing 
                      ? 'bg-surface dark:bg-surface-dark border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-dark-primary' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-text-secondary dark:text-text-dark-secondary cursor-not-allowed'
                  }`}
                  placeholder="Ingrese su apellido"
                />
              </div>

              {/* Email (no editable) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-text-primary dark:text-text-dark-primary rounded-lg cursor-not-allowed transition-colors"
                />
                <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
                  El email no puede ser modificado
                </p>
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Dirección
                </label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    editing 
                      ? 'bg-surface dark:bg-surface-dark border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-dark-primary' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-text-secondary dark:text-text-dark-secondary cursor-not-allowed'
                  }`}
                  placeholder="Ingrese su dirección completa"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    editing 
                      ? 'bg-surface dark:bg-surface-dark border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-dark-primary' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-text-secondary dark:text-text-dark-secondary cursor-not-allowed'
                  }`}
                  placeholder="Ingrese su teléfono"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 flex gap-4">
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-6 py-4 transition-colors duration-300">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            ℹ️ Información de seguridad
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Tu email es tu identificador único y no puede ser modificado. 
            Si necesitas cambiar tu email, contacta a soporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
