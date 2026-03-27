import { Link, useLocation } from "wouter";
import { ClipboardCheck, History, PlusCircle, ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/preoperacional", label: "Dashboard", icon: ClipboardCheck },
    { href: "/preoperacional/nueva", label: "Nueva Inspección", icon: PlusCircle },
    { href: "/preoperacional/historial", label: "Historial", icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: back to hub + logo */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mr-1"
                title="Volver a módulos"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Módulos</span>
              </Link>
              <div className="w-px h-5 bg-border" />
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
                <h1 className="text-lg font-display text-primary leading-tight">SafeNode</h1>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Inspección Preoperacional
                </p>
              </div>
            </div>

            {/* Right: nav + user */}
            <div className="flex items-center gap-2">
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      location === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-2 ml-3 pl-3 border-l border-border">
                <span className="text-xs text-muted-foreground">{user?.displayName}</span>
                <button
                  onClick={signOut}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
