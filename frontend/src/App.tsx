import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Login from "@/pages/Login";
import Hub from "@/pages/Hub";
import Home from "@/pages/Home";
import Historial from "@/pages/Historial";
import NuevaInspeccion from "@/pages/NuevaInspeccion";
import DetalleInspeccion from "@/pages/DetalleInspeccion";
import InspITR from "@/pages/InspITR";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Hub} />

      <Route path="/preoperacional">
        <AppLayout>
          <Home />
        </AppLayout>
      </Route>
      <Route path="/preoperacional/nueva">
        <AppLayout>
          <NuevaInspeccion />
        </AppLayout>
      </Route>
      <Route path="/preoperacional/historial">
        <AppLayout>
          <Historial />
        </AppLayout>
      </Route>
      <Route path="/preoperacional/inspeccion/:id">
        {() => (
          <AppLayout>
            <DetalleInspeccion />
          </AppLayout>
        )}
      </Route>

      <Route path="/itr" component={InspITR} />

      <Route path="/nueva">
        <Redirect to="/preoperacional/nueva" />
      </Route>
      <Route path="/historial">
        <Redirect to="/preoperacional/historial" />
      </Route>
      <Route path="/inspeccion/:id">
        {(params) => <Redirect to={`/preoperacional/inspeccion/${params.id}`} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
