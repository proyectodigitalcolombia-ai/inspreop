const API_BASE = '/api/inspecciones';

export type ItemEstado = "B" | "M" | "NA";

export type InspeccionResumen = {
  id: number;
  fecha: string;
  vehiculo_placa: string;
  clase_vehiculo: string;
  conductor_nombre: string;
  conductor_documento: string;
  manifiesto: string;
};

export type InspeccionDetalle = InspeccionResumen & {
  tipo_documento: string;
  kilometraje: number;
  modalidad: string;
  aplica_remolque: boolean;
  n_remolque?: string | null;
  aplica_kit_derrames: boolean;
  cabezote?: Record<string, ItemEstado>;
  remolque_estructura?: Record<string, ItemEstado>;
  remolque_luces?: Record<string, ItemEstado>;
  kit_derrames?: Record<string, ItemEstado>;
  kit_carretera?: Record<string, ItemEstado>;
  botiquin?: Record<string, ItemEstado>;
  epp?: Record<string, ItemEstado>;
  requisitos_despacho?: Record<string, ItemEstado>;
  documentos_carga?: Record<string, ItemEstado>;
  observaciones?: string | null;
  firma_conductor?: string | null;
  firma_inspector?: string | null;
};

export async function apiListarInspecciones(): Promise<InspeccionResumen[]> {
  const resp = await fetch(`${API_BASE}/historial`);
  if (!resp.ok) throw new Error('Error al listar inspecciones');
  return resp.json();
}

export async function apiGetInspeccion(id: number): Promise<InspeccionDetalle> {
  const resp = await fetch(`${API_BASE}/${id}`);
  if (!resp.ok) throw new Error('Inspección no encontrada');
  return resp.json();
}

export async function apiCrearInspeccion(data: Record<string, unknown>): Promise<{ id: number }> {
  const resp = await fetch(`${API_BASE}/guardar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!resp.ok) throw new Error('Error al guardar inspección');
  return resp.json();
}

export async function apiEliminarInspeccion(id: number): Promise<void> {
  const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!resp.ok) throw new Error('Error al eliminar inspección');
}
