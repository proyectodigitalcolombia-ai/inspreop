// Listado completo de 113 puntos - Formato 03-FOR-07 Rev9
const categorias = [
    {
        nombre: "1. DOCUMENTACIÓN (Obligatorio)",
        items: ["Licencia de Conducción Vigente", "SOAT Vigente", "Revisión Tecnomecánica", "Tarjeta de Propiedad", "Seguro Contractual y Extracontractual", "Tarjeta de Operación", "Planilla de Despacho", "Guía de Carga / Remesa"]
    },
    {
        nombre: "2. ESTADO MECÁNICO EXTERIOR",
        items: ["Luces Altas y Bajas", "Direccionales Delanteras", "Direccionales Traseras", "Luces de Freno", "Luces de Reversa", "Luces de Parqueo (Estacionarias)", "Estado de Llantas Delanteras (Labrado)", "Estado de Llantas Traseras (Dual)", "Presión de Aire Llantas", "Pernos de Ruedas (Completos)", "Espejos Retrovisores (Derecho/Izquierdo)", "Limpiabrisas y Nivel de Líquido", "Vidrios y Parabrisas (Sin fisuras)", "Estado de Carrocería / Pintura", "Placas (Legibles y Limpias)"]
    },
    {
        nombre: "3. EQUIPO DE CARRETERA Y SEGURIDAD",
        items: ["Gato con capacidad para el peso", "Cruceta", "Dos triángulos o conos con reflectivo", "Extintor (Carga vigente y manómetro en verde)", "Botiquín de Primeros Auxilios", "Llanta de Repuesto", "Caja de Herramientas básica", "Tacos de bloqueo (2 unidades)", "Linterna con pilas", "Chaleco reflectivo"]
    },
    {
        nombre: "4. MOTOR Y NIVELES (Bajo Capó)",
        items: ["Nivel de Aceite Motor", "Nivel de Líquido Refrigerante", "Nivel de Líquido de Frenos", "Nivel de Aceite de Dirección", "Correas (Ventilador/Alternador)", "Batería (Bornes ajustados y sin sulfato)", "Fugas visibles (Aceite, Agua, Combustible)", "Tapa de Combustible (Ajustada)"]
    },
    {
        nombre: "5. CABINA Y SEGURIDAD PASIVA",
        items: ["Cinturones de Seguridad (Anclaje y funcionamiento)", "Ajuste y estado de Sillas", "Pito o Claxon", "Indicador de Velocidad (Velocímetro)", "Indicador de Combustible", "Indicador de Temperatura", "Freno de Mano (Parqueo)", "Estado de Pedales (Freno, Acelerador, Clutch)", "Aseo interno de la Cabina", "Radio de comunicación o Celular"]
    },
    {
        nombre: "6. ZONA DE CARGA Y CARGUE",
        items: ["Estado de la Carpa (Sin rotos)", "Cuerdas y Amarres (Sogas en buen estado)", "Piso de la unidad de carga (Limpio y seco)", "Puertas y Cerraduras", "Puntos de Anclaje", "Aseo área de carga (Sin olores o residuos)", "Estibas (En buen estado)", "Distribución de la carga (Equilibrada)", "Aseguramiento de la mercancía (Estabilidad)"]
    },
    {
        nombre: "7. SISTEMAS DE FRENOS Y DIRECCIÓN",
        items: ["Presión de Aire (Tanques/Compresor)", "Drenaje de Tanques de Aire", "Respuesta del Pedal de Freno", "Juego de la Dirección", "Suspensión (Ballestas/Amortiguadores)", "Ruidos extraños al conducir"]
    }
];

const contenedor = document.getElementById('seccionesInspeccion');

// Generar las tablas de forma automática
categorias.forEach((cat) => {
    let html = `
    <div class="card mb-4 shadow">
        <div class="card-header bg-primary text-white py-3">
            <h6 class="m-0 font-weight-bold"><i class="fas fa-check-circle mr-2"></i>${cat.nombre}</h6>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-bordered mb-0">
                    <thead class="bg-light text-center">
                        <tr>
                            <th style="width: 55%">Ítem de Inspección</th>
                            <th style="width: 15%">C</th>
                            <th style="width: 15%">NC</th>
                            <th style="width: 15%">NA</th>
                        </tr>
                    </thead>
                    <tbody>`;
    
    cat.items.forEach(item => {
        html += `
        <tr>
            <td class="align-middle pl-3">${item}</td>
            <td class="text-center align-middle">
                <input type="radio" name="${item}" value="C" checked class="form-check-input">
            </td>
            <td class="text-center align-middle">
                <input type="radio" name="${item}" value="NC" class="form-check-input text-danger">
            </td>
            <td class="text-center align-middle">
                <input type="radio" name="${item}" value="NA" class="form-check-input">
            </td>
        </tr>`;
    });

    html += `</tbody></table></div></div></div>`;
    contenedor.innerHTML += html;
});

// Manejo del envío al servidor de Render
document.getElementById('formInspeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando en SafeNode...';

    const respuestas = {};
    const checks = e.target.querySelectorAll('input[type="radio"]:checked');
    checks.forEach(input => {
        respuestas[input.name] = input.value;
    });

    const datos = {
        conductor: document.getElementById('conductor_nombre').value,
        documento: document.getElementById('conductor_documento').value,
        placa: document.getElementById('vehiculo_placa').value,
        respuestas: respuestas
    };

    try {
        const respuesta = await fetch('/api/inspecciones/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            alert('✅ Inspección Guardada.\nLos datos se han registrado correctamente en la base de datos de SafeNode S.A.S.');
            window.scrollTo(0, 0);
            e.target.reset();
        } else {
            alert('❌ Error al guardar. Por favor, revisa la conexión con el servidor.');
        }
    } catch (err) {
        alert('❌ Error de red: No se pudo contactar al servidor de SafeNode.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});
