import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, CheckCircle2, Download, Printer, XCircle, MinusCircle, User, Truck, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGetInspeccion, type ItemEstado } from "@/lib/api";
import { generateInspectionPDF } from "@/lib/pdf-generator";
import {
  CABEZOTE_ITEMS,
  REMOLQUE_ESTRUCTURA_ITEMS,
  REMOLQUE_LUCES_ITEMS,
  KIT_DERRAMES_ITEMS,
  KIT_CARRETERA_ITEMS,
  BOTIQUIN_ITEMS,
  EPP_ITEMS,
  REQUISITOS_DESPACHO_ITEMS,
  DOCS_CARGA_ITEMS
} from "@/lib/constants";

export default function DetalleInspeccion() {
  const [, params] = useRoute("/inspeccion/:id");
  const id = parseInt(params?.id || "0");

  const { data: insp, isLoading, isError } = useQuery({
    queryKey: ['inspeccion', id],
    queryFn: () => apiGetInspeccion(id),
    enabled: !!id
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (isError || !insp) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
      <p className="text-muted-foreground mb-6">No se pudo cargar la inspección o no existe.</p>
      <Link href="/preoperacional/historial" className="text-primary hover:underline">
        Volver al historial
      </Link>
    </div>
  );

  const handleDownloadPdf = () => {
    generateInspectionPDF(insp);
  };

  const StatusIcon = ({ status }: { status?: ItemEstado | null }) => {
    if (status === "B") return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (status === "M") return <XCircle className="w-5 h-5 text-destructive" />;
    if (status === "NA") return <MinusCircle className="w-5 h-5 text-muted-foreground/50" />;
    return <span className="text-muted-foreground/30 text-sm">-</span>;
  };

  const SectionView = ({ title, items, data }: { title: string, items: string[], data?: Record<string, any> }) => (
    <div className="mb-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b border-border">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {items.map(item => (
          <div key={item} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
            <span className="text-sm text-foreground/80">{item}</span>
            <StatusIcon status={data?.[item]} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          href="/preoperacional/historial"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleDownloadPdf}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Banner Info */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
              ID Registro #{insp.id}
            </div>
            <h1 className="text-3xl font-display font-bold">
              Inspección Preoperacional
            </h1>
            <p className="text-slate-300 mt-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Manifiesto: <span className="text-white font-mono">{insp.manifiesto}</span>
            </p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Fecha de Inspección</p>
            <p className="text-xl font-bold">{format(new Date(insp.fecha), "dd MMMM yyyy", { locale: es })}</p>
          </div>
        </div>

        {/* General Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-muted/20">
          <div className="p-6 sm:p-8 flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">Vehículo</p>
              <p className="text-xl font-black text-foreground">{insp.vehiculo_placa}</p>
              <p className="text-sm text-muted-foreground mt-1">{insp.clase_vehiculo} • {insp.kilometraje} km</p>
              <p className="text-sm font-medium mt-2 bg-secondary inline-block px-2 py-0.5 rounded text-secondary-foreground border border-border">
                {insp.modalidad}
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">Conductor</p>
              <p className="text-lg font-bold text-foreground">{insp.conductor_nombre}</p>
              <p className="text-sm text-muted-foreground mt-1">{insp.tipo_documento} {insp.conductor_documento}</p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-6 sm:p-8">
          <SectionView title="1. Inspección Cabezote" items={CABEZOTE_ITEMS} data={insp.cabezote} />
          
          {insp.aplica_remolque && (
            <div className="mt-10 bg-muted/30 p-6 rounded-xl border border-border">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-lg">Unidad de Remolque</h3>
                <span className="px-3 py-1 bg-background border border-border rounded-md text-sm font-bold">N° {insp.n_remolque || 'No registrado'}</span>
              </div>
              <SectionView title="Estructura" items={REMOLQUE_ESTRUCTURA_ITEMS} data={insp.remolque_estructura} />
              <SectionView title="Luces" items={REMOLQUE_LUCES_ITEMS} data={insp.remolque_luces} />
            </div>
          )}

          <div className="mt-10">
            {insp.aplica_kit_derrames && <SectionView title="Kit de Derrames" items={KIT_DERRAMES_ITEMS} data={insp.kit_derrames} />}
            <SectionView title="Kit de Carretera" items={KIT_CARRETERA_ITEMS} data={insp.kit_carretera} />
            <SectionView title="Botiquín" items={BOTIQUIN_ITEMS} data={insp.botiquin} />
            <SectionView title="Elementos de Protección Personal (EPP)" items={EPP_ITEMS} data={insp.epp} />
            <SectionView title="Requisitos para el Despacho" items={REQUISITOS_DESPACHO_ITEMS} data={insp.requisitos_despacho} />
            <SectionView title="Documentos de Carga" items={DOCS_CARGA_ITEMS} data={insp.documentos_carga} />
          </div>

          {insp.observaciones && (
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-2">Observaciones</h3>
              <p className="text-amber-900 whitespace-pre-wrap">{insp.observaciones}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-center font-display font-bold text-xl mb-8">Firmas de Responsabilidad</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xs h-32 bg-secondary border-b-2 border-border mb-4 flex items-center justify-center p-2 rounded-t-lg">
                  {insp.firma_conductor ? (
                    <img src={insp.firma_conductor} alt="Firma Conductor" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin firma</span>
                  )}
                </div>
                <p className="font-bold">{insp.conductor_nombre}</p>
                <p className="text-sm text-muted-foreground">C.C. {insp.conductor_documento}</p>
                <p className="text-xs uppercase tracking-wider font-semibold mt-2 text-muted-foreground">Conductor</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xs h-32 bg-secondary border-b-2 border-border mb-4 flex items-center justify-center p-2 rounded-t-lg">
                  {insp.firma_inspector ? (
                    <img src={insp.firma_inspector} alt="Firma Inspector" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin firma</span>
                  )}
                </div>
                <p className="font-bold">Inspector / Despachador</p>
                <p className="text-xs uppercase tracking-wider font-semibold mt-2 text-muted-foreground">Empresa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
