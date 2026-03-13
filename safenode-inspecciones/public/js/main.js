/**
 * YEGO ECO-T S.A.S. - PLATAFORMA LOGÍSTICA
 * Formato Consolidado: 03-FOR-07 Rev9
 * Configuración completa de todos los bloques operativos
 */

// --- 1. CONFIGURACIÓN DE DATOS ---

const itemsCabezote = [
    "Llantas direccionales y radiales", "Placas (Frente-Lateral-Techo)", "Defensa o Parachoques",
    "Compartimientos internos y externos", "Tanques de combustible y soportes",
    "Cabina (Piso-Silleria-Tapizado-Comando-Indicadores)", "Accesos de Aire",
    "Verificación visual de la Quinta Rueda y Kingpin", "Puertas (Chapas - Seguros)",
    "Ventanas y panorámico", "Espejos (retrovisores - parabrisas)", "Aseo General"
];

const itemsKitDerrames = [
    "Maletín de lona o plástico resistente", "Chaleco reflectivo", "Gafas de seguridad",
    "Guantes de nitrilo/neopreno", "Tapabocas con filtro", "Pala de chispa",
    "Bolsas de polietileno (Rojas)", "Material absorbente", "Cinta de señalización",
    "Masilla epóxica o cuñas", "Manual de atención de derrames"
];

const itemsRemolque = [
    "Patas mecánicas de soporte", "Líneas de aire y corriente", "Carpa - Varillas",
    "Defensa trasera", "Llantas", "Llanta de repuesto", "Carrocería",
    "Cintas reflectivas", "Trompos de Seguridad", "Revisión GPS no autorizados",
    "Sistema de luces stop/reversa", "Luces direccionales remolque"
];

const itemsKitCarretera = [
    { n: "Botiquín vigente", f: true }, { n: "Extintores PQS", f: true },
    { n: "Conos", f: false }, { n: "Señalización vial", f: false },
    { n: "Gato adecuado", f: false }, { n: "Linterna", f: false }, { n: "Herramienta básica", f: false }
];

const itemsBotiquin = [
    "Gasas limpias", "Esparadrapo", "Bajalenguas", "Guantes látex", "Vendas",
    "Solución salina", "Termómetro", "Alcohol", "Pito", "Tijeras", "Tapabocas", "Algodón"
];

const itemsEPP = [
    "Casco", "Monogafas", "Tapabocas", "Tapaoídos", "Guantes vaqueta", "Botas seguridad", "Camisa Jean", "Chaleco"
];

const requisitosDespacho = [
    { n: "Requiere unidad reefer", t: "check" }, { n: "Punto de cargue", t: "text" },
    { n: "Temperatura requerida", t: "text" }, { n: "Seguridad Social impresa", t: "check" },
    { n: "Rótulos UN (4 lados)", t: "check" }, { n: "Tarjeta de emergencia", t: "check" },
    { n: "Plan de Ruta", t: "check" }, { n: "Alarma de retroceso", t: "check" }
];

const docsCarga = ["Remesa de carga", "Manifiesto", "Facturas", "Planilla despacho", "Tarjeta emergencia"];

// --- 2. FUNCIONES DE RENDERIZADO ---

const generarTablaEstandar = (titulo, items, prefijo, color = "#6f1ab6") => {
    return `
    <div class="card mb-4 shadow border-0" style="border-left: 6px solid ${color};">
        <div class="card-header text-white py-2" style="background-color: ${color};">
            <h6 class="m-0 font-weight-bold text-center text-uppercase">${titulo}</h6>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered mb-0 text-center align-middle">
                <thead class="bg-dark text-white small">
                    <tr><th class="text-start ps-3" style="width: 50%">ARTÍCULO</th><th>BUENO</th><th>MALO</th><th>NA</th></tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td class="text-start ps-3 small fw-bold">${item}</td>
                            <td><input type="radio" name="${prefijo}_${item}" value="BUENO" checked class="form-check-input"></td>
                            <td><input type="radio" name="${prefijo}_${item}" value="MALO" class="form-check-input border-danger"></td>
                            <td><input type="radio" name="${prefijo}_${item}" value="NA" class="form-check-input"></td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
};

const renderizarTodo = () => {
    const contenedor = document.getElementById('seccionesInspeccion');
    contenedor.innerHTML = '';
    
    // Bloque 1: Cabezote
    contenedor.innerHTML += generarTablaEstandar("Parte 1. INSPECCIÓN CABEZOTE", itemsCabezote, "cab");

    // Bloque 2: Kit Carretera con Fechas
    let htmlKit = `
    <div class="card mb-4 shadow border-0" style="border-left: 6px solid #6f1ab6;">
        <div class="card-header text-white py-2" style="background-color: #6f1ab6;"><h6 class="m-0 text-center fw-bold">KIT DE CARRETERA</h6></div>
        <table class="table table-bordered mb-0 text-center small">
            <thead class="bg-dark text-white"><tr><th class="text-start ps-3">ARTÍCULO</th><th>B</th><th>M</th><th>NA</th><th>VENCIMIENTO</th></tr></thead>
            <tbody>
                ${itemsKitCarretera.map(i => `
                <tr>
                    <td class="text-start ps-3 fw-bold">${i.n}</td>
                    <td><input type="radio" name="kcar_${i.n}" value="B" checked></td>
                    <td><input type="radio" name="kcar_${i.n}" value="M"></td>
                    <td><input type="radio" name="kcar_${i.n}" value="NA"></td>
                    <td>${i.f ? `<input type="date" class="form-control form-control-sm">` : 'N/A'}</td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    contenedor.innerHTML += htmlKit;

    // Bloque 3: Botiquín, EPP
    contenedor.innerHTML += generarTablaEstandar("VERIFICACIÓN BOTIQUÍN", itemsBotiquin, "bot");
    contenedor.innerHTML += generarTablaEstandar("VERIFICACIÓN EPP", itemsEPP, "epp");

    // Bloque 4: Requisitos Despacho
    let htmlDesp = `
    <div class="card mb-4 shadow border-0" style="border-left: 6px solid #6f1ab6;">
        <div class="card-header text-white py-2" style="background-color: #6f1ab6;"><h6 class="m-0 text-center fw-bold">REQUISITOS PARA EL DESPACHO</h6></div>
        <table class="table table-bordered mb-0 small">
            ${requisitosDespacho.map(r => `
            <tr>
                <td class="fw-bold ps-3">${r.n}</td>
                <td>${r.t === 'check' ? `<select class="form-select form-select-sm"><option>CUMPLE</option><option>NO CUMPLE</option></select>` : `<input type="text" class="form-control form-control-sm">`}</td>
            </tr>`).join('')}
        </table>
    </div>`;
    contenedor.innerHTML += htmlDesp;

    // Bloque 5: Documentos Carga
    contenedor.innerHTML += `
    <div class="card mb-4 shadow border-0" style="border-left: 6px solid #6f1ab6;">
        <div class="card-header text-white py-2" style="background-color: #6f1ab6;"><h6 class="m-0 text-center fw-bold">DOCUMENTOS DE CARGA</h6></div>
        <table class="table table-bordered mb-0">
            ${docsCarga.map(d => `<tr><td class="ps-3 fw-bold">${d}</td><td><select class="form-select"><option>SÍ</option><option>NO</option></select></td></tr>`).join('')}
        </table>
    </div>`;
};

// --- 3. LÓGICA DE INTERRUPTORES (SWITCHES) ---

document.getElementById('checkKitDerrames').addEventListener('change', function() {
    const div = document.getElementById('bloqueKitDerrames');
    div.style.display = this.checked ? 'block' : 'none';
    if(this.checked) div.innerHTML = generarTablaEstandar("KIT DE DERRAMES", itemsKitDerrames, "kit", "#e67e22");
});

document.getElementById('checkRemolque').addEventListener('change', function() {
    const div = document.getElementById('bloqueRemolque');
    div.style.display = this.checked ? 'block' : 'none';
    if(this.checked) div.innerHTML = generarTablaEstandar("INSPECCIÓN REMOLQUE", itemsRemolque, "rem", "#ffc107");
});

// --- 4. INICIALIZACIÓN ---
renderizarTodo();
