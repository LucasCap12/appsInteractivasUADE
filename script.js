// JavaScript para la actividad de API - Clase 03
// Ejemplo usando async/await como se vio en clase

// Función asíncrona para obtener usuarios de la API
async function obtenerUsuarios() {
    try {
        // Mostrar indicador de carga
        document.getElementById('loading').style.display = 'block';
        document.getElementById('tablaUsuarios').style.display = 'none';
        
        // Llamada a la API usando fetch con async/await
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        // Convertir la respuesta a JSON
        const usuarios = await respuesta.json();
        
        // Mostrar los usuarios en la tabla
        mostrarUsuariosEnTabla(usuarios);
        
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alert('Error al cargar los usuarios. Por favor, intenta nuevamente.');
    } finally {
        // Ocultar indicador de carga
        document.getElementById('loading').style.display = 'none';
    }
}

// Función para mostrar usuarios en la tabla HTML
function mostrarUsuariosEnTabla(usuarios) {
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const tabla = document.getElementById('tablaUsuarios');
    
    // Limpiar contenido anterior
    cuerpoTabla.innerHTML = '';
    
    // Iterar sobre cada usuario y crear una fila
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.name}</td>
            <td>${usuario.username}</td>
            <td>${usuario.email}</td>
            <td>${usuario.phone}</td>
            <td>${usuario.website}</td>
            <td>${usuario.address.city}</td>
            <td>${usuario.company.name}</td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
    
    // Mostrar la tabla
    tabla.style.display = 'table';
}

// Ejemplo alternativo usando Promises con .then() (también visto en clase)
function obtenerUsuariosConPromises() {
    // Mostrar indicador de carga
    document.getElementById('loading').style.display = 'block';
    document.getElementById('tablaUsuarios').style.display = 'none';
    
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then(usuarios => {
            mostrarUsuariosEnTabla(usuarios);
        })
        .catch(error => {
            console.error('Error al obtener usuarios:', error);
            alert('Error al cargar los usuarios. Por favor, intenta nuevamente.');
        })
        .finally(() => {
            document.getElementById('loading').style.display = 'none';
        });
}

// Event Listener usando addEventListener (mejor práctica según clase)
document.addEventListener('DOMContentLoaded', function() {
    const botonCargar = document.getElementById('cargarUsuarios');
    
    // Agregar evento click al botón usando addEventListener
    botonCargar.addEventListener('click', obtenerUsuarios);
    
    // Ejemplo de cómo agregar múltiples event listeners al mismo elemento
    botonCargar.addEventListener('click', function() {
        console.log('Botón clickeado - cargando usuarios...');
    });
});

// Demostración de conceptos de asincronía vistos en clase
console.log('Tarea 1: Iniciar');
console.log('Tarea 2: Script cargado (síncrono)');
console.log('Tarea 3: Event listeners configurados');

// Ejemplo de setTimeout (callback) visto en clase
setTimeout(function() {
    console.log('Tarea asíncrona: Este mensaje aparece después de 2 segundos');
}, 2000);
