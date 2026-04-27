import axios from "axios";

/**
 * Centralizo la configuración de Axios para no repetir la URL base en cada petición.
  * para facilitar el despliegue entre ambientes (dev, staging, prod).
 */
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  // Implementaré el timeout y los headers de Auth aquí una vez
  // que defini la política de persistencia del token.
});

/**
 * Exporto la instancia personalizada en lugar del paquete por defecto.
 * Esto me permite inyectar interceptores de respuesta globalmente
 * para manejar errores 401 o 500 en un solo punto más adelante.
 */
export default api;
