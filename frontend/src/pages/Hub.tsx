import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ClipboardCheck, Truck, LogOut, ChevronRight, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const modules = [
  {
    id: "preoperacional",
    href: "/preoperacional",
    icon: ClipboardCheck,
    title: "Inspección Preoperacional",
    description:
      "Registro y control de inspecciones preoperacionales de vehículos y equipos de la flota.",
    color: "from-blue-600 to-blue-800",
    accent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    badge: "Activo",
  },
  {
    id: "itr",
    href: "/itr",
    icon: Truck,
    title: "Inspección Técnica de ITR",
    description:
      "Protocolo de inspección fotográfica de contenedores para el reporte maestro de ITR.",
    color: "from-emerald-600 to-emerald-800",
    accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    badge: "Activo",
  },
];

export default function Hub() {
  const [, navigate] = useLocation();
  const { user, signOut } = useAuth();

  function handleLogout() {
    signOut();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo-safenode.png`}
              alt="SafeNode SAS"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden bg-primary/10 p-2 rounded-lg text-primary">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-display font-bold text-primary leading-tight">SafeNode</h1>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Plataforma Integral
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hola, <span className="font-medium text-foreground">{user?.displayName}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              Módulos Disponibles
            </h2>
            <p className="text-muted-foreground text-sm">
              Selecciona el módulo al que deseas acceder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {modules.map((mod, i) => (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => navigate(mod.href)}
                className="group relative bg-card border border-border rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-200 overflow-hidden"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mod.color} opacity-80`} />

                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3 rounded-xl border ${mod.accent}`}>
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    {mod.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {mod.description}
                </p>

                <div className="flex items-center text-xs font-semibold text-primary gap-1">
                  Abrir módulo
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4">
        SafeNode &copy; {new Date().getFullYear()} · Todos los derechos reservados
      </footer>
    </div>
  );
}
