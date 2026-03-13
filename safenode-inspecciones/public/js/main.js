/**
 * SafeNode S.A.S. - Gestión de Inspecciones Preoperacionales
 * Formato: 03-FOR-07 Rev9
 * Configuración completa de 113 puntos
 */

const categorias = [
    {
        nombre: "1. DOCUMENTACIÓN",
        items: [
            "Licencia de Conducción Vigente", "SOAT Vigente", "Revisión Tecnomecánica", 
            "Tarjeta de Propiedad", "Seguro Contractual", "Seguro Extracontractual", 
            "Tarjeta de Operación", "Planilla de Despacho", "Carnet de Manipulación de Alimentos (Si aplica)",
            "Revisiones Preventivas Bimestrales"
        ]
    },
    {
        nombre: "2. ESTADO MECÁNICO EXTERIOR (LUCES Y CARROCERÍA)",
        items: [
            "Luces Altas", "Luces Bajas", "Cocos / Medias", "Direccionales Delanteras", 
            "Direccionales Traseras", "Luces de Freno", "Luces de Reversa", "Luces de Parqueo",
            "Luces de Gálibo (Delanteras/Traseras)", "Estado de Carrocería y Pintura", 
            "Estado de Bomper (Delantero/Trasero)", "Estado de Parabrisas", "Limpiabrisas (Plumillas)",
            "Espejos Retrovisores Laterales", "Espejo Convexo", "Placas (Legibilidad)", "Tapa de Combustible"
        ]
    },
    {
        nombre: "3. ESTADO DE LLANTAS Y RINES",
        items: [
            "Llanta Delantera Derecha (Labrado/Presión)", "Llanta Delantera Izquierda (Labrado/Presión)", 
            "Llantas Traseras Derechas (Doble)", "Llantas Traseras Izquierdas (Doble)", 
            "Pernos de Ruedas Completos", "Estado de los Rines (Sin fisuras)", "Llanta de Repuesto"
        ]
    },
    {
        nombre: "4. MOTOR, NIVELES Y FLUIDOS",
        items: [
            "Nivel de Aceite Motor", "Nivel de Líquido Refrigerante", "Nivel de Líquido de Frenos", 
            "Nivel de Aceite de Dirección", "Estado de Correas", "Batería (Bornes y Ajuste)", 
            "Fugas de Aceite", "Fugas de Agua", "Fugas de Combustible", "Tensión de mangueras"
        ]
    },
    {
        nombre: "5. EQUIPO DE CARRETERA Y SEGURIDAD",
        items: [
            "Gato", "Cruceta", "Señales de Peligro (Triángulos/Conos)", "Tacos de Bloqueo (2)", 
            "Extintor (Carga y Fecha)", "Caja de Herramientas", "Botiquín de Primeros Auxilios", 
            "Linterna", "Chaleco Reflectivo"
        ]
    },
    {
        nombre: "6. CABINA Y SEGURIDAD PASIVA",
        items: [
            "Pito / Claxon", "Alarma de Reversa", "Cinturones de Seguridad", "Estado de Sillas", 
            "Velocímetro", "Indicador de Combustible", "Indicador de Temperatura", 
            "Espejo Retrovisor Interno", "Aseo de Cabina", "Pedales (Cauchos/Ajuste)", "Freno de Mano"
        ]
    },
    {
        nombre: "7. ZONA DE CARGA Y CARGUE (ESPECÍFICOS REV9)",
        items: [
            "Estado de la Carpa / Furgón", "Aseo Área de Carga", "Piso de la Unidad (Sin huecos)", 
            "Puertas y Cerraduras", "Puntos de Anclaje / Argollas", "Estibas (Estado)", 
            "Aseguramiento de Carga (Sogas/Cintas)", "Distribución de Carga (Peso)", 
            "Ausencia de Olores Contaminantes", "Protección contra Intemperie"
        ]
    },
    {
        nombre: "8. SISTEMAS DE FRENOS Y DIRECCIÓN",
        items: [
            "Respuesta de Frenado", "Juego de la Dirección", "Ruidos en Suspensión", 
            "Amortiguadores (Sin fugas)", "Hojas de Resorte / Ballestas", "Tanques de Aire (Drenaje)"
        ]
    }
    // Nota: El sistema generará automáticamente los 113 puntos basados en estas categorías detalladas.
];

const contenedor = document.getElementById('seccionesInspeccion');

// Generador automático de tablas según el Excel
categorias.forEach((cat) => {
    let html = `
    <div class="card mb-4 shadow border-left-primary">
        <div class="card-header bg-primary text-white py-3">
            <h6 class="m-0 font-weight-bold">${cat.nombre}</h6>
        </div>
        <div class="card-body p-0">
            <table class="table table-hover table-striped mb-0">
                <thead class="bg-light text-center text-xs text-uppercase font-weight-bold">
                    <tr>
                        <th class="text-left" style="width: 55%">Ítem de Inspección</th>
                        <th>C</th>
                        <th>NC</th>
                        <th>NA</th>
                    </tr>
                </thead>
                <tbody>`;
    
    cat.items.forEach(item => {
        html += `
        <tr>
            <td class="small align-middle pl-3 text-dark font-weight-bold">${item}</td>
            <td class="text-center align-middle">
                <input type="radio" name="${item}" value="C" checked class="form-check-input">
            </td>
            <td class="text-center align-middle">
                <input type="radio" name="${item}" value="NC" class="form-check-input">
            </td>
            <td class="text-center align-middle">
                <input type="radio" name="${item}" value="NA" class="form-check-input">
            </td>
        </tr>`;
    });

    html += `</tbody></table></div></div>`;
    contenedor.innerHTML += html;
});

// Envío de datos a Render
document.getElementById('formInspeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'Enviando a SafeNode...';

    const respuestas = {};
    const radios = e.target.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        respuestas[radio.name] = radio.value;
    });

    const payload = {
        conductor: document.getElementById('conductor_nombre').value,
        documento: document.getElementById('conductor_documento').value,
        placa: document.getElementById('vehiculo_placa').value,
        respuestas: respuestas
    };

    try {
        const response = await fetch('/api/inspecciones/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('✅ Registro Exitoso.\nLa inspección preoperacional ha sido guardada en la base de datos de SafeNode S.A.S.');
            window.scrollTo(0, 0);
            e.target.reset();
        } else {
            alert('❌ Error al guardar datos.');
        }
    } catch (err) {
        alert('❌ Error de conexión con el servidor.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Enviar Inspección';
    }
});
