import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, Divider, Button, TextField,
  Avatar, CircularProgress, InputAdornment, IconButton,
} from "@mui/material";
import {
  KeyOutlined, CheckCircle, ErrorOutline, Visibility, VisibilityOff,
} from "@mui/icons-material";
import { terminarRegistro, terminarRecuperacion } from "../actions/AuthActions";

const CrearContrasena: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { id?: string; cadena_validar?: string; isRecuperacion?: boolean };
  const params = new URLSearchParams(location.search);
  const id = state?.id || params.get("id") || "";
  const cadena_validar = state?.cadena_validar || params.get("cadena_validar") || "";
  const isRecuperacion = state?.isRecuperacion || location.pathname.includes('recuperacion') ||
    document.referrer.includes('ConfirmarRecuperacion');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Estado: faltan parámetros ─────────────────────────────────────
  if (!id || !cadena_validar) {
    return (
      <Box sx={{ px: 2, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', overflow: 'hidden' }}>
        <Card elevation={0} sx={{ width: '100%', maxWidth: 620, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ px: 4, pt: 4, pb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#FCEBEB', color: '#A32D2D', width: 72, height: 72 }}>
              <ErrorOutline sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
              Error de validación
            </Typography>
            <Typography variant="h5" fontWeight={500} color="text.primary">
              Faltan datos de validación
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No se puede crear la contraseña sin los parámetros requeridos.
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ px: 4, py: 2.5 }}>
            <Button variant="outlined" fullWidth size="large" onClick={() => navigate("/")}
              sx={{ borderRadius: 2, fontWeight: 500, py: 1.5 }}>
              Ir al inicio
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMensaje("");
    setSuccess(null);
    if (!password || !confirmPassword) {
      setMensaje("Por favor ingresa y confirma tu contraseña.");
      setSuccess(false); setLoading(false); return;
    }
    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden.");
      setSuccess(false); setLoading(false); return;
    }
    try {
      const res = isRecuperacion
        ? await terminarRecuperacion({ id, cadena_validar, password })
        : await terminarRegistro({ id, cadena_validar, password });
      if (res.success) {
        setMensaje(res.message || (isRecuperacion ? "¡Contraseña recuperada exitosamente!" : "¡Contraseña creada exitosamente!"));
        setSuccess(true);
        setTimeout(() => navigate("/", { state: { id, cadena_validar } }), 2500);
      } else {
        setMensaje(res.message || "No se pudo crear la contraseña.");
        setSuccess(false);
      }
    } catch (err: any) {
      setMensaje(err.message || "Error inesperado.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Config visual por estado del avatar
  const avatarBg    = success === true ? '#EAF3DE' : success === false ? '#FCEBEB' : '#f5f5f5';
  const avatarColor = success === true ? '#3B6D11' : success === false ? '#A32D2D' : '#000';
  const avatarIcon  = success === true
    ? <CheckCircle sx={{ fontSize: 36 }} />
    : success === false
      ? <ErrorOutline sx={{ fontSize: 36 }} />
      : <KeyOutlined sx={{ fontSize: 36 }} />;

  return (
    <Box sx={{ px: 2, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', overflow: 'hidden' }}>
      <Card elevation={0} sx={{ width: '100%', maxWidth: 720, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* ── HEADER ── */}
        <Box sx={{ px: 4, pt: 4, pb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 72, height: 72 }}>
            {avatarIcon}
          </Avatar>
          <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {isRecuperacion ? 'Recuperación de contraseña' : 'Nuevo acceso'}
          </Typography>
          <Typography variant="h5" fontWeight={500} color="text.primary">
            {isRecuperacion ? 'Recuperar contraseña' : 'Crear nueva contraseña'}
          </Typography>
        </Box>

        {/* ── REQUISITOS ── */}
        <Divider />
        <Box sx={{ px: 4, py: 2, bgcolor: '#FAFDF0' }}>
          <Typography variant="body2" color="text.secondary">
            La contraseña debe tener de{' '}
            <Typography component="span" variant="body2" fontWeight={600} color="text.primary">
              8 a 24 caracteres
            </Typography>
            , al menos una letra, una mayúscula y un número.
          </Typography>
        </Box>

        {/* ── FORMULARIO ── */}
        <Divider />
        <Box sx={{ px: 4, py: 3 }} component="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={e => e.preventDefault()} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} onMouseDown={e => e.preventDefault()} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          />

          {/* Mensaje de resultado */}
          {mensaje && (
            <Box sx={{
              mt: 2,
              px: 2, py: 1.5,
              borderRadius: 2,
              bgcolor: success === true ? '#EAF3DE' : '#FCEBEB',
              border: `0.5px solid ${success === true ? '#97C459' : '#F09595'}`,
            }}>
              <Typography variant="body2" fontWeight={500} color={success === true ? '#3B6D11' : '#A32D2D'}>
                {mensaje}
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            startIcon={loading ? null : <KeyOutlined />}
            disabled={loading}
            sx={{ mt: 3, borderRadius: 2, bgcolor: '#000', color: '#fff', fontWeight: 500, py: 1.5, '&:hover': { bgcolor: '#222' } }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Crear contraseña'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CrearContrasena;