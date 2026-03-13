// Definición de las categorías y sus puntos (Ejemplo con los primeros puntos)
const categorias = [
    {
        nombre: "1. DOCUMENTACIÓN",
        items: ["Licencia de Conducción Vigente", "SOAT Vigente", "Revisión Tecnomecánica", "Tarjeta de Propiedad"]
    },
    {
        nombre: "2. ESTADO MECÁNICO EXTERIOR",
        items: ["Luces Altas/Bajas", "Direccionales", "Estado de Llantas", "Limpiabrisas"]
    }
    // Aquí iremos agregando los 113 puntos organizados
];

const contenedor = document.getElementById('seccionesInspeccion');

// Generar el formulario dinámicamente
categorias.forEach((cat, idx) => {
    let html = `
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">${cat.nombre}</div>
        <div class="card-body p-0">
            <table class="table table-striped mb-0">
                <thead>
                    <tr>
                        <th>Ítem</th>
                        <th class="text-center">C</th>
                        <th class="text-center">NC</th>
                        <th class="text-center">NA</th>
                    </tr>
                </thead>
                <tbody>`;
    
    cat.items.forEach(item => {
        html += `
        <tr>
            <td>${item}</td>
            <td class="text-center"><input type="radio" name="${item}" value="C" checked></td>
            <td class="text-center"><input type="radio" name="${item}" value="NC"></td>
            <td class="text-center"><input type="radio" name="${item}" value="NA"></td>
        </tr>`;
    });

    html += `</tbody></table></div></div>`;
    contenedor.innerHTML += html;
});

// Manejo del Envío
document.getElementById('formInspeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const respuestas = {};
    const formData = new FormData(e.target);
    formData.forEach((value, key) => { respuestas[key] = value; });

    const datos = {
        conductor: document.getElementById('conductor_nombre').value,
        documento: document.getElementById('conductor_documento').value,
        placa: document.getElementById('vehiculo_placa').value,
        respuestas: respuestas
    };

    try {
        const res = await fetch('/api/inspecciones/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const result = await res.json();
        if(result.success) {
            alert('¡Inspección guardada con éxito en SafeNode!');
            e.target.reset();
        }
    } catch (error) {
        alert('Error al enviar la inspección');
    }
});
