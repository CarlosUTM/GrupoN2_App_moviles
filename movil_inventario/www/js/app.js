// Configuración Central
const API_BASE = 'https://grupon2-app.onrender.com/api/productos';

// Función auxiliar para seleccionar elementos (como en tu ejemplo)
const $ = (id) => document.getElementById(id);

// --- LÓGICA COMÚN (Para todas las páginas) ---

// Función para manejar errores de forma uniforme
function mostrarError(mensaje) {
    alert("❌ Error: " + mensaje);
}

// --- LÓGICA DE LA PÁGINA DE INICIO (INDEX) ---
async function initIndex() {
    const tabla = $('tablaProductos');
    const searchForm = $('searchForm');

    async function cargarProductos(url = API_BASE) {
        try {
            tabla.innerHTML = '<tr><td colspan="5" style="text-align:center">Cargando...</td></tr>';
            const response = await fetch(url);
            
            if (response.status === 404) {
                tabla.innerHTML = '<tr><td colspan="5" style="text-align:center">No se encontraron productos.</td></tr>';
                return;
            }

            const data = await response.json();
            const productos = Array.isArray(data) ? data : []; // Asegurar que sea array

            if (productos.length === 0) {
                tabla.innerHTML = '<tr><td colspan="5" style="text-align:center">Inventario vacío.</td></tr>';
                return;
            }

            // Renderizar tabla
            tabla.innerHTML = productos.map(p => `
                <tr>
                    <td style="font-weight:bold">${p.nombre}</td>
                    <td>${p.categoria || '-'}</td>
                    <td>${p.cantidad}</td>
                    <td>${p.ubicacion || '-'}</td>
                    <td style="text-align: center;">
                        <div class="actions" style="justify-content: center;">
                            <a href="models/editar.html?id=${p.id}" class="btn-edit">✏️</a>
                            <button class="btn-delete" onclick="eliminarProducto(${p.id})">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error(error);
            tabla.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red">Error de conexión con el servidor</td></tr>';
        }
    }

    // Buscador
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = $('searchInput').value.trim();
        const url = query ? `${API_BASE}/buscar/${query}` : API_BASE;
        cargarProductos(url);
    });

    // Cargar al inicio
    cargarProductos();
}

// Función global para eliminar (necesaria porque se llama desde el HTML onclick)
window.eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            location.reload(); // Recargar página para ver cambios
        } else {
            mostrarError("No se pudo eliminar");
        }
    } catch (e) {
        mostrarError("Error de red al eliminar");
    }
};


// --- LÓGICA DE LA PÁGINA CREAR ---
function initCrear() {
    const form = $('crearForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoProducto = {
            nombre: $('nombre').value.trim(),
            descripcion: $('descripcion').value.trim(),
            cantidad: parseInt($('cantidad').value),
            ubicacion: $('ubicacion').value.trim(),
            categoria: $('categoria').value.trim()
        };

        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto)
            });

            if (response.ok) {
                alert("✅ Producto creado exitosamente");
                window.location.href = '../index.html';
            } else {
                const errorData = await response.json();
                mostrarError(errorData.message || "Error al guardar");
            }
        } catch (error) {
            mostrarError("No se pudo conectar con el servidor");
        }
    });
}


// --- LÓGICA DE LA PÁGINA EDITAR ---
async function initEditar() {
    // Obtener ID de la URL (ej: editar.html?id=5)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert("No se especificó un producto");
        window.location.href = '../index.html';
        return;
    }

    // Cargar datos actuales
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        
        const p = await res.json();
        
        // Rellenar formulario
        $('prodId').value = p.id;
        $('nombre').value = p.nombre;
        $('descripcion').value = p.descripcion || '';
        $('cantidad').value = p.cantidad;
        $('ubicacion').value = p.ubicacion || '';
        $('categoria').value = p.categoria || '';

    } catch (error) {
        mostrarError(error.message);
        window.location.href = '../index.html';
    }

    // Manejar actualización
    $('editarForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const datos = {
            nombre: $('nombre').value,
            descripcion: $('descripcion').value,
            cantidad: parseInt($('cantidad').value),
            ubicacion: $('ubicacion').value,
            categoria: $('categoria').value
        };

        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (res.ok) {
                alert("✅ Producto actualizado");
                window.location.href = '../index.html';
            } else {
                const errorData = await response.json();
                mostrarError(errorData.message);
            }
        } catch (error) {
            mostrarError("Error al actualizar");
        }
    });
}

// --- DETECCIÓN DE PÁGINA E INICIALIZACIÓN ---
// Esto revisa qué elementos existen en el HTML actual y ejecuta la lógica correcta
document.addEventListener('DOMContentLoaded', () => {
    if ($('tablaProductos')) {
        console.log("Página detectada: Index");
        initIndex();
    } 
    else if ($('crearForm')) {
        console.log("Página detectada: Crear");
        initCrear();
    } 
    else if ($('editarForm')) {
        console.log("Página detectada: Editar");
        initEditar();
    }
});