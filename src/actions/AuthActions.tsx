// src/actions/AuthActions.tsx
// Acciones relacionadas con autenticación: login, olvido de contraseña, registro, confirmación de cuenta

const API_BASE = "http://172.30.14.65:8001";

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
  const res = await fetch(`${API_BASE}/api/v5/cit_clientes_registros/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
}

// --- Olvido de contraseña solicitud ---
export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/api/v5/cit_clientes_recuperaciones/solicitar`, {
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
  const res = await fetch(`${API_BASE}/api/v5/cit_clientes_recuperaciones/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ id, cadena_validar }),
  });
  if (!res.ok) throw new Error('Error al validar recuperación de contraseña');
  return res.json();
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
  const res = await fetch(`${API_BASE}/api/v5/cit_clientes_registros/validar`, {
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
  const res = await fetch(`${API_BASE}/api/v5/cit_clientes_registros/terminar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al terminar registro');
  return res.json();
}
