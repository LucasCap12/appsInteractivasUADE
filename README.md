# Actividad Clase 03 - API y Git

**Proyecto completado - Versión simplificada**

## Descripción
Este proyecto es parte de la actividad práctica de la Clase 03, donde implementamos:

1. **Llamada a API**: Consumo de la API de JSONPlaceholder para obtener datos de usuarios
2. **Manipulación del DOM**: Mostrar los datos en una tabla HTML
3. **Asincronía**: Uso de fetch con async/await y Promises
4. **Control de versiones**: Uso de Git para gestionar el proyecto

## Archivos del Proyecto

- `index.html`: Estructura HTML con tabla para mostrar usuarios
- `styles.css`: Estilos CSS para la interfaz
- `script.js`: Lógica JavaScript con llamadas a API
- `README.md`: Documentación del proyecto

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES6+**: 
  - Fetch API
  - Async/Await
  - Promises
  - Event Listeners (addEventListener)
- **Git**: Control de versiones

## API Utilizada

**JSONPlaceholder**: https://jsonplaceholder.typicode.com/users

Esta API devuelve un array de 10 usuarios con la siguiente estructura:
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "address": {
    "city": "Gwenborough"
  },
  "company": {
    "name": "Romaguera-Crona"
  }
}
```

## Cómo usar

1. Abrir `index.html` en un navegador web
2. Hacer clic en el botón "Cargar Usuarios"
3. Los datos se cargarán de forma asíncrona y se mostrarán en la tabla

## Conceptos de Asincronía Implementados

- **Fetch API**: Para realizar peticiones HTTP
- **Async/Await**: Sintaxis moderna para manejar promesas
- **Promises**: Manejo de operaciones asíncronas
- **Error Handling**: Manejo de errores con try/catch
- **Event Listeners**: Separación de intereses en el manejo de eventos

## Git - Control de Versiones

Este proyecto utiliza Git para el control de versiones siguiendo las buenas prácticas vistas en clase:

- Commits atómicos con mensajes descriptivos
- Uso de .gitignore para excluir archivos innecesarios
- Repositorio local y remoto en GitHub
