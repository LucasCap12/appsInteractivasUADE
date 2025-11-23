import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para manejar focus trap en modales
 * @param {boolean} isOpen - Estado del modal (abierto/cerrado)
 * @returns {Object} - Ref para el contenedor del modal
 */
export const useModalFocus = (isOpen) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Guardar el elemento que tenía focus antes de abrir el modal
    previousFocusRef.current = document.activeElement;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Enfocar el modal
    modalElement.focus();

    // Obtener todos los elementos focusables dentro del modal
    const getFocusableElements = () => {
      return modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    // Handler para trap del focus con Tab
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Si no hay elementos focusables, prevenir Tab
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      // Shift + Tab en el primer elemento → ir al último
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab en el último elemento → ir al primero
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    // Agregar listener
    modalElement.addEventListener('keydown', handleTab);

    // Cleanup: restaurar focus cuando se cierra el modal
    return () => {
      modalElement.removeEventListener('keydown', handleTab);
      
      // Restaurar focus al elemento anterior
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  return modalRef;
};
