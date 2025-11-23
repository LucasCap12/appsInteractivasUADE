import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message, duration) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const warning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const info = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const confirm = useCallback((message, onConfirm, onCancel) => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type: 'confirm',
        duration: 0,
        onConfirm: () => {
          removeNotification(id);
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          removeNotification(id);
          if (onCancel) onCancel();
          resolve(false);
        }
      };
      
      setNotifications(prev => [...prev, notification]);
    });
  }, [removeNotification]);

  return (
    <NotificationContext.Provider
      value={{ success, error, warning, info, confirm, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onClose }) => {
  const { message, type, onConfirm, onCancel } = notification;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    confirm: <AlertTriangle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    confirm: 'bg-orange-50 border-orange-200 text-orange-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    confirm: 'text-orange-600'
  };

  if (type === 'confirm') {
    return (
      <div className={`${colors[type]} border rounded-lg shadow-lg p-4 min-w-[320px] animate-slide-in`}>
        <div className="flex items-start gap-3">
          <div className={iconColors[type]}>{icons[type]}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={onConfirm}
                className="px-4 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm font-medium transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colors[type]} border rounded-lg shadow-lg p-4 min-w-[320px] animate-slide-in flex items-start gap-3`}>
      <div className={iconColors[type]}>{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
