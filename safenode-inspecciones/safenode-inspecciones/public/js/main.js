// Organización de los ítems del formato 03-FOR-07 Rev9
const categorias = [
    {
        nombre: "1. DOCUMENTACIÓN",
        items: ["Licencia de Conducción Vigente", "SOAT Vigente", "Revisión Tecnomecánica", "Tarjeta de Propiedad", "Planilla de Despacho"]
    },
    {
        nombre: "2. ESTADO MECÁNICO EXTERIOR",
        items: ["Luces Altas y Bajas", "Direccionales Delanteras/Traseras", "Luces de Freno", "Estado de Llantas (Labrado)", "Limpiabrisas", "Espejos Retrovisores"]
    },
    {
        nombre: "3. EQUIPO DE CARRETERA Y SEGURIDAD",
        items: ["Gato y Cruceta", "Triángulos de Seguridad", "Extintor Vigente", "Botiquín de Primeros Auxilios", "Llanta de Repuesto"]
    }
    // Nota: Puedes seguir agregando los ítems restantes aquí siguiendo el mismo formato
];

const contenedor = document.getElementById('seccionesInspeccion');

// Función para generar las tablas automáticamente
categorias.forEach((cat) => {
    let html = `
    <div class="card mb-4 shadow-sm">
        <div class="card-header bg-primary text-white font-weight-bold">${cat.nombre}</div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th style="width: 60%">Ítem de Inspección</th>
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

    html += `</tbody></table></div></div></div>`;
    contenedor.innerHTML += html;
});

// Manejo del envío de datos al servidor de Render
document.getElementById('formInspeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Bloquear botón para evitar doble envío
    const btnEnvio = e.target.querySelector('button[type="submit"]');
    btnEnvio.disabled = true;
    btnEnvio.innerText = 'Enviando...';

    const respuestas = {};
    const inputs = e.target.querySelectorAll('input[type="radio"]:checked');
    inputs.forEach(input => {
        respuestas[input.name] = input.value;
    });

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

        if (res.ok) {
            alert('✅ Inspección guardada correctamente en SafeNode.');
            e.target.reset();
        } else {
            alert('❌ Error: ' + (result.message || 'No se pudo guardar'));
        }
    } catch (error) {
        console.error('Error en fetch:', error);
        alert('❌ Error de conexión con el servidor.');
    } finally {
        btnEnvio.disabled = false;
        btnEnvio.innerText = 'Enviar Inspección';
    }
});
