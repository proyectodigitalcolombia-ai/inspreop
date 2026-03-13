/**
 * YEGO ECO-T S.A.S. - Plataforma de Control Logístico
 * Inspección Preoperacional Formato: 03-FOR-07 Rev9
 * Configuración completa de 113 puntos con colores corporativos
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
];

const renderTabla = () => {
    const contenedor = document.getElementById('seccionesInspeccion');
    contenedor.innerHTML = ''; 

    categorias.forEach((cat) => {
        let html = `
        <div class="card mb-4 shadow border-0" style="border-left: 6px solid #6f1ab6 !important;">
            <div class="card-header text-white py-3" style="background-color: #6f1ab6 !important;">
                <h6 class="m-0 font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                    <i class="fas fa-truck-loading me-2" style="color: #ffc107;"></i>${cat.nombre}
                </h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                        <thead class="bg-light text-center small fw-bold text-secondary">
                            <tr>
                                <th class="text-start ps-4" style="width: 55%">ÍTEM DE CONTROL</th>
                                <th style="width: 60px">C</th>
                                <th style="width: 60px">NC</th>
                                <th style="width: 60px">NA</th>
                            </tr>
                        </thead>
                        <tbody>`;
        
        cat.items.forEach(item => {
            html += `
            <tr>
                <td class="small align-middle ps-4 text-dark fw-bold">${item}</td>
                <td class="text-center align-middle">
                    <input type="radio" name="${item}" value="C" checked class="form-check-input">
                </td>
                <td class="text-center align-middle">
                    <input type="radio" name="${item}" value="NC" class="form-check-input border-danger">
                </td>
                <td class="text-center align-middle">
                    <input type="radio" name="${item}" value="NA" class="form-check-input">
                </td>
            </tr>`;
        });

        html += `</tbody></table></div></div></div>`;
        contenedor.innerHTML += html;
    });
};

renderTabla();

document.getElementById('formInspeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;
    
    btn.disabled = true;
    btn.style.backgroundColor = "#5a1494";
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i> Procesando en YEGO ECO-T...';

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
            alert('✅ Registro Exitoso.\nLa inspección de YEGO ECO-T S.A.S. ha sido guardada en la plataforma logística.');
            window.scrollTo(0, 0);
            e.target.reset();
        } else {
            alert('❌ Error: No se pudo conectar con la base de datos de YEGO.');
        }
    } catch (err) {
        alert('❌ Error de red: El servidor de Render no responde.');
    } finally {
        btn.disabled = false;
        btn.style.backgroundColor = "#6f1ab6";
        btn.innerHTML = originalContent;
    }
});
