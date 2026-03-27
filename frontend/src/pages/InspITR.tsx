import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ITR_URL = "https://webservice-itr.onrender.com/inspeccion.html";

export default function InspITR() {
  const { user, signOut } = useAuth();
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Módulos</span>
            </Link>

            <div className="w-px h-4 bg-border shrink-0" />

            <div className="flex items-center gap-2 min-w-0">
              <img
                src={`${import.meta.env.BASE_URL}logo-safenode.png`}
                alt="SafeNode"
                className="h-6 w-auto object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden bg-primary/10 p-1.5 rounded text-primary shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight truncate">
                  Inspección Técnica de ITR
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setKey((k) => k + 1); setLoading(true); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Recargar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={ITR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nueva pestaña</span>
            </a>
            <div className="w-px h-4 bg-border" />
            <button
              onClick={signOut}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted hidden sm:block"
            >
              Cerrar sesión
            </button>
            <span className="text-xs text-muted-foreground hidden md:block">
              {user?.displayName}
            </span>
          </div>
        </div>
      </header>

      {/* Iframe container */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 gap-4">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Cargando módulo ITR...</p>
          </div>
        )}
        <iframe
          key={key}
          src={ITR_URL}
          className="w-full h-full border-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
          onLoad={() => setLoading(false)}
          title="Inspección Técnica de ITR"
          allow="camera; geolocation; microphone"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        />
      </div>
    </div>
  );
}
