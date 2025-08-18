// src/config/apiConfig.ts
// Configuración centralizada para API_BASE con múltiples opciones

/**
 * Lista de posibles URLs base para la API, ordenadas por prioridad
 */
const API_BASE_OPTIONS = [
  "http://172.30.14.65:8001",
  "http://carranza:8001",
  "http://127.0.0.1:8001",
  "http://localhost:8001", 
  // Agregar más opciones según sea necesario
];

/**
 * URL base actual para la API (se determina dinámicamente)
 */
let currentApiBase: string | null = null;

/**
 * Cache para evitar múltiples verificaciones de conectividad
 */
let lastCheckTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Verifica si una URL base está disponible
 */
async function checkApiAvailability(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
    
    const response = await fetch(`${baseUrl}/docs`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    return response.ok || response.status === 404; // 404 también indica que el servidor responde
  } catch (error) {
    console.debug(`API no disponible en ${baseUrl}:`, error);
    return false;
  }
}

/**
 * Encuentra la primera URL base disponible de la lista
 */
async function findAvailableApiBase(): Promise<string> {
  const now = Date.now();
  
  // Si tenemos un API_BASE válido y el cache no ha expirado, usarlo
  if (currentApiBase && (now - lastCheckTime) < CACHE_DURATION) {
    return currentApiBase;
  }

  console.log('Verificando disponibilidad de APIs...');
  
  for (const baseUrl of API_BASE_OPTIONS) {
    console.debug(`Verificando ${baseUrl}...`);
    if (await checkApiAvailability(baseUrl)) {
      console.log(`✅ API disponible en: ${baseUrl}`);
      currentApiBase = baseUrl;
      lastCheckTime = now;
      return baseUrl;
    }
  }

  // Si ninguna URL está disponible, usar la primera como fallback
  console.warn('⚠️ Ninguna API disponible, usando fallback:', API_BASE_OPTIONS[0]);
  currentApiBase = API_BASE_OPTIONS[0];
  lastCheckTime = now;
  return API_BASE_OPTIONS[0];
}

/**
 * Obtiene la URL base de la API (con detección automática)
 */
export async function getApiBase(): Promise<string> {
  return await findAvailableApiBase();
}

/**
 * Obtiene la URL base de la API de forma síncrona
 * Usa el último valor conocido o el fallback si no hay ninguno
 */
export function getApiBaseSync(): string {
  return currentApiBase || API_BASE_OPTIONS[0];
}

/**
 * Fuerza una nueva verificación de disponibilidad
 */
export async function refreshApiBase(): Promise<string> {
  lastCheckTime = 0; // Invalida el cache
  return await getApiBase();
}

/**
 * Permite agregar nuevas opciones de API_BASE dinámicamente
 */
export function addApiBaseOption(baseUrl: string): void {
  if (!API_BASE_OPTIONS.includes(baseUrl)) {
    API_BASE_OPTIONS.unshift(baseUrl); // Agregar al inicio (mayor prioridad)
    console.log(`Nueva opción de API agregada: ${baseUrl}`);
  }
}

/**
 * Obtiene todas las opciones disponibles
 */
export function getApiBaseOptions(): string[] {
  return [...API_BASE_OPTIONS];
}

// Inicializar la detección automática al cargar el módulo
findAvailableApiBase().catch(console.error);
