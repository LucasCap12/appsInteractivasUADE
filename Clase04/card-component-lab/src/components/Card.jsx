import React from 'react';

const Card = ({ title, description, imageUrl, buttonText, onButtonClick, isHighlighted, variant, children }) => {
  // Estilos inline como objetos (según contenidos de clase)
  const cardStyle = {
    border: isHighlighted ? '2px solid #007bff' : '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    margin: '16px',
    maxWidth: '320px',
    minHeight: '200px',
    boxShadow: isHighlighted ? '0 8px 16px rgba(0,123,255,0.3)' : '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: variant === 'dark' ? '#2d3748' : '#fff',
    color: variant === 'dark' ? '#fff' : '#333',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transform: isHighlighted ? 'translateY(-4px)' : 'translateY(0)'
  };

  const imageStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '16px'
  };

  const titleStyle = {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: variant === 'dark' ? '#fff' : '#2d3748'
  };

  const descriptionStyle = {
    color: variant === 'dark' ? '#cbd5e0' : '#718096',
    marginBottom: '16px',
    lineHeight: '1.6',
    fontSize: '14px'
  };

  const buttonStyle = {
    backgroundColor: variant === 'dark' ? '#4299e1' : '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    width: '100%'
  };

  const childrenContainerStyle = {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: variant === 'dark' ? '#4a5568' : '#f7fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #007bff'
  };

  // Función para manejar hover del botón
  const handleButtonHover = (e) => {
    e.target.style.backgroundColor = variant === 'dark' ? '#3182ce' : '#0056b3';
    e.target.style.transform = 'translateY(-2px)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.backgroundColor = variant === 'dark' ? '#4299e1' : '#007bff';
    e.target.style.transform = 'translateY(0)';
  };

  return (
    <div style={cardStyle}>
      {/* Props con valores: imageUrl */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={imageStyle}
        />
      )}
      
      {/* Props con valores: title */}
      <h3 style={titleStyle}>{title}</h3>
      
      {/* Props con valores: description */}
      <p style={descriptionStyle}>{description}</p>
      
      {/* Props children: contenido personalizable */}
      {children && (
        <div style={childrenContainerStyle}>
          {children}
        </div>
      )}
      
      {/* Props con funciones: onButtonClick */}
      {buttonText && onButtonClick && (
        <button 
          style={buttonStyle}
          onClick={onButtonClick}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;