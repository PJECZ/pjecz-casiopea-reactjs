// src/services/api.ts
// Servicio para conectar con la API REST en 172.30.14.65:8001


const API_BASE = "http://172.30.14.65:8001";

// Utilidad para fetch autenticado que maneja 401
export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    localStorage.removeItem('access_token');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sessionExpired'));
    }
    throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
  }
  return res;
}


// --- REGISTRO USUARIO ---
export type RegistroUsuarioRequest = {
  nombres: string;
  apellido_primero: string;
  apellido_segundo: string;
  curp: string;
  telefono: string;
  email: string;
};

export type RegistroUsuarioResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    nombres: string;
    apellido_primero: string;
    apellido_segundo: string;
    curp: string;
    telefono: string;
    email: string;
    expiracion: string;
    cadena_validar: string;
    mensajes_cantidad: number;
    ya_registrado: boolean;
    creado: string;
  };
};

export async function registrarUsuario(payload: RegistroUsuarioRequest): Promise<RegistroUsuarioResponse> {
  const res = await fetch(`${API_BASE}/api/v5/cit_clientes_registros/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
}

// --- LOGIN ---
export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await fetch(`${API_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// Tipos para la API
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
  codigo_acceso_imagen_base64: string; // <-- Agregado para compatibilidad con la API
  creado: string;
  puede_cancelarse: boolean;
};

// --- TIPOS OFICINA ---
export type Oficina = {
  clave: string;
  descripcion: string;
  domicilio_clave: string;
};

// --- TIPOS TRAMITE ---
export type Tramite = {
  clave: string;
  descripcion: string;
};

// --- TIPOS SERVICIO ---
export type Servicio = {
  clave: string;
  descripcion: string;
};

// --- OBTENER OFICINAS ---
export async function getOficinas(token: string, oficina_clave?: string): Promise<{ data: Oficina[] }> {
  const params = new URLSearchParams();
  if (oficina_clave) params.append('oficina_clave', oficina_clave);

  const res = await authFetch(`${API_BASE}/api/v5/oficinas?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar oficinas");
  return res.json();
}

// --- OBTENER SERVICIOS ---
export async function getServicios(token: string): Promise<{ data: Servicio[] }> {
  const res = await authFetch(`${API_BASE}/api/v5/cit_servicios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar servicios");
  return res.json() as Promise<{ data: Servicio[] }>;
}

// --- OBTENER SERVICIOS POR OFICINA ---
export type OficinaServicio = {
  cit_servicio_clave: string;
  cit_servicio_descripcion: string;
  oficina_clave: string;
  oficina_descripcion: string;
  oficina_descripcion_corta: string;
};

export async function getServiciosPorOficina(token: string, oficinaClave: string): Promise<OficinaServicio[]> {
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_oficinas_servicios?oficina_clave=${oficinaClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Error al cargar servicios por oficina');
  const data = await res.json();
  return data.data as OficinaServicio[];
}

// --- OBTENER SERVICIOS POR CATEGORÍA/OFICINA ---
export async function getServiciosPorCategoria(token: string, categoriaClave: string): Promise<Servicio[]> {
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_servicios?cit_categoria_clave=${categoriaClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Error al cargar servicios');
  return res.json().then(data => data.data as Servicio[]);
}

// --- OBTENER CITAS ---
export async function getCitas(token: string): Promise<Cita[]> {
  const res = await authFetch(`${API_BASE}/api/v5/cit_citas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar citas');
  const data = await res.json();
  return data.data as Cita[];
}

// --- CREAR CITA ---
export type CrearCitaRequest = {
  cit_servicio_clave: string;
  fecha: string; // formato: YYYY-MM-DD
  hora_minuto: string; // formato: HH:mm:ss
  oficina_clave: string;
  notas: string;
};

export async function createCita(token: string, cita: CrearCitaRequest): Promise<Cita> {
  const res = await fetch(`${API_BASE}/api/v5/cit_citas/crear`, {
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

// --- CANCELAR CITA ---
export async function cancelarCita(token: string, citaId: string): Promise<Cita> {
  const res = await fetch(`${API_BASE}/api/v5/cit_citas/cancelar?cit_cita_id=${citaId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || 'Error al cancelar la cita');
  }
  return data.data as Cita;
}

// --- OBTENER FECHAS DISPONIBLES ---
export async function getFechasDisponibles(token: string, oficinaClave: string, tramiteClave: string) {
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_dias_disponibles?oficina=${oficinaClave}&tramite=${tramiteClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Error al cargar fechas disponibles");
  return res.json();
}

// --- OBTENER HORAS DISPONIBLES ---
export async function getHorasDisponibles(token: string, oficinaClave: string, servicioClave: string, fecha: string) {
  const res = await authFetch(
    `${API_BASE}/api/v5/cit_horas_disponibles?fecha=${fecha}&oficina_clave=${oficinaClave}&cit_servicio_clave=${servicioClave}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Error al cargar horas disponibles");
  return res.json();
}

// --- OBTENER OFICINAS PAGINADAS ---
export async function getOficinasPaginado(token: string, limit = 10, offset = 0, domicilio_clave?: string, oficina_clave?: string) {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  if (domicilio_clave) params.append('domicilio_clave', domicilio_clave);
  if (oficina_clave) params.append('oficina_clave', oficina_clave);

  const res = await authFetch(`${API_BASE}/api/v5/oficinas?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('No se pudieron cargar las oficinas');
  return res.json(); // Retorna el objeto completo (con data, total, etc)
}

