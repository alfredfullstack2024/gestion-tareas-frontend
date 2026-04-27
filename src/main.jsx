import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

/**
 * Instancio el cliente de Query aquí para centralizar la gestión de caché.
 * Pendiente: Evaluar si el equipo necesita 'staleTime' global para reducir
 * la carga al backend, por ahora dejo los defaults.
 */
const queryClient = new QueryClient();

// React 18: Uso createRoot para aprovechar el renderizado concurrente y transiciones.
ReactDOM.createRoot(document.getElementById("root")).render(
  /**
   * Mantengo el StrictMode en desarrollo para forzar la detección de
   * efectos colaterales y asegurar que el código sea compatible con
   * el futuro renderizado asíncrono de React.
   */
  <React.StrictMode>
    {/* Provider de TanStack al nivel más alto. 
        Decidí desacoplar el estado del servidor de la UI desde el inicio 
        para evitar inflar el Context API o Redux con datos de API.
    */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
