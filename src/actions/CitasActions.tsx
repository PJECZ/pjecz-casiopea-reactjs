
// Acciones relacionadas con citas: obtener, crear, cancelar

import { getApiBase } from '../config/apiConfig';

// Utilidad para fetch autenticado que maneja 401
export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sessionExpired'));
    }
    throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
  }
  return res;
}

// --- Tipo Distrito ---
export type Distrito = {
  clave: string;
  nombre: string;
  nombre_corto: string;
  es_distrito_judicial: boolean;
  es_distrito: boolean;
  es_jurisdiccional: boolean;
};

// --- Tipo Oficina ---
export type Oficina = {
  clave: string;
  descripcion: string;
  descripcion_corta: string;
  domicilio_clave: string;
  domicilio_completo: string;
  domicilio_edificio: string;
  es_jurisdiccional: boolean;
};

// --- Tipo Servicio ---
export type Servicio = {
  clave: string;
  descripcion: string;
};

// --- Tipo Oficina Servicio ---
export type OficinaServicio = {
  cit_servicio_clave: string;
  cit_servicio_descripcion: string;
  oficina_clave: string;
  oficina_descripcion: string;
  oficina_descripcion_corta: string;
};

// --- Api Base (ahora se obtiene dinámicamente) ---

// --- Funcion ---
function getToken() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('No se encontró token en localStorage');
    throw new Error('No hay token de autenticación');
  }
  return token;
}

// --- Tipo Cita ---
export type Cita = {
  id: string;
  cit_cliente_nombre: string;
  cit_servicio_clave: string;
  cit_servicio_descripcion: string;
  oficina_clave: string;
  oficina_descripcion: string;
  oficina_descripcion_corta: string;
  inicio: string;
  termino: string;
  notas: string;
  estado: string;
  asistencia: boolean;
  codigo_asistencia: string;
  codigo_acceso_imagen_base64: string;
  creado: string;
  puede_cancelarse: boolean;
};

// --- Tipo Crear Cita ---
export type CrearCitaRequest = {
  cit_servicio_clave: string;
  fecha: string; // formato: YYYY-MM-DD
  hora_minuto: string; // formato: HH:mm:ss
  oficina_clave: string;
  notas: string;
};

// --- Obtener todos los distritos ---
export async function getDistritos(): Promise<{ data: Distrito[] }> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(`${API_BASE}/api/v5/distritos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No se pudieron cargar distritos");
  return res.json();
}

// Obtener las oficinas filtradas por el distrito seleccionado --
export async function getOficinasFiltradas(distrito_clave: string): Promise<{ data: Oficina[] }> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(`${API_BASE}/api/v5/oficinas?distrito_clave=${distrito_clave}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No se pudieron cargar oficinas");
  return res.json();
}

// --- Obtener oficinas paginado ---
export async function getOficinasPaginado(limit = 10, offset = 0, domicilio_clave?: string, oficina_clave?: string) {
  const API_BASE = await getApiBase();
  const token = getToken();
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  if (domicilio_clave) params.append('domicilio_clave', domicilio_clave);
  if (oficina_clave) params.append('oficina_clave', oficina_clave);
  const res = await authFetch(`${API_BASE}/api/v5/oficinas?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('No se pudieron cargar las oficinas');
  return res.json();
}

// --- Obtener servicios ---
export async function getServicios(): Promise<{ data: Servicio[] }> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(`${API_BASE}/api/v5/cit_servicios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No se pudieron cargar servicios");
  return res.json() as Promise<{ data: Servicio[] }>;
}

// --- Obtener servicios por oficina ---
export async function getServiciosPorOficina(oficinaClave: string): Promise<OficinaServicio[]> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_oficinas_servicios?oficina_clave=${oficinaClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("No se pudieron cargar servicios por oficina");
  const data = await res.json();
  // Siempre retorna un array, ya sea data o el objeto completo
  return Array.isArray(data) ? data : (data.data || []);
}

// --- Obtener fechas disponibles ---
export async function getFechasDisponibles(oficinaClave: string, tramiteClave: string) {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_dias_disponibles?oficina=${oficinaClave}&tramite=${tramiteClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("No se pudieron cargar fechas disponibles");
  return res.json();
}

// --- Obtener horas disponibles ---
export async function getHorasDisponibles(oficinaClave: string, servicioClave: string, fecha: string) {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_horas_disponibles?fecha=${fecha}&oficina_clave=${oficinaClave}&cit_servicio_clave=${servicioClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("No se pudieron cargar horas disponibles");
  return res.json();
}

// --- Obtener citas ---
export async function getCitas(): Promise<Cita[]> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(`${API_BASE}/api/v5/cit_citas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudieron cargar citas');
  const data = await res.json();
  return data.data as Cita[];
}

// --- Crear cita ---
export async function createCita(cita: CrearCitaRequest): Promise<Cita> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(`${API_BASE}/api/v5/cit_citas/crear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cita),
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch (e) {
    console.error('Error parseando respuesta de createCita:', e);
  }
  if (!res.ok || !data.success) {
    console.error('Error en createCita:', data);
    throw new Error(data?.message || 'No se pudo crear la cita');
  }
  return data.data as Cita;
}

// --- Cancelar cita ---
export async function cancelarCita(citaId: string): Promise<Cita> {
  const API_BASE = await getApiBase();
  const token = getToken();
  const res = await authFetch(`${API_BASE}/api/v5/cit_citas/cancelar?cit_cita_id=${citaId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || 'No se pudo cancelar la cita');
  }
  return data.data as Cita;
}
