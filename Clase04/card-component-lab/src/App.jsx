import { useState } from 'react'
import './App.css'
import Card from './components/Card'
import Counter from './components/Counter'

function App() {
  // Estado para demostrar interactividad
  const [favoritos, setFavoritos] = useState([]);
  const [tema, setTema] = useState('light');

  // Funciones para pasar como props (props con funciones)
  const agregarFavorito = (producto) => {
    if (!favoritos.includes(producto)) {
      setFavoritos([...favoritos, producto]);
      alert(`${producto} agregado a favoritos! ⭐`);
    } else {
      alert(`${producto} ya está en favoritos! 💙`);
    }
  };

  const contactarVendedor = (vendedor) => {
    alert(`Contactando a ${vendedor}... 📞`);
  };

  const comprarProducto = (producto) => {
    alert(`Comprando ${producto}... 🛒`);
  };

  const cambiarTema = () => {
    setTema(tema === 'light' ? 'dark' : 'light');
  };

  // Estilos del contenedor principal
  const appStyle = {
    minHeight: '100vh',
    backgroundColor: tema === 'dark' ? '#1a202c' : '#f7fafc',
    color: tema === 'dark' ? '#fff' : '#333',
    padding: '20px',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const cardsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const statsStyle = {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
    backgroundColor: tema === 'dark' ? '#2d3748' : '#e2e8f0',
    borderRadius: '12px',
    maxWidth: '400px',
    margin: '40px auto'
  };

  return (
    <div style={appStyle}>
      <header style={headerStyle}>
        <h1>🛍️ Tienda React - Laboratorio Clase 04</h1>
        <p>Demostración de componentes con props valores, funciones y children</p>
        
        <button 
          onClick={cambiarTema}
          style={{
            padding: '10px 20px',
            backgroundColor: tema === 'dark' ? '#4299e1' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </button>
      </header>

      <div style={cardsContainerStyle}>
        
        {/* Card 1: Producto con imagen - Props con valores y función */}
        <Card
          title="iPhone 15 Pro"
          description="El último iPhone con chip A17 Pro, cámara de 48MP y diseño en titanio."
          imageUrl="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=180&fit=crop"
          buttonText="Agregar a Favoritos"
          onButtonClick={() => agregarFavorito('iPhone 15 Pro')}
          isHighlighted={favoritos.includes('iPhone 15 Pro')}
          variant={tema}
        />

        {/* Card 2: Servicio con children personalizados */}
        <Card
          title="Asesoría Técnica"
          description="Consultoría especializada en desarrollo web y móvil."
          buttonText="Contactar Especialista"
          onButtonClick={() => contactarVendedor('Juan Pérez')}
          isHighlighted={false}
          variant={tema}
        >
          {/* Props children: contenido personalizable */}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>
              🎯 Especialidades
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>⚛️ React & React Native</li>
              <li>🟢 Node.js & Express</li>
              <li>🗃️ MongoDB & PostgreSQL</li>
              <li>☁️ AWS & Docker</li>
            </ul>
          </div>
        </Card>

        {/* Card 3: Producto con contador interactivo */}
        <Card
          title="Auriculares Sony"
          description="Auriculares inalámbricos con cancelación de ruido activa."
          imageUrl="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=180&fit=crop"
          buttonText="Comprar Ahora"
          onButtonClick={() => comprarProducto('Auriculares Sony')}
          isHighlighted={favoritos.includes('Auriculares Sony')}
          variant={tema}
        >
          {/* Props children con componente Counter */}
          <div style={{ textAlign: 'center' }}>
            <h5 style={{ margin: '0 0 12px 0' }}>Cantidad:</h5>
            <Counter initialValue={1} step={1} maxValue={5} />
            <button 
              onClick={() => agregarFavorito('Auriculares Sony')}
              style={{
                marginTop: '12px',
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #007bff',
                color: '#007bff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ⭐ Favorito
            </button>
          </div>
        </Card>

        {/* Card 4: Card informativa solo con children */}
        <Card
          title="📚 Conceptos Demostrados"
          description="Esta aplicación demuestra todos los conceptos de React vistos en clase."
          variant={tema}
        >
          {/* Props children con información técnica */}
          <div style={{ fontSize: '14px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#28a745' }}>
              ✅ Implementado:
            </h4>
            <div style={{ marginBottom: '12px' }}>
              <strong>🔧 Props con valores:</strong>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>
                title, description, imageUrl, isHighlighted, variant
              </p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>⚡ Props con funciones:</strong>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>
                onButtonClick (agregarFavorito, contactarVendedor, comprarProducto)
              </p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>🎨 Props children:</strong>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>
                Contenido personalizable, listas, componentes anidados
              </p>
            </div>
            <div>
              <strong>🎯 useState Hook:</strong>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>
                Estado para favoritos, tema, contador
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* Estadísticas dinámicas */}
      <div style={statsStyle}>
        <h3>📊 Estadísticas de la Sesión</h3>
        <p><strong>Favoritos:</strong> {favoritos.length}</p>
        <p><strong>Tema actual:</strong> {tema === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}</p>
        {favoritos.length > 0 && (
          <div>
            <p><strong>Lista de favoritos:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {favoritos.map((item, index) => (
                <li key={index} style={{ margin: '4px 0' }}>
                  ⭐ {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
