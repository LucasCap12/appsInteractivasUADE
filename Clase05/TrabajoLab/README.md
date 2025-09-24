# 🛍️ Trabajo de Laboratorio - E-Commerce con React Hooks

## 📋 Descripción

Este proyecto es un trabajo de laboratorio para la materia **Aplicaciones Interactivas** de Ingeniería en Informática. Implementa una aplicación de e-commerce que cumple con los siguientes requerimientos:

- ✅ **Componente que lista productos**
- ✅ **Funcionalidad para agregar items al carrito**
- ✅ **useState** - Para manejar estados locales
- ✅ **useEffect** - Para llamadas a APIs
- ✅ **useContext** - Para compartir información entre componentes

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca para construir interfaces de usuario
- **Vite** - Herramienta de build y desarrollo
- **JSON Server** - API REST simulada
- **CSS3** - Estilos responsivos
- **JavaScript ES6+** - Sintaxis moderna

## 📁 Estructura del Proyecto

```
TrabajoLab/
├── src/
│   ├── components/
│   │   ├── ProductList.jsx    # Lista de productos (useState + useEffect)
│   │   └── Cart.jsx           # Carrito de compras (useContext)
│   ├── context/
│   │   └── CartContext.jsx    # Contexto global del carrito
│   ├── App.jsx                # Componente principal
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales
├── db.json                   # Base de datos JSON Server
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor JSON
```bash
npm run server
```
Esto iniciará json-server en http://localhost:3001

### 3. Iniciar la aplicación React (en otra terminal)
```bash
npm run dev
```
Esto iniciará la aplicación en http://localhost:5173

## 📚 Hooks Implementados

### 1. **useState**
- **Ubicación**: `ProductList.jsx`
- **Propósito**: Manejar estados locales (productos, loading, error)
- **Ejemplo**:
```jsx
const [productos, setProductos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 2. **useEffect**
- **Ubicación**: `ProductList.jsx`
- **Propósito**: Realizar llamadas a la API al montar el componente
- **Ejemplo**:
```jsx
useEffect(() => {
  const fetchProductos = async () => {
    // Llamada a API
  };
  fetchProductos();
}, []); // Array vacío = solo se ejecuta al montar
```

### 3. **useContext**
- **Ubicación**: `CartContext.jsx` y `Cart.jsx`
- **Propósito**: Compartir estado del carrito entre componentes
- **Ejemplo**:
```jsx
// Crear contexto
const CartContext = createContext();

// Usar contexto
const { cartItems, addToCart } = useCart();
```

## 🔄 Flujo de Datos

1. **Carga inicial**: `ProductList` usa `useEffect` para cargar productos desde la API
2. **Agregar al carrito**: Click en botón ejecuta `addToCart()` del contexto
3. **Actualización automática**: `Cart` se re-renderiza automáticamente gracias a `useContext`
4. **Estado global**: El carrito se mantiene sincronizado en toda la aplicación

## 🎯 Funcionalidades

### Lista de Productos
- ✅ Carga productos desde JSON Server
- ✅ Muestra información detallada (nombre, precio, descripción, stock)
- ✅ Imágenes con fallback si no cargan
- ✅ Estados de carga y error
- ✅ Botón para agregar al carrito

### Carrito de Compras
- ✅ Contador de items
- ✅ Total de precio
- ✅ Lista de productos agregados
- ✅ Cantidad por producto
- ✅ Remover productos individuales
- ✅ Vaciar carrito completo

## 🎨 Características del Diseño

- **Responsive**: Se adapta a móviles y tablets
- **Grid Layout**: Productos organizados en grilla
- **Gradientes**: Diseño moderno con colores atractivos
- **Animaciones**: Efectos hover y transiciones suaves
- **UX/UI**: Interfaz intuitiva y fácil de usar

## 📡 API Endpoints

La aplicación consume los siguientes endpoints de JSON Server:

- `GET http://localhost:3001/productos` - Obtiene lista de productos

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run server` - Inicia JSON Server en puerto 3001

## 🎓 Conceptos de React Aplicados

### Componentes Funcionales
Todos los componentes están implementados como funciones de React, aprovechando los hooks.

### Estado Inmutable
Se siguen las mejores prácticas de React manteniendo la inmutabilidad del estado.

### Separación de Responsabilidades
- `ProductList`: Responsable solo de mostrar productos
- `Cart`: Responsable solo de mostrar el carrito
- `CartContext`: Responsable solo del estado global

### Props vs Context
- **Props**: Para datos específicos de componentes
- **Context**: Para estado global que necesitan múltiples componentes

## 📝 Notas del Desarrollo

### ¿Por qué useContext?
Se eligió `useContext` para el carrito porque:
- Evita "prop drilling" (pasar props por múltiples niveles)
- Permite que cualquier componente acceda al estado del carrito
- Simplifica la comunicación entre componentes no relacionados

### ¿Por qué useEffect con array vacío?
```jsx
useEffect(() => {
  // Código aquí
}, []); // ← Array vacío
```
El array vacío hace que el efecto se ejecute solo una vez al montar el componente, ideal para cargar datos iniciales.

### ¿Por qué useState para múltiples estados?
Se usan múltiples `useState` en lugar de un objeto porque:
- Cada estado tiene responsabilidades diferentes
- React puede optimizar re-renderizados mejor
- Es más claro y mantenible

## 🚨 Solución de Problemas

### Error "fetch failed"
**Causa**: JSON Server no está ejecutándose
**Solución**: Ejecutar `npm run server` en una terminal separada

### Puerto ya en uso
**Causa**: El puerto 3001 o 5173 están ocupados
**Solución**: Cambiar puertos en `package.json` y `vite.config.js`

### Imágenes no cargan
**Causa**: URLs de Picsum pueden fallar ocasionalmente
**Solución**: Las imágenes tienen fallback automático

## 👨‍💻 Autor

**Estudiante de Ingeniería en Informática**
- Materia: Aplicaciones Interactivas
- Trabajo: Laboratorio Clase 05

---

## 📚 Recursos de Aprendizaje

- [Documentación oficial de React](https://react.dev/)
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [useContext Hook](https://react.dev/reference/react/useContext)
- [JSON Server](https://github.com/typicode/json-server)

¡Proyecto desarrollado con 💜 para aprender React Hooks!
