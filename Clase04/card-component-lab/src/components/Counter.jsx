import React, { useState } from 'react';

const Counter = ({ initialValue = 0, step = 1, maxValue = 20 }) => {
  // useState Hook - gestión del estado
  const [count, setCount] = useState(initialValue);

  const incrementar = () => {
    if (count < maxValue) {
      setCount(count + step);
    }
  };

  const decrementar = () => {
    if (count > 0) {
      setCount(count - step);
    }
  };

  const resetear = () => {
    setCount(initialValue);
  };

  // Estilos inline como objetos
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const countDisplayStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: count >= maxValue ? '#dc3545' : count > maxValue / 2 ? '#fd7e14' : '#28a745',
    padding: '8px 16px',
    border: '2px solid currentColor',
    borderRadius: '50px',
    minWidth: '80px',
    textAlign: 'center'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  };

  const incrementButtonStyle = {
    ...buttonStyle,
    backgroundColor: count >= maxValue ? '#6c757d' : '#28a745',
    color: 'white'
  };

  const decrementButtonStyle = {
    ...buttonStyle,
    backgroundColor: count <= 0 ? '#6c757d' : '#dc3545',
    color: 'white'
  };

  const resetButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <div style={countDisplayStyle}>
        {count}
      </div>
      
      <div style={buttonContainerStyle}>
        <button 
          style={incrementButtonStyle}
          onClick={incrementar}
          disabled={count >= maxValue}
        >
          + {step}
        </button>
        
        <button 
          style={decrementButtonStyle}
          onClick={decrementar}
          disabled={count <= 0}
        >
          - {step}
        </button>
        
        <button 
          style={resetButtonStyle}
          onClick={resetear}
        >
          Reset
        </button>
      </div>
      
      {count >= maxValue && (
        <p style={{ color: '#dc3545', fontSize: '12px', textAlign: 'center' }}>
          ¡Máximo alcanzado! 🎯
        </p>
      )}
    </div>
  );
};

export default Counter;