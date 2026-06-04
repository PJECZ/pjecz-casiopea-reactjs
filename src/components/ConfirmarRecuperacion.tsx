import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Button, Avatar, Divider,
} from '@mui/material';
import {
  CheckCircle, Error as ErrorIcon, HomeFilled, KeyOutlined, AccessTime,
} from '@mui/icons-material';
import { forgotPasswordValidate, RecuperacionValidarResponse } from '../actions/AuthActions';

const ConfirmarRecuperacion: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<RecuperacionValidarResponse['data'] | null>(null);
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get('id');
    const cadena_validar = searchParams.get('cadena_validar');
    if (id && cadena_validar) {
      forgotPasswordValidate(id, cadena_validar)
        .then((res) => {
          if (res && typeof res === 'object') {
            if (res.success === true && res.data) {
              setUsuario(res.data);
              setMensaje(res.message || 'Recuperación validada exitosamente');
            } else if (res.success === false) {
              const errorMsg = res.message || '';
              let mensajeDetallado = 'No se pudo validar la recuperación';
              if (errorMsg.includes('cadena')) mensajeDetallado = 'La cadena de validación es inválida o ha expirado';
              else if (errorMsg.includes('caracter')) mensajeDetallado = 'La cadena de validación contiene caracteres no válidos';
              else if (errorMsg.includes('expirado')) mensajeDetallado = 'La cadena de validación ha expirado';
              else if (errorMsg.includes('formato')) mensajeDetallado = 'La cadena de validación tiene un formato inválido';
              else mensajeDetallado = res.message || 'No se pudo validar la recuperación';
              setMensaje(mensajeDetallado);
            }
          } else {
            setMensaje('Respuesta inválida del servidor');
          }
        })
        .catch((err) => setMensaje(err.message || 'Error al validar la recuperación'))
        .finally(() => setCargando(false));
    } else {
      setMensaje('Parámetros inválidos o enlace incompleto');
      setCargando(false);
    }
  }, [searchParams]);

  const handleCrearContrasena = () => {
    if (!usuario) { alert('No hay datos de usuario disponibles.'); return; }
    const id = usuario.id;
    const cadena = usuario.cadena_validar || searchParams.get('cadena_validar') || '';
    if (!id || !cadena) { alert('Faltan datos para crear la contraseña.'); return; }
    navigate('/CrearContrasena', { state: { id, cadena_validar: cadena, isRecuperacion: true } });
  };

  // ── CONFIGURACION VISUAL POR ESTADO ──────────────────────────────────────
  const avatarBg    = cargando ? '#f5f5f5' : usuario ? '#EAF3DE' : '#FCEBEB';
  const avatarColor = cargando ? '#888'    : usuario ? '#3B6D11' : '#A32D2D';
  const etiqueta    = cargando ? ''        : usuario ? 'Enlace verificado' : 'Error de validación';
  const titulo      = cargando
    ? 'Validando recuperación...'
    : usuario ? 'Confirmación de recuperación' : 'Error en validación';
  const icono = cargando
    ? <AccessTime sx={{ fontSize: 36 }} />
    : usuario
      ? <CheckCircle sx={{ fontSize: 36 }} />
      : <ErrorIcon sx={{ fontSize: 36 }} />;

  // ─────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        px: 2,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        overflow: 'hidden',
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 620,
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* ── HEADER ── */}
        <Box
          sx={{
            px: 4, pt: 4, pb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            textAlign: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 72, height: 72 }}>
            {icono}
          </Avatar>

          {etiqueta && (
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}
            >
              {etiqueta}
            </Typography>
          )}

          <Typography variant="h5" fontWeight={500} color="text.primary">
            {titulo}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {cargando ? 'Por favor espera...' : mensaje}
          </Typography>
        </Box>

        {/* ── BOTÓN ── */}
        <Divider />
        <Box sx={{ px: 4, py: 2.5 }}>
          {usuario ? (
            <Button
              variant="contained"
              onClick={handleCrearContrasena}
              fullWidth
              size="large"
              startIcon={<KeyOutlined />}
              sx={{
                borderRadius: 2,
                bgcolor: '#000',
                color: '#fff',
                fontWeight: 500,
                py: 1.5,
                '&:hover': { bgcolor: '#222' },
              }}
            >
              Crear nueva contraseña
            </Button>
          ) : !cargando && (
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              fullWidth
              size="large"
              startIcon={<HomeFilled />}
              sx={{ borderRadius: 2, fontWeight: 500, py: 1.5 }}
            >
              Ir al inicio
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ConfirmarRecuperacion;