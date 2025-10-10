// src/config/apiConfig.ts
// Configuración centralizada para API_BASE con múltiples opciones

/**
 * Lista de posibles URLs base para la API, ordenadas por prioridad
 * Se obtienen desde variables de entorno (.env)
 */
const API_BASE_OPTIONS = [
  process.env.REACT_APP_API_URL_BASE,
].filter((url): url is string => !!url); // Filtrar valores undefined/null

/* URL base actual para la API (se determina dinámicamente) */
let currentApiBase: string | null = null;

/* Cache para evitar múltiples verificaciones de conectividad */
let lastCheckTime = 0;
const CACHE_DURATION = parseInt(process.env.REACT_APP_API_CACHE_DURATION || '300000', 10);

/* Verifica si una URL base está disponible */
async function checkApiAvailability(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = parseInt(process.env.REACT_APP_API_TIMEOUT || '3000', 10);
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
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

/* Encuentra la primera URL base disponible de la lista */
async function findAvailableApiBase(): Promise<string> {
  const now = Date.now();
  
  // Si tenemos un API_BASE válido y el cache no ha expirado, usarlo
  if (currentApiBase && (now - lastCheckTime) < CACHE_DURATION) {
    return currentApiBase;
  }

  
  for (const baseUrl of API_BASE_OPTIONS) {
    if (await checkApiAvailability(baseUrl)) {
      currentApiBase = baseUrl;
      lastCheckTime = now;
      return baseUrl;
    }
  }

  /* Si ninguna URL está disponible, usar la primera como fallback */
  console.warn('Ninguna API disponible, usando fallback:', API_BASE_OPTIONS[0]);
  currentApiBase = API_BASE_OPTIONS[0];
  lastCheckTime = now;
  return API_BASE_OPTIONS[0];
}

/* Obtiene la URL base de la API (con detección automática) */
export async function getApiBase(): Promise<string> {
  return await findAvailableApiBase();
}

/* Obtiene la URL base de la API de forma síncrona y usa el último valor conocido o el fallback si no hay ninguno */
export function getApiBaseSync(): string {
  return currentApiBase || API_BASE_OPTIONS[0];
}
/* Fuerza una nueva verificación de disponibilidad */
export async function refreshApiBase(): Promise<string> {
  lastCheckTime = 0; /* Invalida el cache */
  return await getApiBase();
}

/* Permite agregar nuevas opciones de API_BASE dinámicamente */
export function addApiBaseOption(baseUrl: string): void {
  if (!API_BASE_OPTIONS.includes(baseUrl)) {
    API_BASE_OPTIONS.unshift(baseUrl); // Agregar al inicio (mayor prioridad)
  }
}

/* Obtiene todas las opciones disponibles */
export function getApiBaseOptions(): string[] {
  return [...API_BASE_OPTIONS];
}

/* Inicializar la detección automática al cargar el módulo */
findAvailableApiBase().catch(console.error);

/**
 * Objeto request con métodos HTTP similares a axios pero usando Fetch API
 */
const request = {
  /**
   * GET request sin autenticación
   */
  get: async (url: string) => {
    const baseUrl = await getApiBase();
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * GET request con autenticación
   */
  getAuth: async (url: string, token?: string) => {
    const baseUrl = await getApiBase();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * GET request con parámetros y autenticación
   */
  getParams: async (url: string, params?: Record<string, any>, token?: string) => {
    const baseUrl = await getApiBase();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Construir query string desde params
    let fullUrl = `${baseUrl}${url}`;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * POST request con autenticación
   */
  post: async (url: string, body?: any, token?: string) => {
    const baseUrl = await getApiBase();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * PUT request con autenticación
   */
  put: async (url: string, body?: any, token?: string) => {
    const baseUrl = await getApiBase();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * DELETE request con autenticación
   */
  delete: async (url: string, token?: string) => {
    const baseUrl = await getApiBase();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};

export default request;
