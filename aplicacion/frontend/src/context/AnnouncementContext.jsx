import React, { createContext, useContext, useState, useCallback } from 'react';

const AnnouncementContext = createContext();

export const useAnnouncement = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncement debe usarse dentro de AnnouncementProvider');
  }
  return context;
};

export const AnnouncementProvider = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');
  const [announcementKey, setAnnouncementKey] = useState(0);

  // Announce mensaje para lectores de pantalla
  const announce = useCallback((message, priority = 'polite') => {
    if (!message) return;
    
    // Cambiar key para forzar re-render y re-anuncio
    setAnnouncementKey(prev => prev + 1);
    setAnnouncement(message);

    // Limpiar anuncio después de 3 segundos
    setTimeout(() => {
      setAnnouncement('');
    }, 3000);
  }, []);

  return (
    <AnnouncementContext.Provider value={{ announce }}>
      {children}
      {/* ARIA Live Region global - siempre presente pero oculta visualmente */}
      <div
        key={announcementKey}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </AnnouncementContext.Provider>
  );
};
