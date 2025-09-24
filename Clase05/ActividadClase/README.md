# Clase 05 - React Hooks y JSON Server

## 📋 Descripción del Proyecto

Este proyecto implementa los conceptos fundamentales de React Hooks y la integración con JSON Server para simular una API REST. Se enfoca en el desarrollo de una aplicación e-commerce utilizando los hooks principales de React: `useState`, `useEffect` y `useContext`.

## 🎯 Objetivos de Aprendizaje

### Hooks de React Implementados:

#### 1. **useState**

- Manejo del estado local en componentes funcionales
- Control de variables que cambian con el tiempo
- Aplicaciones en e-commerce:
  - Gestión del carrito de compras
  - Control de filtros de productos
  - Manejo de formularios
  - Estado de botones (habilitar/deshabilitar)

#### 2. **useEffect**

- Manejo de efectos secundarios
- Llamadas a APIs externas
- Ciclo de vida de componentes
- Optimización con arrays de dependencias

#### 3. **useContext**

- Compartir estado global entre componentes
- Evitar "prop drilling"
- Gestión centralizada del carrito de compras
- Flujo de datos eficiente

## 🛠️ Tecnologías Utilizadas

- **React**: Librería para construir interfaces de usuario
- **Vite**: Herramienta de desarrollo y bundling
- **JSON Server**: Simulador de API REST
- **JSX**: Extensión de JavaScript para escribir HTML en JS
- **ESLint**: Linter para mantener calidad del código

## 📦 Estructura del Proyecto

```
ActividadClase/
├── hola-react/
│   ├── hooks/                    # Ejemplos de hooks
│   ├── json-server/
│   │   └── db.json              # Base de datos simulada
│   ├── package.json             # Dependencias del proyecto
│   └── node_modules/            # Dependencias instaladas
├── react/                       # Componentes React adicionales
├── info/                        # Recursos y documentación
├── Consigna.txt                # Instrucciones del proyecto
├── Contenidos-Clase05.txt      # Teoría y conceptos
└── README.md                   # Este archivo
```

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos

- Node.js instalado en el sistema
- npm (viene con Node.js)

### 1. Clonar o descargar el proyecto

```bash
# Navegar al directorio del proyecto
cd "c:\Users\user\Documents\AppInteract\Clase05\ActividadClase\hola-react"
```

### 2. Instalar dependencias

```bash
# Inicializar package.json (si no existe)
npm init -y

# Instalar JSON Server
npm install json-server
```

### 3. Ejecutar JSON Server

```bash
# Navegar al directorio json-server
cd json-server

# Levantar el servidor
npx json-server db.json
```

### 4. Verificar la API

Una vez ejecutado, JSON Server estará disponible en:

- **URL Base**: http://localhost:3000/
- **Endpoints**:
  - `GET http://localhost:3000/productos` - Lista todos los productos (13 productos)
  - `GET http://localhost:3000/usuarios` - Lista todos los usuarios (3 usuarios)
  - `GET http://localhost:3000/productos/1` - Obtiene producto específico
  - `POST http://localhost:3000/productos` - Crear nuevo producto
  - `PUT http://localhost:3000/productos/1` - Actualizar producto
  - `DELETE http://localhost:3000/productos/1` - Eliminar producto

## 📊 Datos Disponibles

### Productos (13 items)

- Ray-Ban Aviator Classic
- Cámara Canon EOS R5
- Guantes de Boxeo Pro
- Smartwatch Galaxy Watch 5
- Zapatillas Running Pro
- Laptop Gaming ROG
- Raqueta de Tenis Pro
- Drone DJI Air 2S
- Bicicleta Mountain Bike
- Auriculares Sony WH-1000XM5
- Mochila Fotográfica Pro
- Pelota de Fútbol Profesional
- Termo Stanley Classic

### Usuarios (3 items)

- Juan Pérez
- María García
- Carlos Rodríguez

## 🎨 Conceptos Clave Implementados

### Programación Declarativa vs Imperativa

- **Declarativa**: React se enfoca en el "qué" mostrar según el estado
- **Imperativa**: Indicar paso a paso "cómo" modificar el DOM

### Virtual DOM

- React mantiene una representación virtual del DOM
- Compara cambios y actualiza solo lo necesario
- Optimiza el rendimiento evitando manipulaciones innecesarias

### Flujo Unidireccional de Datos

- Los datos fluyen de componentes padre a hijo
- Facilita el seguimiento de cambios
- Evita efectos secundarios no deseados

## 🛍️ Trabajo de Laboratorio

### Objetivo Principal

Crear un componente que:

1. **Liste productos** desde la API
2. **Permita agregar items al carrito**
3. **Utilice useState** para el estado local
4. **Implemente useEffect** para llamadas a la API
5. **Use useContext** para compartir el carrito entre componentes

### Flujo de Funcionamiento

1. El componente se monta y `useEffect` llama a la API
2. Los productos se almacenan en el estado con `useState`
3. Al hacer clic en "Agregar al carrito", se actualiza el contexto
4. Todos los componentes que consumen el contexto se re-renderizan
5. El contador del carrito se actualiza automáticamente

## 🔧 Comandos Útiles

```bash
# Verificar que JSON Server esté corriendo
curl http://localhost:3000/productos

# Ver productos en el navegador
# Ir a: http://localhost:3000/productos

# Detener JSON Server
# Presionar Ctrl + C en la terminal donde está corriendo
```

## 📝 Notas Importantes

- JSON Server crea automáticamente endpoints RESTful
- Los cambios en `db.json` se reflejan automáticamente en la API
- El servidor incluye CORS habilitado para desarrollo
- Soporta operaciones CRUD completas (Create, Read, Update, Delete)

## 🎓 Conceptos Adicionales

### Dependencias vs DevDependencies

- **dependencies**: Necesarias en producción (react, react-dom)
- **devDependencies**: Solo para desarrollo (vite, eslint)

### JSX (JavaScript XML)

- Extensión de JavaScript que permite escribir HTML en JS
- Se transpila a JavaScript estándar
- Combina lógica y marcado de forma declarativa

---

**Autor**: Clase 05 - Aplicaciones Interactivas
**Fecha**: Septiembre 2025
**Objetivo**: Dominar React Hooks y APIs REST con JSON Server
