import Projects from "./pages/Projects";

/**
 * App actúa como el Layout raíz de la aplicación.
 * Por ahora solo renderizo Projects, pero aquí es donde inyectaré
 * el Router (react-router-dom) y los Providers de contexto globales
 * conforme la arquitectura escale.
 */
function App() {
  // Mantengo el componente puro y sin lógica de estado para
  // facilitar el testing y la legibilidad del árbol de componentes.
  return <Projects />;
}

export default App;
