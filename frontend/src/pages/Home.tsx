import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, History, ClipboardList, ChevronRight, Truck, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiListarInspecciones } from "@/lib/api";

export default function Home() {
  const { data: inspecciones, isLoading } = useQuery({
    queryKey: ['/api/inspecciones/historial'],
    queryFn: apiListarInspecciones,
  });

  const recentInspections = inspecciones?.slice(0, 5) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Truck className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
            Inspección Preoperacional
          </h1>
          <p className="text-primary-foreground/80 max-w-xl text-lg mb-8">
            Control y registro de estado de vehículos, equipos y documentación para despachos seguros.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/preoperacional/nueva"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Inspección
            </Link>
            <Link
              href="/preoperacional/historial"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-foreground/10 text-white font-semibold backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <History className="w-5 h-5 mr-2" />
              Ver Historial
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Actividad Reciente</h2>
          </div>
          <Link href="/preoperacional/historial" className="text-sm font-semibold text-primary hover:underline">
            Ver todas
          </Link>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : recentInspections.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Sin inspecciones</h3>
              <p className="text-muted-foreground max-w-sm">No hay registros recientes. Crea una nueva para comenzar.</p>
              <Link
                href="/preoperacional/nueva"
                className="mt-6 inline-flex px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
              >
                Crear primera inspección
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentInspections.map((insp, i) => (
                <motion.div 
                  key={insp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/preoperacional/inspeccion/${insp.id}`}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-secondary border border-border text-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(insp.fecha), "MMM", { locale: es })}</span>
                        <span className="text-lg font-black text-foreground leading-none">{format(new Date(insp.fecha), "dd")}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                          {insp.vehiculo_placa}
                          <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                            {insp.clase_vehiculo}
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <span className="truncate max-w-[150px] sm:max-w-none">{insp.conductor_nombre}</span>
                          <span className="text-border">•</span>
                          <span>Manifiesto: {insp.manifiesto}</span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
