# Clase 04 - React Fundamentos y Componentes

Este directorio contiene el material y las actividades prácticas de la **Clase 04** del curso de Aplicaciones Interactivas UADE.

## 📚 Contenido de la Clase

### Conceptos Principales
- **React**: Librería de JavaScript para interfaces de usuario
- **JSX**: JavaScript XML para escribir HTML en JavaScript
- **Componentes**: Funciones que retornan JSX
- **Props**: Propiedades para comunicación entre componentes
- **useState Hook**: Gestión de estado en componentes funcionales
- **Virtual DOM**: Optimización de renderizado

### Comparación con HTML/CSS/JS tradicional
- ✅ **Componentización**: Código reutilizable
- ✅ **Estado encapsulado**: Gestión automática de actualizaciones
- ✅ **Mejor rendimiento**: Virtual DOM
- ✅ **Escalabilidad**: Arquitectura modular
- ✅ **Desarrollo más rápido**: Hot Module Replacement (HMR)

## 🚀 Proyectos Incluidos

### 1. `hola-react/` - Proyecto de Introducción
Proyecto básico creado con Vite para aprender los fundamentos de React.

**Ejecutar:**
```bash
cd hola-react
npm install
npm run dev
```

### 2. `card-component-lab/` - 🎯 **LABORATORIO PRINCIPAL**
Proyecto que cumple con la **consigna del laboratorio**: *"Crear y mostrar un componente react, cualquiera, que reciba props con valores, props con funciones y props children"*.

#### Características implementadas:
- ✅ **Componente Card** reutilizable
- ✅ **Props con valores** (title, description, imageUrl, isHighlighted, variant)
- ✅ **Props con funciones** (onButtonClick con diferentes handlers)
- ✅ **Props children** (contenido personalizable)
- ✅ **useState Hook** para estado dinámico
- ✅ **Estilos inline como objetos**
- ✅ **Renderizado condicional**

#### Componentes creados:
- **`Card.jsx`**: Componente principal que demuestra todos los conceptos
- **`Counter.jsx`**: Componente adicional con useState Hook

#### Demostración práctica:
- 🛍️ Tienda virtual con cards de productos
- ⭐ Sistema de favoritos con estado
- 🌙 Tema claro/oscuro intercambiable
- 📊 Contador interactivo
- 📱 Diseño responsivo

**Ejecutar:**
```bash
cd card-component-lab
npm install
npm run dev
# Acceder a: http://localhost:5173
```

### 3. `Contenidos-Clase04.txt`
Material teórico completo de la clase con explicaciones detalladas de:
- Fundamentos de React
- JSX y transpilación
- Herramientas (npm, Vite)
- Props y comunicación entre componentes
- useState Hook
- Diferencias entre librerías y frameworks

## 🛠️ Tecnologías Utilizadas

- **React 18**: Librería principal
- **Vite**: Build tool moderno y rápido
- **JavaScript**: Lenguaje de programación
- **JSX**: Extensión de sintaxis
- **CSS inline**: Estilos como objetos JavaScript
- **npm**: Gestor de paquetes

## 📋 Conceptos Demostrados

### 1. Props con Valores
```jsx
<Card 
  title="Mi Producto"
  description="Descripción del producto"
  isHighlighted={true}
  variant="dark"
/>
```

### 2. Props con Funciones
```jsx
const manejarClick = () => alert('¡Clicked!');

<Card 
  buttonText="Hacer Click"
  onButtonClick={manejarClick}
/>
```

### 3. Props Children
```jsx
<Card title="Mi Card">
  <div>
    <h4>Contenido personalizado</h4>
    <p>Cualquier contenido aquí</p>
  </div>
</Card>
```

### 4. useState Hook
```jsx
const [count, setCount] = useState(0);
const incrementar = () => setCount(count + 1);
```

## 🎯 Objetivos de Aprendizaje Cumplidos

- [x] Comprender qué es React y por qué usarlo
- [x] Crear proyectos React con Vite
- [x] Escribir componentes funcionales
- [x] Utilizar JSX efectivamente
- [x] Implementar props para comunicación
- [x] Gestionar estado con useState
- [x] Aplicar estilos inline como objetos
- [x] Crear componentes reutilizables
- [x] Implementar renderizado condicional

## 🔄 Hot Module Replacement (HMR)

Ambos proyectos incluyen HMR para desarrollo ágil:
- Los cambios se reflejan instantáneamente
- No se pierde el estado de la aplicación
- Acelera significativamente el desarrollo

## 📖 Recursos Adicionales

- [Documentación oficial de React](https://es.react.dev/)
- [Guía de Vite](https://vite.dev/guide/)
- [JSX en profundidad](https://es.react.dev/learn/writing-markup-with-jsx)
- [Hooks de React](https://es.react.dev/reference/react)

---

**Autor**: Lucas Cap  
**Curso**: Aplicaciones Interactivas UADE  
**Fecha**: Agosto 2025
