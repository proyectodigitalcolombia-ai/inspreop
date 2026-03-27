import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Trash2, FileText, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiListarInspecciones, apiEliminarInspeccion } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Historial() {
  const [placaFilter, setPlacaFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inspecciones, isLoading } = useQuery({
    queryKey: ['/api/inspecciones/historial'],
    queryFn: apiListarInspecciones,
  });

  const { mutate: deleteInsp, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => apiEliminarInspeccion(id),
    onSuccess: () => {
      toast({ title: "Inspección eliminada", description: "El registro se eliminó correctamente." });
      queryClient.invalidateQueries({ queryKey: ['/api/inspecciones/historial'] });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar el registro.", variant: "destructive" });
    }
  });

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta inspección? Esta acción no se puede deshacer.")) {
      deleteInsp(id);
    }
  };

  const filtered = inspecciones?.filter(i => 
    !placaFilter || i.vehiculo_placa.toLowerCase().includes(placaFilter.toLowerCase())
  ) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Historial de Inspecciones</h1>
          <p className="text-muted-foreground text-sm">Consulta, filtra y gestiona los registros preoperacionales.</p>
        </div>
        <Link
          href="/preoperacional/nueva"
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap shadow-md shadow-primary/20"
        >
          Nueva Inspección
        </Link>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por placa..." 
            value={placaFilter}
            onChange={e => setPlacaFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-background hover:bg-muted text-foreground transition-colors font-medium">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Vehículo</th>
                <th className="px-6 py-4">Conductor</th>
                <th className="px-6 py-4">Manifiesto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No se encontraron inspecciones con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map(insp => (
                  <tr key={insp.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{format(new Date(insp.fecha), "dd MMM yyyy", { locale: es })}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{insp.vehiculo_placa}</div>
                      <div className="text-xs text-muted-foreground">{insp.clase_vehiculo}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      {insp.conductor_nombre}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {insp.manifiesto}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/preoperacional/inspeccion/${insp.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(insp.id)}
                          disabled={isDeleting}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
