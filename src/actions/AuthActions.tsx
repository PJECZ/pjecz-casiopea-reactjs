// src/actions/AuthActions.tsx
// Acciones relacionadas con autenticación: login, olvido de contraseña, registro, confirmación de cuenta

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


// --- LOGIN ---
export async function login(username: string, password: string) {
  const API_BASE = await getApiBase();
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

// --- Registro de usuario solicitud ---
export type RegistroUsuarioRequest = {
  nombres: string;
  apellido_primero: string;
  apellido_segundo: string;
  curp: string;
  telefono: string;
  email: string;
};

// --- Registro de usuario respuesta ---
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

// --- Registro de usuario funcion ---
export async function registrarUsuario(payload: RegistroUsuarioRequest): Promise<RegistroUsuarioResponse> {
  const API_BASE = await getApiBase();
  const res = await authFetch(`${API_BASE}/api/v5/cit_clientes_registros/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
}

// --- Olvido de contraseña solicitud ---
export async function forgotPassword(email: string) {
  const API_BASE = await getApiBase();
  const res = await authFetch(`${API_BASE}/api/v5/cit_clientes_recuperaciones/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Error al solicitar recuperación de contraseña');
  return res.json();
}

// --- Olvido de contraseña validar ---
export type RecuperacionValidarResponse = {
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

export async function forgotPasswordValidate(id: string, cadena_validar: string): Promise<RecuperacionValidarResponse> {
  const API_BASE = await getApiBase();
  const res = await authFetch(`${API_BASE}/api/v5/cit_clientes_recuperaciones/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ id, cadena_validar }),
  });
  
  let responseData;
  try {
    responseData = await res.json();
  } catch (jsonError) {
    throw new Error(`Error de respuesta del servidor: ${res.status} ${res.statusText}`);
  }
  
  if (!res.ok) {
    if (responseData && typeof responseData === 'object') {
      return responseData;
    }
    throw new Error(responseData?.message || `Error al validar recuperación de contraseña: ${res.status}`);
  }
  
  return responseData;
}

// --- Validar registro de usuario ---
export type ValidarUsuarioRequest = {
  id: string;
  cadena_validar: string;
};

// --- Validar registro de usuario respuesta ---
export type ValidarUsuarioResponse = RegistroUsuarioResponse;

// --- Validar registro de usuario funcion ---
export async function validarUsuario(payload: ValidarUsuarioRequest): Promise<ValidarUsuarioResponse> {
  const API_BASE = await getApiBase();
  const res = await authFetch(`${API_BASE}/api/v5/cit_clientes_registros/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al validar usuario');
  return res.json();
}

// --- Terminar registro de usuario ---
export type TerminarRegistroRequest = {
  id: string;
  cadena_validar: string;
  password: string;
};

export async function terminarRegistro(payload: TerminarRegistroRequest): Promise<RegistroUsuarioResponse> {
  const API_BASE = await getApiBase();
  const res = await authFetch(`${API_BASE}/api/v5/cit_clientes_registros/terminar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al terminar registro');
  return res.json();
}

// --- Terminar recuperación de contraseña ---
export type TerminarRecuperacionRequest = {
  id: string;
  cadena_validar: string;
  password: string;
};

export type TerminarRecuperacionResponse = {
  success: boolean;
  message: string;
};

export async function terminarRecuperacion(payload: TerminarRecuperacionRequest): Promise<TerminarRecuperacionResponse> {
  const API_BASE = await getApiBase();
  
  const res = await authFetch(`${API_BASE}/api/v5/cit_clientes_recuperaciones/terminar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  // Intentar obtener la respuesta JSON incluso si hay error HTTP
  let responseData;
  try {
    responseData = await res.json();
  } catch (jsonError) {
    throw new Error(`Error de respuesta del servidor: ${res.status} ${res.statusText}`);
  }
  
  // Si hay error HTTP pero tenemos datos JSON, usar esos datos
  if (!res.ok) {
    throw new Error(responseData?.message || `Error al terminar recuperación de contraseña: ${res.status}`);
  }
  
  return responseData;
}
