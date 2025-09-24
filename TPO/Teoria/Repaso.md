# Repaso Completo - Aplicaciones Interactivas TPO

## E-commerce ML Marketplace - Análisis Técnico y Defensa

---

## 📚 TEORÍA VISTA EN CADA CLASE

### **CLASE 03: JavaScript Asíncrono y Control de Versiones**

#### **JavaScript Asíncrono - ¿Por qué es importante?**

**Problema:** JavaScript es de un solo hilo (single-threaded), pero necesitamos hacer operaciones que toman tiempo (llamadas a APIs, leer archivos) sin "congelar" la página.

**Solución:** Código asíncrono que permite que otras operaciones continúen mientras esperamos.

- **Callbacks**: **Funciones que se ejecutan después de que otra operación termina**

  ```javascript
  // Ejemplo básico de callback
  function procesar(datos, callback) {
    // Procesar datos...
    callback(resultado); // Ejecuta cuando termina
  }

  procesar(misDatos, function(resultado) {
    console.log('¡Terminó!', resultado);
  });
  ```

  **Problema:** "Callback Hell" - callbacks anidados difíciles de leer
- **Promises**: **Objetos que representan el resultado futuro de una operación asíncrona**

  ```javascript
  // Estados de una Promise
  const promesa = fetch('/api/productos');
  // pending: esperando resultado
  // fulfilled: operación exitosa
  // rejected: operación falló

  promesa
    .then(response => response.json()) // Si sale bien
    .catch(error => console.error(error)); // Si sale mal
  ```

  **Ventaja:** Evita callback hell, más legible
- **Async/Await**: **Sintaxis que hace que código asíncrono se vea síncrono**

  ```javascript
  // Versión Promise (más compleja)
  fetch('/api/productos')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

  // Versión async/await (más simple)
  async function getProductos() {
    try {
      const response = await fetch('/api/productos');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  ```
- **Fetch API**: **Función moderna para hacer peticiones HTTP** (reemplaza XMLHttpRequest)

  ```javascript
  // GET - Obtener datos
  const productos = await fetch('/api/productos');

  // POST - Enviar datos
  const nuevoProducto = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'iPhone', precio: 1000 })
  });
  ```
- **Diferencia API vs Endpoint**:

  - **API**: **Conjunto completo de funcionalidades** que expone un servicio
    - Ejemplo: "MercadoLibre API" - todo lo que ofrece MercadoLibre
  - **Endpoint**: **URL específica para una acción concreta**
    - Ejemplo: `GET /api/productos` - obtener lista de productos
    - Ejemplo: `POST /api/usuarios` - crear nuevo usuario

#### **Control de Versiones - Git (¿Por qué es esencial?)**

**Problema:** Al desarrollar, necesitamos:

- Guardar historial de cambios
- Trabajar en equipo sin pisarse
- Volver a versiones anteriores si algo sale mal
- Experimentar en "ramas" sin afectar el código principal

**Solución:** Git - sistema de control de versiones distribuido

- **Áreas de Git** (Flujo de trabajo):

  ```
  Working Directory → Staging Area → Repository → Remote Repository
       (editas)       (preparas)      (confirmas)    (compartes)
  ```

  1. **Working Directory**: Archivos que estás editando ahora
  2. **Staging Area**: Cambios preparados para confirmar ("foto previa")
  3. **Repository**: Historial confirmado en tu computadora
  4. **Remote Repository**: Historial compartido (GitHub, GitLab)
- **Comandos básicos con ejemplos**:

  ```bash
  git init              # Crear repositorio nuevo
  git add archivo.js    # Preparar archivo específico
  git add .             # Preparar todos los cambios
  git commit -m "Mensaje descriptivo"  # Confirmar cambios
  git push origin main  # Enviar al repositorio remoto
  git pull origin main  # Descargar cambios remotos
  ```
- **Branches (ramas)** - **Líneas de desarrollo paralelas**:

  ```bash
  git branch feature-login    # Crear rama para nueva funcionalidad
  git checkout feature-login  # Cambiar a esa rama
  git merge feature-login     # Unir rama a main cuando esté lista
  ```

  **¿Por qué usar ramas?**

  - Desarrollar features sin romper código principal
  - Experimentar sin miedo
  - Varios desarrolladores trabajando simultáneamente
- **Flujo de trabajo típico**:

  1. `git checkout -b feature-carrito` (crear rama para carrito)
  2. Desarrollar funcionalidad del carrito
  3. `git add .` y `git commit -m "Implementar carrito de compras"`
  4. `git checkout main` (volver a rama principal)
  5. `git merge feature-carrito` (integrar el carrito)

**Aplicación en el proyecto:**

- Cada nueva funcionalidad se desarrolla en su rama
- Commits descriptivos para entender qué cambió
- Push regular para no perder trabajo

### **CLASE 04: Introducción a React**

#### **¿Por qué React? - Problemas que resuelve**

**Problema tradicional con JavaScript vanilla:**

```javascript
// Manipulación manual del DOM (complejo y propenso a errores)
const lista = document.getElementById('productos');
lista.innerHTML = ''; // Limpiar
productos.forEach(producto => {
  const div = document.createElement('div');
  div.innerHTML = `<h3>${producto.nombre}</h3><p>$${producto.precio}</p>`;
  lista.appendChild(div);
});
```

**Solución con React:**

```jsx
// Declarativo y automático
function ProductList({ productos }) {
  return (
    <div>
      {productos.map(producto => (
        <div key={producto.id}>
          <h3>{producto.nombre}</h3>
          <p>${producto.precio}</p>
        </div>
      ))}
    </div>
  );
}
```

**Ventajas de React:**

- **Componentización**: **UI dividida en piezas reutilizables y mantenibles**

  ```jsx
  // Un componente es como un "molde" reutilizable
  function ProductCard({ producto }) {
    return (
      <div className="card">
        <h3>{producto.nombre}</h3>
        <p>${producto.precio}</p>
        <button>Agregar al carrito</button>
      </div>
    );
  }

  // Reutilizar en cualquier lugar
  <ProductCard producto={producto1} />
  <ProductCard producto={producto2} />
  ```
- **Virtual DOM**: **React mantiene una copia "virtual" del DOM en memoria**

  ```
  Estado cambia → React compara Virtual DOM vs DOM real → Actualiza solo lo necesario
  ```

  **Beneficio:** En lugar de re-renderizar toda la página, solo actualiza lo que cambió
- **Rendimiento optimizado**: **vs manipulación manual del DOM**

  - JavaScript vanilla: tú decides qué y cuándo actualizar (propenso a errores)
  - React: automáticamente optimiza las actualizaciones
- **Manejo del estado**: **React re-renderiza automáticamente cuando los datos cambian**

  ```jsx
  const [contador, setContador] = useState(0);

  // Cuando cambias el estado...
  setContador(contador + 1);

  // React automáticamente actualiza la pantalla con el nuevo valor
  return <p>Contador: {contador}</p>;
  ```

#### **Herramientas del Ecosistema React**

- **Vite**: **Build tool moderno y rápido para desarrollo**

  ```bash
  npm create vite@latest mi-proyecto -- --template react
  ```

  **¿Qué hace?**

  - Servidor de desarrollo ultrarrápido
  - Hot Module Replacement (HMR) - cambios instantáneos
  - Optimización automática para producción

  **Ventaja vs Create React App:** 10-100x más rápido en desarrollo
- **npm**: **Gestor de paquetes de JavaScript**

  ```bash
  npm install react react-dom    # Instalar dependencias
  npm run dev                    # Ejecutar servidor de desarrollo
  npm run build                  # Construir para producción
  ```

  **¿Por qué es importante?** Maneja miles de librerías y sus dependencias automáticamente
- **HMR (Hot Module Replacement)**: **Actualizaciones en tiempo real sin perder estado**

  ```
  Cambias código → Vite detecta → Actualiza solo ese módulo → Pantalla se actualiza instantáneamente
  ```

  **Beneficio:** No necesitas recargar la página ni perder datos del formulario

#### **Conceptos Fundamentales de React**

- **JSX (JavaScript XML)**: **Sintaxis que combina HTML + JavaScript**

  ```jsx
  // Parece HTML pero es JavaScript
  const elemento = <h1>Hola {nombre}!</h1>;

  // Equivale a:
  const elemento = React.createElement('h1', null, `Hola ${nombre}!`);
  ```

  **¿Por qué JSX?**

  - Más legible que `React.createElement`
  - Familiar para quienes conocen HTML
  - IntelliSense y validación automática
- **Componentes**: **Funciones que retornan JSX**

  ```jsx
  // Componente funcional (moderno)
  function Saludo({ nombre }) {
    return <h1>¡Hola, {nombre}!</h1>;
  }

  // Uso del componente
  <Saludo nombre="Juan" />
  ```
- **Props**: **Parámetros que reciben los componentes (como argumentos de función)**

  ```jsx
  function ProductCard({ producto, onAgregarCarrito }) {
    return (
      <div>
        <h3>{producto.nombre}</h3>        {/* Usar prop */}
        <p>${producto.precio}</p>
        <button onClick={() => onAgregarCarrito(producto)}>
          Agregar al carrito
        </button>
      </div>
    );
  }

  // Pasar props
  <ProductCard 
    producto={miProducto} 
    onAgregarCarrito={handleAgregar} 
  />
  ```
- **PascalCase**: **Nomenclatura para componentes React**

  ```jsx
  // ✅ Correcto - PascalCase
  function ProductCard() { }
  function ShoppingCart() { }

  // ❌ Incorrecto - camelCase
  function productCard() { }   // React no lo reconoce como componente
  function shopping_cart() { } // No es convención JavaScript
  ```

#### **Ruta de ejecución - ¿Cómo arranca React?**

```
1. index.html → 2. main.jsx → 3. App.jsx → 4. Componentes
   (HTML base)   (punto entrada)  (componente raíz)  (tu aplicación)
```

**Explicación paso a paso:**

1. **index.html**: Página HTML básica con `<div id="root"></div>`
2. **main.jsx**: JavaScript que monta React en el div#root
3. **App.jsx**: Componente principal que contiene toda tu aplicación
4. **Otros componentes**: Header, ProductCard, etc.

### **CLASE 05: Hooks y Estado**

#### **¿Qué son los Hooks? - Revolución en React**

**Problema anterior (Componentes de Clase):**

```javascript
// Código complejo y verboso
class MiComponente extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contador: 0 };
  }
  
  componentDidMount() {
    // Lógica al montar componente
  }
  
  render() {
    return <button onClick={() => this.setState({contador: this.state.contador + 1})}>
      {this.state.contador}
    </button>;
  }
}
```

**Solución moderna (Hooks):**

```jsx
// Código simple y funcional
function MiComponente() {
  const [contador, setContador] = useState(0);
  
  useEffect(() => {
    // Lógica al montar componente
  }, []);
  
  return <button onClick={() => setContador(contador + 1)}>
    {contador}
  </button>;
}
```

#### **Hooks principales**

- **useState**: **Hook para manejar estado local que cambia con el tiempo**

  ```jsx
  // Sintaxis básica
  const [estado, setEstado] = useState(valorInicial);

  // Ejemplos prácticos
  const [productos, setProductos] = useState([]); // Array vacío inicial
  const [loading, setLoading] = useState(true);   // Boolean inicial
  const [usuario, setUsuario] = useState(null);   // Objeto inicial

  // Actualizar estado
  setProductos([...productos, nuevoProducto]); // Agregar al array
  setLoading(false);                            // Cambiar boolean
  setUsuario({ id: 1, nombre: 'Juan' });       // Cambiar objeto
  ```

  **¿Por qué usar useState?**

  - React re-renderiza automáticamente cuando el estado cambia
  - Mantiene el valor entre re-renders
  - Activar actualizaciones de la interfaz
- **useEffect**: **Hook para efectos secundarios (side effects)**

  ```jsx
  // Ejecutar al montar componente (similar a componentDidMount)
  useEffect(() => {
    console.log('Componente montado');
  }, []); // Array vacío = solo una vez

  // Ejecutar cuando una variable cambia
  useEffect(() => {
    if (usuario) {
      cargarDatosUsuario(usuario.id);
    }
  }, [usuario]); // Se ejecuta cuando 'usuario' cambia

  // Cleanup al desmontar (similar a componentWillUnmount)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Tick');
    }, 1000);

    return () => clearInterval(interval); // Limpiar al desmontar
  }, []);
  ```

  **Casos de uso comunes:**

  - Llamadas a APIs al cargar componente
  - Suscripciones a eventos
  - Timers e intervalos
  - Actualizar título de la página
  - Guardar en localStorage
- **useContext**: **Hook para acceder a contexto global (evita prop drilling)**

  ```jsx
  // Problema: Prop Drilling
  function App() {
    const usuario = { nombre: 'Juan' };
    return <Header usuario={usuario} />;
  }

  function Header({ usuario }) {
    return <Navigation usuario={usuario} />;
  }

  function Navigation({ usuario }) {
    return <UserMenu usuario={usuario} />; // ¡Pasar props por 3 niveles!
  }

  // Solución: Context API
  const UsuarioContext = createContext();

  function App() {
    const usuario = { nombre: 'Juan' };
    return (
      <UsuarioContext.Provider value={usuario}>
        <Header />
      </UsuarioContext.Provider>
    );
  }

  function UserMenu() {
    const usuario = useContext(UsuarioContext); // ¡Acceso directo!
    return <span>Hola, {usuario.nombre}</span>;
  }
  ```

  **¿Cuándo usar Context?**

  - Datos que necesitan muchos componentes (usuario logueado, tema, idioma)
  - Evitar pasar props por muchos niveles
  - Estado global de la aplicación

#### **Programación Declarativa vs Imperativa**

**Imperativa (JavaScript vanilla)**: **Describes CÓMO hacer las cosas paso a paso**

```javascript
// Tienes que decirle al DOM exactamente qué hacer
const lista = document.getElementById('lista');
lista.innerHTML = ''; // Limpiar

for (let i = 0; i < productos.length; i++) {
  const li = document.createElement('li');
  li.textContent = productos[i].nombre;
  li.addEventListener('click', () => seleccionar(productos[i]));
  lista.appendChild(li);
}
```

**Declarativa (React)**: **Describes QUÉ quieres que aparezca**

```jsx
// Le dices a React QUÉ quieres ver, React decide CÓMO hacerlo
function ListaProductos({ productos, onSeleccionar }) {
  return (
    <ul>
      {productos.map(producto => (
        <li key={producto.id} onClick={() => onSeleccionar(producto)}>
          {producto.nombre}
        </li>
      ))}
    </ul>
  );
}
```

**Ventajas de la programación declarativa:**

- Código más legible y predecible
- Menos propenso a errores
- React optimiza automáticamente
- Fácil de testear y debuggear

#### **Virtual DOM - ¿Cómo React optimiza las actualizaciones?**

```
1. Estado cambia (setProductos)
   ↓
2. React crea nuevo Virtual DOM
   ↓
3. React compara (diff) Virtual DOM anterior vs nuevo
   ↓
4. React identifica qué cambió exactamente
   ↓
5. React actualiza solo esos elementos en el DOM real
```

**Ejemplo práctico:**

```jsx
// Estado inicial: [producto1, producto2]
const [productos, setProductos] = useState([producto1, producto2]);

// Agregar producto: [producto1, producto2, producto3]
setProductos([...productos, producto3]);

// React detecta que solo se agregó un elemento
// Solo inserta el nuevo <li> sin tocar los existentes
```

**¿Por qué es importante?**

- Manipular el DOM real es lento (reflow, repaint)
- Virtual DOM es JavaScript puro (muy rápido)
- React minimiza operaciones costosas del DOM

### **CLASE 06: React Router y Renderizado Condicional**

#### **React Router - ¿Por qué necesitamos navegación en SPA?**

**Problema con aplicaciones de una sola página (SPA):**

```javascript
// Sin router, solo una URL para toda la aplicación
http://localhost:3000/  ← Solo esta URL existe

// El usuario no puede:
// - Hacer bookmark de una página específica
// - Usar botones atrás/adelante del navegador
// - Compartir enlaces específicos
```

**Solución con React Router:**

```javascript
// URLs específicas para cada vista
http://localhost:3000/                    ← Home
http://localhost:3000/product/123         ← Producto específico
http://localhost:3000/cart                ← Carrito
http://localhost:3000/login               ← Login
```

#### **Componentes principales de React Router**

- **BrowserRouter**: **Envuelve toda la aplicación para habilitar navegación**

  ```jsx
  import { BrowserRouter as Router } from 'react-router-dom';

  function App() {
    return (
      <Router>  {/* Habilita navegación para toda la app */}
        <Routes>
          {/* Rutas van aquí */}
        </Routes>
      </Router>
    );
  }
  ```
- **Routes y Route**: **Definen qué componente mostrar para cada URL**

  ```jsx
  import { Routes, Route } from 'react-router-dom';

  <Routes>
    <Route path="/" element={<Home />} />                    {/* Ruta exacta */}
    <Route path="/product/:id" element={<ProductDetail />} /> {/* Ruta con parámetro */}
    <Route path="/cart" element={<Cart />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<NotFound />} />                {/* Ruta por defecto */}
  </Routes>
  ```
- **Link**: **Navegación sin recargar la página**

  ```jsx
  import { Link } from 'react-router-dom';

  // ❌ Recarga toda la página
  <a href="/product/123">Ver producto</a>

  // ✅ Navegación SPA (sin recarga)
  <Link to="/product/123">Ver producto</Link>
  ```

#### **Hooks de React Router**

- **useParams**: **Extrae parámetros dinámicos de la URL**

  ```jsx
  // URL: /product/123
  // Ruta definida: /product/:id

  function ProductDetail() {
    const { id } = useParams(); // id = "123"

    useEffect(() => {
      // Usar el ID para cargar datos del producto
      fetch(`/api/products/${id}`)
        .then(response => response.json())
        .then(product => setProduct(product));
    }, [id]);

    return <div>Producto ID: {id}</div>;
  }
  ```

  **Casos de uso:**

  - Mostrar detalles de un producto específico
  - Perfil de usuario: `/user/:userId`
  - Categoría de productos: `/category/:categoryName`
- **useNavigate**: **Navegación programática (desde JavaScript)**

  ```jsx
  import { useNavigate } from 'react-router-dom';

  function LoginForm() {
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
      try {
        await login(credentials);
        // Redirigir automáticamente después del login exitoso
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed');
      }
    };

    return (
      <form onSubmit={handleLogin}>
        {/* Formulario */}
        <button type="submit">Login</button>
      </form>
    );
  }
  ```

  **Casos de uso:**

  - Redirigir después de login/logout
  - Redirigir después de completar una compra
  - Navegación condicional basada en permisos

#### **Rutas Protegidas - Control de Acceso**

```jsx
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  if (!user) {
    // Redirigir al login pero recordar dónde quería ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children; // Usuario logueado, mostrar contenido
}

// Uso
<Route path="/cart" element={
  <ProtectedRoute>
    <Cart />
  </ProtectedRoute>
} />
```

#### **Renderizado Condicional - Mostrar/Ocultar contenido dinámicamente**

- **Operadores lógicos**: **&& para renderizado condicional simple**

  ```jsx
  function Header({ user, cartItems }) {
    return (
      <header>
        <h1>Mi Tienda</h1>

        {/* Mostrar solo si hay usuario logueado */}
        {user && <span>Bienvenido, {user.name}</span>}

        {/* Mostrar contador solo si hay items */}
        {cartItems.length > 0 && (
          <span>Carrito ({cartItems.length})</span>
        )}

        {/* Mostrar mensaje solo si carrito está vacío */}
        {cartItems.length === 0 && (
          <span>Carrito vacío</span>
        )}
      </header>
    );
  }
  ```
- **Operador ternario**: **condition ? siVerdadero : siFalso**

  ```jsx
  function ProductCard({ product }) {
    return (
      <div>
        <h3>{product.name}</h3>

        {/* Mostrar precio u "Oferta" */}
        <p>{product.onSale ? 'OFERTA!' : `$${product.price}`}</p>

        {/* Botón diferente según stock */}
        {product.stock > 0 ? (
          <button>Agregar al carrito</button>
        ) : (
          <button disabled>Sin stock</button>
        )}

        {/* Indicador de stock */}
        <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
          {product.stock > 0 ? 'Disponible' : 'Agotado'}
        </span>
      </div>
    );
  }
  ```
- **Renderizado de listas**: **.map() para mostrar arrays dinámicamente**

  ```jsx
  function ProductList({ products, onAddToCart }) {
    return (
      <div>
        {/* Mostrar mensaje si no hay productos */}
        {products.length === 0 && (
          <p>No hay productos disponibles</p>
        )}

        {/* Renderizar lista de productos */}
        {products.map(product => (
          <ProductCard 
            key={product.id}           // ⚠️ Key es obligatorio para listas
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  }
  ```

  **¿Por qué la prop `key` es importante?**

  ```jsx
  // ❌ Sin key - React no sabe qué elementos cambiaron
  {products.map(product => <ProductCard product={product} />)}

  // ✅ Con key - React puede optimizar actualizaciones
  {products.map(product => <ProductCard key={product.id} product={product} />)}
  ```

#### **Formularios en React - Componentes Controlados**

**Problema con formularios HTML tradicionales:**

```html
<!-- El DOM controla el valor, no JavaScript -->
<input type="text" />
```

**Solución con componentes controlados:**

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Actualizar solo el campo que cambió
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar recarga de página
  
    // Validar datos
    if (!formData.name || !formData.email) {
      alert('Campos requeridos');
      return;
    }
  
    // Enviar datos
    submitForm(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}        // React controla el valor
        onChange={handleChange}      // React maneja cambios
        placeholder="Nombre"
      />
  
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
  
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Mensaje"
      />
  
      <button type="submit">Enviar</button>
    </form>
  );
}
```

#### **Validación de Formularios**

- **Validación en cliente (JavaScript)**:

  ```jsx
  const validateForm = (data) => {
    const errors = {};

    if (!data.email) {
      errors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email no es válido';
    }

    if (!data.password) {
      errors.password = 'Password es requerido';
    } else if (data.password.length < 6) {
      errors.password = 'Password debe tener al menos 6 caracteres';
    }

    return errors;
  };
  ```
- **Validación en servidor**: **Siempre validar también en el backend**

  - Cliente se puede manipular
  - Servidor es la fuente de verdad
  - Doble capa de seguridad

#### **React Hook Form - Librería recomendada**

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data); // { email: 'user@example.com', password: '123456' }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('email', { 
          required: 'Email es requerido',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Email no es válido'
          }
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
  
      <input 
        type="password"
        {...register('password', { 
          required: 'Password es requerido',
          minLength: {
            value: 6,
            message: 'Mínimo 6 caracteres'
          }
        })}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}
  
      <button type="submit">Login</button>
    </form>
  );
}
```

**Ventajas de React Hook Form:**

- Menos código repetitivo
- Mejor rendimiento (menos re-renders)
- Validación integrada
- Fácil integración con librerías de UI

---

## 💻 ANÁLISIS DETALLADO DEL PROYECTO

### **ESTRUCTURA DEL PROYECTO**

```
ecommerce-ml/
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
├── tailwind.config.js    # Configuración de Tailwind CSS
├── db.json              # Base de datos simulada (json-server)
├── src/
│   ├── main.jsx         # Punto de entrada
│   ├── App.jsx          # Componente principal
│   ├── components/      # Componentes reutilizables
│   ├── context/         # Contextos globales
│   ├── pages/           # Páginas/vistas
│   ├── services/        # Lógica de API
│   └── assets/          # Recursos estáticos
```

### **DEPENDENCIAS PRINCIPALES (package.json)**

#### **Dependencias de Producción**

- **react**: ^19.1.1 - Librería principal
- **react-dom**: ^19.1.1 - Renderizado en DOM
- **react-router-dom**: ^7.8.2 - Enrutamiento SPA
- **json-server**: ^1.0.0-beta.3 - API simulada
- **lucide-react**: ^0.542.0 - Iconos

#### **Dependencias de Desarrollo**

- **vite**: ^7.1.2 - Build tool
- **@vitejs/plugin-react**: ^5.0.0 - Plugin React para Vite
- **tailwindcss**: ^3.4.17 - Framework CSS
- **eslint**: ^9.33.0 - Linting

#### **Scripts**

- `dev`: Inicia servidor de desarrollo
- `build`: Construye para producción
- `server`: Inicia json-server en puerto 3002

---

## 📁 ANÁLISIS ARCHIVO POR ARCHIVO

### **src/main.jsx** - Punto de Entrada

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Funciones utilizadas:**

- **`StrictMode`**: Modo estricto de React para detectar problemas
- **`createRoot`**: API moderna de React 18 para renderizado
- **`document.getElementById`**: DOM API nativa para obtener elemento

**Relación con teoría:** Punto de entrada definido en Clase 04 (ruta de ejecución)

### **src/App.jsx** - Componente Principal y Router

**Funciones clave utilizadas:**

- **`BrowserRouter as Router`**: Envuelve la app para enrutamiento
- **`Routes`**: Contenedor de rutas
- **`Route`**: Define una ruta específica
- **Providers**: `AuthProvider`, `CartProvider` para contexto global

**Estructura de rutas implementadas:**

```jsx
// Rutas de autenticación (sin header)
<Route path="/login" element={<Login />} />
<Route path="/registro" element={<Register />} />

// Rutas principales (con header)
<Route path="/" element={<Home />} />
<Route path="/producto/:id" element={<ProductDetail />} />
<Route path="/carrito" element={<Cart />} />
<Route path="/gestion-productos" element={<ProductManagement />} />
```

**Relación con teoría:** Implementa React Router de Clase 06

### **src/context/AuthContext.jsx** - Gestión de Autenticación

**Hooks utilizados:**

- **`createContext()`**: Crea contexto de React
- **`useContext()`**: Hook para consumir contexto
- **`useState()`**: Estado para usuario, loading, inicializado
- **`useEffect()`**: Verifica sesión guardada al cargar

**Funciones del contexto:**

```jsx
const login = async (email, password) => {
  // Fetch a API para validar credenciales
  const response = await fetch('http://localhost:3002/usuarios');
  // Buscar usuario en array con find()
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  // Guardar en localStorage y estado
  localStorage.setItem('ml-user', JSON.stringify(userData));
}
```

**APIs nativas utilizadas:**

- **`fetch()`**: Llamadas HTTP asíncronas
- **`localStorage.getItem/setItem`**: Persistencia en navegador
- **`JSON.parse/stringify`**: Serialización de datos

**Relación con teoría:** useContext de Clase 05, fetch asíncrono de Clase 03

### **src/context/CartContext.jsx** - Gestión del Carrito

**Lógica principal:**

```jsx
// Inicialización desde localStorage
useEffect(() => {
  if (user) {
    const savedCart = localStorage.getItem(`ml-cart-${user.id}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }
}, [user]);

// Guardar cambios automáticamente
useEffect(() => {
  if (user) {
    localStorage.setItem(`ml-cart-${user.id}`, JSON.stringify(cartItems));
  }
}, [cartItems, user]);
```

**Funciones del carrito:**

- **`addToCart()`**: Agrega productos o incrementa cantidad
- **`removeFromCart()`**: Elimina producto por ID
- **`updateQuantity()`**: Actualiza cantidad específica
- **`getTotalPrice()`**: Calcula total con `reduce()`

**Métodos de Array utilizados:**

- **`.find()`**: Buscar item existente
- **`.filter()`**: Filtrar productos
- **`.map()`**: Transformar array
- **`.reduce()`**: Calcular totales

**Relación con teoría:** useState y useEffect de Clase 05, localStorage para persistencia

### **src/services/api.js** - Capa de API

**Función helper principal:**

```jsx
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

**Servicios implementados:**

- **`productService`**: CRUD completo de productos
- **`categoryService`**: Obtener categorías
- **`userService`**: Gestión de usuarios
- **`orderService`**: Manejo de órdenes

**Funciones nativas utilizadas:**

- **`fetch()`**: API moderna para HTTP
- **`async/await`**: Sintaxis asíncrona
- **`try/catch`**: Manejo de errores
- **`URLSearchParams`**: Construcción de query strings
- **`JSON.stringify()`**: Serialización para POST/PUT

**Relación con teoría:** fetch y async/await de Clase 03, conceptos de API REST

### **src/components/Header.jsx** - Barra de Navegación

**Hooks utilizados:**

- **`useState()`**: Para términos de búsqueda, menús desplegables
- **`useContext()`**: Accede a AuthContext y CartContext
- **`useNavigate()`**: Navegación programática

**Funciones principales:**

```jsx
const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
    navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
  }
};

const handleLogout = () => {
  logout();
  setIsUserMenuOpen(false);
  navigate('/');
};
```

**APIs del navegador:**

- **`encodeURIComponent()`**: Codifica parámetros de URL
- **Event handling**: `e.preventDefault()`, `e.target`

**Relación con teoría:** useNavigate de Clase 06, eventos de Clase 03

### **src/components/ProductCard.jsx** - Tarjeta de Producto

**Lógica de negocio:**

```jsx
const handleAddToCart = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!user) {
    navigate('/login');  // Redirige si no está logueado
    return;
  }
  
  setIsLoading(true);
  try {
    await addToCart(product);
  } finally {
    setIsLoading(false);
  }
};
```

**Funciones de formateo:**

```jsx
const discount = calculateDiscount(product.precioOriginal, product.precio);
const hasDiscount = discount > 0;
```

**Renderizado condicional:**

```jsx
{hasDiscount && (
  <div className="absolute top-2 left-2 bg-red-500 text-white">
    {discount}% OFF
  </div>
)}

{product.stock > 0 ? (
  <span className="text-ml-green">Disponible</span>
) : (
  <span className="text-red-500">Sin stock</span>
)}
```

**Relación con teoría:** Renderizado condicional de Clase 06, componentes reutilizables de Clase 04

### **src/pages/Home.jsx** - Página Principal

**Gestión de estado:**

```jsx
const [featuredProducts, setFeaturedProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Carga de datos:**

```jsx
useEffect(() => {
  const loadHomeData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAll({ limit: 12 }),
        categoryService.getActive()
      ]);
  
      // Ordenamiento alfabético (requisito TPO)
      const sortedProducts = productsResponse.sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
      );
  
      setFeaturedProducts(sortedProducts);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };
}, []);
```

**Funciones utilizadas:**

- **`Promise.all()`**: Carga paralela de datos
- **`.sort()`**: Ordenamiento de arrays
- **`.localeCompare()`**: Comparación de strings localizada
- **`.slice()`**: Limitar cantidad de elementos
- **`.filter()`**: Filtrar productos con descuento

**Renderizado de listas:**

```jsx
{featuredProducts.slice(0, 8).map((product) => (
  <ProductCard key={product.id} product={product} />
))}
```

**Relación con teoría:** useEffect para APIs de Clase 05, renderizado de listas de Clase 06

### **src/pages/ProductDetail.jsx** - Detalle de Producto

**Hooks utilizados:**

```jsx
const { id } = useParams();  // Parámetro de URL
const navigate = useNavigate();  // Navegación programática
const { addToCart } = useContext(CartContext);
const { user } = useContext(AuthContext);
```

**Estados múltiples:**

```jsx
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedImage, setSelectedImage] = useState(0);
const [quantity, setQuantity] = useState(1);
const [addingToCart, setAddingToCart] = useState(false);
```

**Funciones principales:**

```jsx
const handleAddToCart = async () => {
  try {
    setAddingToCart(true);
    await addToCart(product, quantity);
    alert(`¡${product.nombre} agregado al carrito!`);
  } catch (err) {
    alert('Error al agregar al carrito');
  } finally {
    setAddingToCart(false);
  }
};

const handleBuyNow = async () => {
  await handleAddToCart();
  navigate('/cart');  // Navegación después de agregar
};
```

**Validaciones:**

```jsx
const handleQuantityChange = (newQuantity) => {
  if (newQuantity >= 1 && newQuantity <= product.stock) {
    setQuantity(newQuantity);
  }
};
```

**Relación con teoría:** useParams y useNavigate de Clase 06, múltiples useState de Clase 05

### **src/pages/Cart.jsx** - Carrito de Compras

**Funciones de validación:**

```jsx
const validateStock = async () => {
  try {
    for (const item of cartItems) {
      const product = await productService.getById(item.id);
      if (product.stock < item.quantity) {
        throw new Error(`No hay suficiente stock de "${item.nombre}"`);
      }
    }
    return true;
  } catch (error) {
    setCheckoutError(error.message);
    return false;
  }
};
```

**Proceso de checkout:**

```jsx
const handleCheckout = async () => {
  // 1. Validar stock
  const stockValid = await validateStock();
  if (!stockValid) return;
  
  // 2. Crear orden
  const order = { /* orden completa */ };
  
  // 3. Descontar stock
  for (const item of cartItems) {
    await updateProductStock(item.id, item.quantity);
  }
  
  // 4. Limpiar carrito
  clearCart();
  
  // 5. Redirigir
  navigate('/', { replace: true });
};
```

**Cálculos de precio:**

```jsx
const subtotal = getCartTotal();
const shipping = subtotal > 50000 ? 0 : 5000;
const total = subtotal + shipping;
```

**Relación con teoría:** Operaciones asíncronas de Clase 03, lógica de negocio compleja

### **src/pages/Login.jsx** - Formulario de Login

**Gestión de formulario:**

```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

**Validación:**

```jsx
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.email) {
    newErrors.email = 'El email es requerido';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'El email no es válido';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Submit del formulario:**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    await login(formData.email, formData.password);
    navigate(from, { replace: true });  // Redirige a página protegida
  } catch (err) {
    console.error('Error en login:', err);
  }
};
```

**Relación con teoría:** Formularios controlados de Clase 06, regex para validación

### **db.json** - Base de Datos Simulada

**Estructura de datos:**

```json
{
  "usuarios": [/* usuarios con hash de password */],
  "categorias": [/* categorías activas */],
  "productos": [/* productos con stock y precios */],
  "ordenes": [/* historial de compras */]
}
```

**Relación con teoría:** json-server de Clase 05, simulación de API REST

---

## 🔗 RELACIÓN TEORÍA-PRÁCTICA POR CLASE

## 🔗 RELACIÓN TEORÍA-PRÁCTICA POR CLASE

### **CLASE 03 → PROYECTO: JavaScript Asíncrono en Acción**

#### **Promesas y Fetch API: Comunicación con el Backend**

**Teoría aplicada:**

- **¿Dónde se implementa?** → `src/api.js` - Módulo centralizado para todas las llamadas API

  ```javascript
  // Implementación práctica de promesas
  export const fetchProducts = () => {
    return fetch(`${API_BASE_URL}/products`)  // Retorna una promesa
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }
        return response.json();  // Otra promesa
      });
  };
  ```
- **Async/Await en componentes** → `src/components/Home.jsx`

  ```javascript
  // Versión moderna de manejo asíncrono
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();  // Espera el resultado
        setProducts(products);
      } catch (error) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  ```

**¿Por qué es crucial?**

- **Sin async/await**: El código se ejecutaría antes de tener los datos
- **Con manejo de errores**: La app no se rompe si el servidor falla
- **Estados de carga**: Mejor experiencia de usuario con feedback visual

#### **JSON-Server: Simulación de Backend Real**

```javascript
// db.json estructura que simula una base de datos
{
  "products": [
    { "id": 1, "name": "Laptop", "price": 999.99 },
    { "id": 2, "name": "Mouse", "price": 29.99 }
  ],
  "users": [
    { "id": 1, "username": "admin", "password": "123456" }
  ]
}

// Endpoints automáticos que se crean:
// GET /products → Lista todos los productos
// GET /products/1 → Obtiene producto con ID 1
// POST /products → Crea nuevo producto
// PUT /products/1 → Actualiza producto 1
// DELETE /products/1 → Elimina producto 1
```

---

### **CLASE 04 → PROYECTO: Arquitectura de Componentes React**

#### **Componentización: División de Responsabilidades**

**Teoría aplicada:**

- **Componente Presentacional** → `ProductCard.jsx`

  ```jsx
  // Solo se encarga de mostrar datos, no maneja lógica
  function ProductCard({ product, onAddToCart }) {
    return (
      <div className="border rounded-lg p-4">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <button onClick={() => onAddToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    );
  }
  ```
- **Componente Contenedor** → `Home.jsx`

  ```jsx
  // Maneja datos y lógica, pasa props a componentes presentacionales
  function Home() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (product) => {
      addToCart(product);
      // Lógica adicional: mostrar notificación, etc.
    };

    return (
      <div>
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}  // Pasa la función
          />
        ))}
      </div>
    );
  }
  ```

#### **Props: Comunicación Unidireccional**

**Flujo de datos en el proyecto:**

```
App.jsx
  ↓ props
Header.jsx (recibe user, cartItems)
  ↓ props
Home.jsx (recibe productos del estado)
  ↓ props
ProductCard.jsx (recibe product, onAddToCart)
```

**¿Por qué unidireccional?**

- **Predecibilidad**: Los datos fluyen en una sola dirección
- **Debugging**: Fácil rastrear de dónde vienen los datos
- **Reutilización**: Componentes pueden usarse en diferentes contextos

---

### **CLASE 05 → PROYECTO: Hooks para Estado y Efectos**

#### **useState: Estado Local vs Global**

**Estados locales en componentes:**

```jsx
// ProductDetail.jsx - Estado específico del componente
function ProductDetail() {
  const [product, setProduct] = useState(null);  // Solo para este componente
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Este estado no necesita compartirse con otros componentes
}
```

**Estados globales con Context:**

```jsx
// CartContext.jsx - Estado compartido entre múltiples componentes
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);  // Global
  
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };
  
  // Este estado se puede usar en Header, Cart, ProductCard, etc.
}
```

#### **useEffect: Ciclo de Vida y Side Effects**

**Carga inicial de datos:**

```jsx
// Home.jsx - Cargar productos al montar el componente
useEffect(() => {
  const loadProducts = async () => {
    const products = await fetchProducts();
    setProducts(products);
  };
  
  loadProducts();
}, []); // Array vacío = solo se ejecuta una vez
```

**Sincronización con parámetros:**

```jsx
// ProductDetail.jsx - Recargar cuando cambia el ID
useEffect(() => {
  const loadProduct = async () => {
    const product = await fetchProductById(id);
    setProduct(product);
  };
  
  loadProduct();
}, [id]); // Se ejecuta cada vez que 'id' cambia
```

---

### **CLASE 06 → PROYECTO: Navegación y Renderizado Dinámico**

#### **React Router: SPA con URLs Significativas**

**Estructura de rutas en el proyecto:**

```jsx
// App.jsx - Definición de todas las rutas
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/login" element={<Login />} />
</Routes>
```

**useParams en acción:**

```jsx
// ProductDetail.jsx - Extraer ID de la URL
function ProductDetail() {
  const { id } = useParams();  // Si URL es /product/123, id = "123"
  
  useEffect(() => {
    const loadProduct = async () => {
      const product = await fetchProductById(id);  // Usar ID de la URL
      setProduct(product);
    };
  
    loadProduct();
  }, [id]);
}
```

#### **Renderizado Condicional: UI Dinámica**

**Mostrar/ocultar según autenticación:**

```jsx
// Header.jsx
function Header() {
  const { user } = useContext(AuthContext);
  
  return (
    <header>
      <Link to="/">Mi Tienda</Link>
  
      {/* Renderizado condicional según usuario */}
      {user ? (
        <>
          <span>Bienvenido, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}
```

**Estados de carga y error:**

```jsx
// Home.jsx
function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No hay productos</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---


## 🚀 FUNCIONES NATIVAS Y APIS UTILIZADAS

### **JavaScript Nativo - APIs del Navegador**

#### **🌐 Comunicación con APIs**

- **`fetch()`**: **API moderna para hacer peticiones HTTP** (reemplaza XMLHttpRequest)

  ```jsx
  // Ejemplo: Obtener productos desde el servidor
  const response = await fetch('http://localhost:3002/productos');
  const productos = await response.json(); // Convierte respuesta a JSON
  ```

  **¿Qué hace?** Permite comunicarse con servidores, enviar y recibir datos
- **`async/await`**: **Sintaxis para manejar código asíncrono** (que no bloquea la ejecución)

  ```jsx
  // SIN async/await (usando Promises - más complejo)
  fetch('/api/productos').then(response => response.json()).then(data => console.log(data));

  // CON async/await (más legible)
  const productos = await fetch('/api/productos');
  const data = await productos.json();
  console.log(data);
  ```

  **Diferencia con fetch:** `fetch` es la función que hace la petición, `async/await` es la forma de escribir el código para esperarla
- **`try/catch`**: **Manejo de errores en código asíncrono**

  ```jsx
  try {
    const data = await fetch('/api/productos');
    // Si todo sale bien, ejecuta esto
  } catch (error) {
    // Si hay error (internet cortado, servidor caído), ejecuta esto
    console.error('Error:', error);
  }
  ```

#### **💾 Almacenamiento y Datos**

- **`JSON.parse/stringify()`**: **Conversión entre objetos JavaScript y texto JSON**

  ```jsx
  // stringify: Convierte objeto a texto para guardar
  const usuario = { nombre: 'Juan', edad: 25 };
  localStorage.setItem('user', JSON.stringify(usuario)); // Guarda como texto

  // parse: Convierte texto de vuelta a objeto
  const usuarioGuardado = JSON.parse(localStorage.getItem('user')); // Recupera como objeto
  ```
- **`localStorage`**: **Memoria del navegador que persiste datos** (no se pierde al cerrar pestaña)

  ```jsx
  // Guardar datos
  localStorage.setItem('carrito', JSON.stringify(products));

  // Recuperar datos
  const carrito = JSON.parse(localStorage.getItem('carrito'));

  // Eliminar datos
  localStorage.removeItem('carrito');
  ```

  **¿Por qué es útil?** Mantiene la sesión del usuario y el carrito aunque recargue la página

#### **🔗 Manipulación de URLs**

- **`URLSearchParams`**: **Construir parámetros de consulta en URLs**

  ```jsx
  // Crear URL con filtros: /productos?categoria=electronicos&precio=max
  const params = new URLSearchParams();
  params.append('categoria', 'electronicos');
  params.append('precio', 'max');
  const url = `/productos?${params.toString()}`;
  ```
- **`encodeURIComponent()`**: **Codificar texto para usar en URLs** (espacios, caracteres especiales)

  ```jsx
  const busqueda = 'iphone 15 pro max';
  const urlSegura = `/buscar?q=${encodeURIComponent(busqueda)}`;
  // Resultado: /buscar?q=iphone%2015%20pro%20max
  ```

#### **📊 Métodos de Arrays (Programación Funcional)**

- **`Array.map()`**: **Transformar cada elemento** del array en algo nuevo

  ```jsx
  const productos = [{nombre: 'iPhone', precio: 1000}, {nombre: 'Samsung', precio: 800}];
  const nombres = productos.map(producto => producto.nombre);
  // Resultado: ['iPhone', 'Samsung']
  ```
- **`Array.filter()`**: **Filtrar elementos** que cumplan una condición

  ```jsx
  const productosCaros = productos.filter(producto => producto.precio > 900);
  // Resultado: [{nombre: 'iPhone', precio: 1000}]
  ```
- **`Array.find()`**: **Encontrar el primer elemento** que cumple una condición

  ```jsx
  const iphone = productos.find(producto => producto.nombre === 'iPhone');
  // Resultado: {nombre: 'iPhone', precio: 1000}
  ```
- **`Array.reduce()`**: **Reducir array a un solo valor** (sumar, concatenar, etc.)

  ```jsx
  const total = productos.reduce((suma, producto) => suma + producto.precio, 0);
  // Resultado: 1800 (suma todos los precios)
  ```

#### **🔤 Manipulación de Strings**

- **`String.localeCompare()`**: **Comparar strings respetando idioma y acentos**
  ```jsx
  const productos = ['Ñandú', 'Árbol', 'Casa'];
  productos.sort((a, b) => a.localeCompare(b));
  // Resultado ordenado correctamente: ['Árbol', 'Casa', 'Ñandú']
  ```

#### **🧮 Operaciones Matemáticas**

- **`Math.round()`**: **Redondear números decimales**

  ```jsx
  const precio = 1234.56789;
  const precioRedondeado = Math.round(precio * 100) / 100; // 1234.57
  ```
- **`Math.max()`**: **Encontrar el valor máximo**

  ```jsx
  const stockMaximo = Math.max(10, 5, 20, 3); // Resultado: 20
  ```

#### **📅 Fechas**

- **`Date()`**: **Trabajar con fechas y horarios**
  ```jsx
  const ahora = new Date(); // Fecha actual
  const fechaOrden = new Date().toISOString(); // Para guardar en base de datos
  ```

#### **🔍 Validaciones**

- **`RegExp.test()`**: **Validar formato de texto** con expresiones regulares

  ```jsx
  const emailRegex = /\S+@\S+\.\S+/;
  const esEmailValido = emailRegex.test('usuario@gmail.com'); // true
  ```
- **`Object.keys()`**: **Obtener las propiedades de un objeto**

  ```jsx
  const errores = {email: 'Inválido', password: 'Muy corto'};
  const hayErrores = Object.keys(errores).length > 0; // true
  ```

### **React Hooks - Gestión de Estado y Efectos**

- **`useState()`**: **Crear variables que pueden cambiar y re-renderizar el componente**

  ```jsx
  const [productos, setProductos] = useState([]); // Estado inicial: array vacío
  setProductos([...productos, nuevoProducto]); // Actualizar estado
  ```

  **¿Por qué es especial?** Cuando cambias el estado, React actualiza automáticamente la pantalla
- **`useEffect()`**: **Ejecutar código cuando algo cambia** (cargar datos, suscribirse a eventos)

  ```jsx
  useEffect(() => {
    // Se ejecuta cuando el componente se monta
    cargarProductos();
  }, []); // Array vacío = solo una vez

  useEffect(() => {
    // Se ejecuta cada vez que 'usuario' cambia
    guardarCarrito();
  }, [usuario]); // Se ejecuta cuando 'usuario' cambia
  ```
- **`useContext()`**: **Acceder a datos globales** sin pasar props por muchos niveles

  ```jsx
  const { usuario, carrito } = useContext(AuthContext);
  // Ahora puedes usar 'usuario' y 'carrito' en cualquier componente
  ```
- **`createContext()`**: **Crear almacén de datos global**

  ```jsx
  const AuthContext = createContext(); // Crear contexto
  // Permite compartir datos entre todos los componentes hijos
  ```

### **React Router - Navegación SPA**

- **`useParams()`**: **Obtener valores dinámicos de la URL**

  ```jsx
  // URL: /producto/123
  const { id } = useParams(); // id = "123"
  // Útil para mostrar detalles de un producto específico
  ```
- **`useNavigate()`**: **Cambiar de página programáticamente** (sin que el usuario haga clic)

  ```jsx
  const navigate = useNavigate();

  const handleLogin = () => {
    // Después de login exitoso, ir al home
    navigate('/');
  };
  ```
- **`useLocation()`**: **Obtener información de la página actual**

  ```jsx
  const location = useLocation();
  console.log(location.pathname); // "/carrito"
  // Útil para saber en qué página está el usuario
  ```

### **Event Handling - Manejo de Eventos**

- **`e.preventDefault()`**: **Evitar comportamiento predeterminado** del navegador

  ```jsx
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    // Tu código personalizado aquí
  };
  ```
- **`e.stopPropagation()`**: **Evitar que el evento se propague** a elementos padre

  ```jsx
  const handleButtonClick = (e) => {
    e.stopPropagation(); // El clic no afecta al contenedor padre
    // Solo afecta a este botón
  };
  ```
- **`e.target`**: **Obtener el elemento que disparó el evento**

  ```jsx
  const handleInputChange = (e) => {
    const valor = e.target.value; // Obtiene lo que escribió el usuario
    const nombre = e.target.name; // Obtiene el nombre del input
  };
  ```

### **DOM APIs - Interacción con la Página Web**

- **`document.getElementById()`**: **Buscar un elemento específico** en la página

  ```jsx
  const elemento = document.getElementById('root');
  // Encuentra el div con id="root" donde React renderiza la app
  ```
- **`window.confirm()`**: **Mostrar ventana de confirmación** al usuario

  ```jsx
  const confirmar = window.confirm('¿Estás seguro de eliminar este producto?');
  if (confirmar) {
    eliminarProducto();
  }
  ```
- **`window.location.reload()`**: **Recargar la página completa**

  ```jsx
  window.location.reload(); // Recarga toda la página (pierde estado de React)
  ```

---

## 💡 PUNTOS FUERTES DEL PROYECTO

1. **Arquitectura Escalable**: Separación clara de responsabilidades
2. **Estado Global Eficiente**: Context API sin prop drilling
3. **Experiencia de Usuario**: SPA fluida, estados de carga
4. **Persistencia Inteligente**: localStorage por usuario
5. **Validaciones Robustas**: Cliente y simulación servidor
6. **Código Limpio**: Funciones puras, componentes reutilizables
7. **Manejo de Errores**: try/catch centralizado
8. **Responsive Design**: Tailwind CSS para múltiples dispositivos

---

## 🎯 RESUMEN EJECUTIVO

Este proyecto demuestra un dominio completo de React moderno y las mejores prácticas de desarrollo frontend. Integra exitosamente todos los conceptos del curso en una aplicación funcional y escalable que simula un e-commerce real con todas sus complejidades: gestión de usuarios, inventario, carrito persistente y checkout.

**Tecnologías:** React 19, Vite, React Router, Context API, Tailwind CSS, json-server
**Patrones:** Hooks, SPA, Context, Async/Await, REST API
**Funcionalidades:** Auth, Cart, CRUD, Routing, Validation, Persistence
