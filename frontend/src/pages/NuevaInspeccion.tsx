import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import { Save, AlertTriangle, Camera, Eraser, Info, Link2 } from "lucide-react";
import { useCrearInspeccion, getListarInspeccionesQueryKey, type CrearInspeccionRequest } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { StatusToggle } from "@/components/ui/StatusToggle";
import {
  CABEZOTE_ITEMS,
  REMOLQUE_ESTRUCTURA_ITEMS,
  REMOLQUE_LUCES_ITEMS,
  KIT_DERRAMES_ITEMS,
  KIT_CARRETERA_ITEMS,
  BOTIQUIN_ITEMS,
  EPP_ITEMS,
  REQUISITOS_DESPACHO_ITEMS,
  DOCS_CARGA_ITEMS,
  FOTOS_ITEMS
} from "@/lib/constants";

// Zod schema for form validation matching the API type
const formSchema = z.object({
  manifiesto: z.string().min(1, "Campo requerido"),
  fecha: z.string().min(1, "Campo requerido"),
  conductor_nombre: z.string().min(1, "Campo requerido"),
  tipo_documento: z.string(),
  conductor_documento: z.string().min(1, "Campo requerido"),
  vehiculo_placa: z.string().min(1, "Campo requerido"),
  clase_vehiculo: z.string(),
  kilometraje: z.coerce.number().min(0, "Debe ser mayor o igual a 0"),
  modalidad: z.string(),
  aplica_remolque: z.boolean(),
  n_remolque: z.string().nullable().optional(),
  aplica_kit_derrames: z.boolean(),
  cabezote: z.record(z.string(), z.any()).optional(),
  remolque_estructura: z.record(z.string(), z.any()).optional(),
  remolque_luces: z.record(z.string(), z.any()).optional(),
  kit_derrames: z.record(z.string(), z.any()).optional(),
  kit_carretera: z.record(z.string(), z.any()).optional(),
  botiquin: z.record(z.string(), z.any()).optional(),
  epp: z.record(z.string(), z.any()).optional(),
  requisitos_despacho: z.record(z.string(), z.any()).optional(),
  documentos_carga: z.record(z.string(), z.any()).optional(),
  observaciones: z.string().nullable().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function NuevaInspeccion() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sigConductorRef = useRef<SignatureCanvas>(null);
  const sigInspectorRef = useRef<SignatureCanvas>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: format(new Date(), "yyyy-MM-dd"),
      tipo_documento: "Cédula de Ciudadanía",
      clase_vehiculo: "Sencillo",
      modalidad: "Nacional",
      aplica_remolque: false,
      aplica_kit_derrames: false,
      cabezote: {},
      remolque_estructura: {},
      remolque_luces: {},
      kit_derrames: {},
      kit_carretera: {},
      botiquin: {},
      epp: {},
      requisitos_despacho: {},
      documentos_carga: {},
      observaciones: ""
    }
  });

  const watchAplicaRemolque = form.watch("aplica_remolque");
  const watchAplicaKitDerrames = form.watch("aplica_kit_derrames");

  const { mutate: createInsp, isPending } = useCrearInspeccion({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Éxito", description: "Inspección guardada correctamente." });
        queryClient.invalidateQueries({ queryKey: getListarInspeccionesQueryKey() });
        setLocation(`/preoperacional/inspeccion/${data.id}`);
      },
      onError: () => {
        toast({ title: "Error", description: "No se pudo guardar la inspección.", variant: "destructive" });
      }
    }
  });

  const cleanSection = (rec?: Record<string, unknown>): Record<string, string> => {
    if (!rec) return {};
    return Object.fromEntries(
      Object.entries(rec).filter(([, v]) => v === "B" || v === "M" || v === "NA") as [string, string][]
    );
  };

  const onSubmit = (data: FormValues) => {
    const payload: CrearInspeccionRequest = {
      ...data,
      vehiculo_placa: data.vehiculo_placa.toUpperCase(),
      cabezote: cleanSection(data.cabezote),
      remolque_estructura: cleanSection(data.remolque_estructura),
      remolque_luces: cleanSection(data.remolque_luces),
      kit_derrames: cleanSection(data.kit_derrames),
      kit_carretera: cleanSection(data.kit_carretera),
      botiquin: cleanSection(data.botiquin),
      epp: cleanSection(data.epp),
      requisitos_despacho: cleanSection(data.requisitos_despacho),
      documentos_carga: cleanSection(data.documentos_carga),
      firma_conductor: sigConductorRef.current?.isEmpty() ? null : (sigConductorRef.current?.toDataURL() ?? null),
      firma_inspector: sigInspectorRef.current?.isEmpty() ? null : (sigInspectorRef.current?.toDataURL() ?? null),
    };
    createInsp({ data: payload });
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    console.error("[inspreop] Form validation errors:", errors);
    toast({ title: "Campos incompletos", description: "Por favor complete todos los campos requeridos antes de guardar.", variant: "destructive" });
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotos(prev => ({ ...prev, [id]: url }));
    }
  };

  // Helper component to render inspection sections
  const Section = ({ title, namePrefix, items, colorClass = "bg-primary" }: { title: string, namePrefix: keyof FormValues, items: string[], colorClass?: string }) => (
    <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden mb-8">
      <div className={`${colorClass} px-6 py-3 text-white font-bold tracking-wide uppercase text-sm`}>
        {title}
      </div>
      <div className="p-4 sm:p-6 divide-y divide-border/50">
        {items.map((item) => (
          <div key={item} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground/90">{item}</span>
            <Controller
              control={form.control}
              name={`${namePrefix}.${item}` as any}
              render={({ field }) => (
                <StatusToggle value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">

      {/* ENCABEZADO INSTITUCIONAL SAFENODE */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-5" style={{ background: "linear-gradient(135deg, #0d1117 0%, #0a2540 60%, #003f6e 100%)" }}>
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}logo-safenode.png`}
              alt="SafeNode SAS"
              className="w-14 h-14 object-contain"
            />
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#00b4d8" }}>SafeNode S.A.S</p>
              <h2 className="text-white font-black text-base sm:text-lg uppercase tracking-wide leading-tight">
                Inspección Preoperacional
              </h2>
              <p className="text-xs text-slate-400 uppercase tracking-wider">de Vehículos</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Formato</span>
            <span className="text-white font-bold text-sm">FO-LOG-001</span>
            <span className="text-xs text-slate-400">{new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #0076b6, #00b4d8, #0076b6)" }} />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        
        {/* INFO GENERAL */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 text-white font-bold tracking-wide flex items-center gap-2 uppercase text-sm" style={{ background: "linear-gradient(90deg, #0076b6, #0096d6)" }}>
            <Info className="w-4 h-4" /> Información General
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Manifiesto</label>
              <input {...form.register("manifiesto")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
              {form.formState.errors.manifiesto && <span className="text-xs text-destructive">{form.formState.errors.manifiesto.message}</span>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Fecha</label>
              <input type="date" {...form.register("fecha")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Placa</label>
              <input {...form.register("vehiculo_placa")} placeholder="ABC123" className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none uppercase" />
              {form.formState.errors.vehiculo_placa && <span className="text-xs text-destructive">{form.formState.errors.vehiculo_placa.message}</span>}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Conductor</label>
              <input {...form.register("conductor_nombre")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
              {form.formState.errors.conductor_nombre && <span className="text-xs text-destructive">{form.formState.errors.conductor_nombre.message}</span>}
            </div>
            <div className="space-y-1 flex gap-2">
              <div className="w-1/3">
                <label className="text-xs font-bold uppercase text-muted-foreground">Tipo Doc</label>
                <select {...form.register("tipo_documento")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                  <option>C.C.</option>
                  <option>C.E.</option>
                  <option>PPT</option>
                </select>
              </div>
              <div className="w-2/3">
                <label className="text-xs font-bold uppercase text-muted-foreground">Número Doc</label>
                <input {...form.register("conductor_documento")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
                {form.formState.errors.conductor_documento && <span className="text-xs text-destructive">{form.formState.errors.conductor_documento.message}</span>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Clase Vehículo</label>
              <select {...form.register("clase_vehiculo")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                <option>Turbo</option>
                <option>Sencillo</option>
                <option>Doble Troque</option>
                <option>Camioneta</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Kilometraje</label>
              <input type="number" {...form.register("kilometraje")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Modalidad</label>
              <select {...form.register("modalidad")} className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                <option>Urbano</option>
                <option>Nacional</option>
                <option>Especial</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <Section title="Parte 1. Inspección Cabezote" namePrefix="cabezote" items={CABEZOTE_ITEMS} />

        {/* REMOLQUE TOGGLE */}
        <div className="rounded-xl mb-8 shadow overflow-hidden">
          <button
            type="button"
            onClick={() => form.setValue("aplica_remolque", !watchAplicaRemolque, { shouldDirty: true })}
            className="w-full flex justify-between items-center px-6 py-4 cursor-pointer"
            style={{ background: "linear-gradient(90deg, #6f1ab6 0%, #8e44ad 100%)" }}
          >
            <span className="font-bold text-white uppercase flex items-center gap-2 text-sm sm:text-base">
              <Link2 className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              ¿Aplica Inspección de Unidad de Remolque?
            </span>
            <span
              className="relative inline-flex items-center flex-shrink-0 ml-4 w-14 h-7 rounded-full transition-colors duration-200"
              style={{ backgroundColor: watchAplicaRemolque ? "#facc15" : "#4c1d95" }}
            >
              <span
                className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow transition-transform duration-200"
                style={{ left: watchAplicaRemolque ? "calc(100% - 25px)" : "3px" }}
              />
            </span>
          </button>
        </div>

        {watchAplicaRemolque && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <label className="text-sm font-bold text-amber-900 block mb-2">Número de Remolque</label>
              <input {...form.register("n_remolque")} className="w-full sm:w-1/3 p-2.5 bg-white border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <Section title="Inspección Remolque - Estructura" namePrefix="remolque_estructura" items={REMOLQUE_ESTRUCTURA_ITEMS} colorClass="bg-amber-500" />
            <Section title="Inspección Remolque - Luces" namePrefix="remolque_luces" items={REMOLQUE_LUCES_ITEMS} colorClass="bg-amber-500" />
          </div>
        )}

        {/* KIT DERRAMES TOGGLE */}
        <div className="rounded-xl mb-8 shadow overflow-hidden">
          <button
            type="button"
            onClick={() => form.setValue("aplica_kit_derrames", !watchAplicaKitDerrames, { shouldDirty: true })}
            className="w-full flex justify-between items-center px-6 py-4 cursor-pointer"
            style={{ background: "linear-gradient(90deg, #e67e22 0%, #d35400 100%)" }}
          >
            <span className="font-bold text-white uppercase flex items-center gap-2 text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              ¿Aplica Kit de Derrames para Mercancías Peligrosas?
            </span>
            <span
              className="relative inline-flex items-center flex-shrink-0 ml-4 w-14 h-7 rounded-full transition-colors duration-200"
              style={{ backgroundColor: watchAplicaKitDerrames ? "#facc15" : "#7c2d12" }}
            >
              <span
                className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow transition-transform duration-200"
                style={{ left: watchAplicaKitDerrames ? "calc(100% - 25px)" : "3px" }}
              />
            </span>
          </button>
        </div>

        {watchAplicaKitDerrames && (
          <div className="animate-in fade-in duration-300">
            <Section title="Kit de Derrames" namePrefix="kit_derrames" items={KIT_DERRAMES_ITEMS} colorClass="bg-orange-600" />
          </div>
        )}

        <Section title="Kit de Carretera" namePrefix="kit_carretera" items={KIT_CARRETERA_ITEMS} />
        <Section title="Verificación Botiquín" namePrefix="botiquin" items={BOTIQUIN_ITEMS} />
        <Section title="Verificación EPP" namePrefix="epp" items={EPP_ITEMS} />
        <Section title="Requisitos para el Despacho" namePrefix="requisitos_despacho" items={REQUISITOS_DESPACHO_ITEMS} />
        <Section title="Lista de Chequeo Documentos" namePrefix="documentos_carga" items={DOCS_CARGA_ITEMS} />

        {/* FOTOS */}
        <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-3 text-white font-bold tracking-wide uppercase text-sm" style={{ background: "linear-gradient(90deg, #0076b6, #0096d6)" }}>
            Registro Fotográfico
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {FOTOS_ITEMS.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <label className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-colors overflow-hidden group">
                  {photos[item] ? (
                    <img src={photos[item]} alt={item} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Camera className="w-6 h-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">{item}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoCapture(e, item)} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* OBSERVACIONES */}
        <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-3 text-white font-bold tracking-wide uppercase text-sm" style={{ background: "linear-gradient(90deg, #0076b6, #0096d6)" }}>
            Observaciones Generales
          </div>
          <div className="p-6">
            <textarea 
              {...form.register("observaciones")} 
              rows={4} 
              placeholder="Anota cualquier novedad o detalle importante aquí..."
              className="w-full p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>
        </div>

        {/* FIRMAS */}
        <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-3 text-white font-bold tracking-wide uppercase text-sm" style={{ background: "linear-gradient(90deg, #0076b6, #0096d6)" }}>
            Firmas de Responsabilidad
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Conductor */}
              <div className="flex flex-col items-center">
                <label className="font-bold mb-2">Firma Conductor</label>
                <div className="w-full h-40 border-2 border-dashed border-border rounded-xl bg-white relative overflow-hidden">
                  <SignatureCanvas 
                    ref={sigConductorRef} 
                    canvasProps={{ className: "w-full h-full cursor-crosshair" }} 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => sigConductorRef.current?.clear()} 
                  className="mt-2 text-xs text-muted-foreground hover:text-destructive flex items-center"
                >
                  <Eraser className="w-3 h-3 mr-1"/> Limpiar firma
                </button>
              </div>
              
              {/* Inspector */}
              <div className="flex flex-col items-center">
                <label className="font-bold mb-2">Firma Inspector</label>
                <div className="w-full h-40 border-2 border-dashed border-border rounded-xl bg-white relative overflow-hidden">
                  <SignatureCanvas 
                    ref={sigInspectorRef} 
                    canvasProps={{ className: "w-full h-full cursor-crosshair" }} 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => sigInspectorRef.current?.clear()} 
                  className="mt-2 text-xs text-muted-foreground hover:text-destructive flex items-center"
                >
                  <Eraser className="w-3 h-3 mr-1"/> Limpiar firma
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border flex justify-center z-40">
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full max-w-sm py-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-black text-lg shadow-xl shadow-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isPending ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save className="w-6 h-6" /> GUARDAR INSPECCIÓN FINAL</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
