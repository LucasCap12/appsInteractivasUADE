async function obtenerUsuarios() {
    try {
        document.querySelector('#loading').style.display = 'block';
        document.querySelector('#tablaUsuarios').style.display = 'none';
        
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const usuarios = await respuesta.json();
        mostrarUsuariosEnTabla(usuarios);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar usuarios');
    } finally {
        document.querySelector('#loading').style.display = 'none';
    }
}

function mostrarUsuariosEnTabla(usuarios) {
    const cuerpoTabla = document.querySelector('#cuerpoTabla');
    const tabla = document.querySelector('#tablaUsuarios');
    
    cuerpoTabla.innerHTML = '';
    
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
    
    tabla.style.display = 'table';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#cargarUsuarios').addEventListener('click', obtenerUsuarios);
});
