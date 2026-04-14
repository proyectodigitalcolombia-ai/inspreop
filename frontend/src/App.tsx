import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Router, Route, Switch, Redirect } from "wouter";
  import { Toaster } from "@/components/ui/toaster";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { AuthProvider, useAuth } from "@/context/AuthContext";
  import { AppLayout } from "@/components/layout/AppLayout";

  import NuevaInspeccion from "@/pages/NuevaInspeccion";
  import Historial from "@/pages/Historial";
  import DetalleInspeccion from "@/pages/DetalleInspeccion";
  import Login from "@/pages/Login";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <>{children}</>;
  }

  function AppRoutes() {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");

    return (
      <Router base={base}>
        <Switch>
          <Route path="/login" component={Login} />

          <Route path="/preoperacional/historial">
            <ProtectedRoute>
              <AppLayout>
                <Historial />
              </AppLayout>
            </ProtectedRoute>
          </Route>

          <Route path="/preoperacional/historial/:id">
            <ProtectedRoute>
              <AppLayout>
                <DetalleInspeccion />
              </AppLayout>
            </ProtectedRoute>
          </Route>

          <Route path="/preoperacional/nueva">
            <AppLayout>
              <NuevaInspeccion />
            </AppLayout>
          </Route>

          <Route path="/">
            <Redirect to="/preoperacional/nueva" />
          </Route>

          <Route>
            <Redirect to="/preoperacional/nueva" />
          </Route>
        </Switch>
      </Router>
    );
  }

  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  export default App;
  