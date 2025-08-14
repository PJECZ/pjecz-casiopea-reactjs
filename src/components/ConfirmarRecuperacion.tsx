// Componente para confirmar la recuperación de contraseña
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  Typography, 
  Button,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import { 
  CheckCircle,
  Error as ErrorIcon,
  Person,
  Email,
  Phone,
  BadgeOutlined,
  HomeFilled,
  KeyOutlined,
  AccessTime
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
    
    console.log('Parámetros de URL:', { id, cadena_validar });
    
    if (id && cadena_validar) {
      console.log('Llamando a forgotPasswordValidate con:', { id, cadena_validar });
      forgotPasswordValidate(id, cadena_validar)
        .then((res) => {
          console.log('Respuesta completa del servidor:', res);
          console.log('res.success:', res.success);
          console.log('res.data:', res.data);
          console.log('Tipo de res:', typeof res);
          console.log('Propiedades de res:', Object.keys(res));
          
          // Verificar si la respuesta tiene la estructura esperada
          if (res && typeof res === 'object') {
            if (res.success === true && res.data) {
              setUsuario(res.data);
              setMensaje(res.message || 'Recuperación validada exitosamente');
              console.log('Usuario establecido:', res.data);
            } else if (res.success === false) {
              setMensaje(res.message || 'No se pudo validar la recuperación');
              console.log('Validación falló:', res.message);
            } else {
              // Caso donde la respuesta no tiene la estructura esperada
              console.warn('Estructura de respuesta inesperada:', res);
              setMensaje('Respuesta del servidor en formato inesperado');
            }
          } else {
            console.error('Respuesta no es un objeto válido:', res);
            setMensaje('Respuesta inválida del servidor');
          }
        })
        .catch((err) => {
          console.error('Error en validación:', err);
          setMensaje(err.message || 'Error al validar la recuperación');
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      console.log('Parámetros faltantes - id:', id, 'cadena_validar:', cadena_validar);
      setMensaje('Parámetros inválidos');
      setCargando(false);
    }
  }, [searchParams]);

  const handleCrearContrasena = () => {
    if (!usuario) {
      alert('No hay datos de usuario disponibles.');
      return;
    }
    let id = usuario.id;
    let cadena = usuario.cadena_validar;
    if (!cadena) {
      cadena = searchParams.get('cadena_validar') || '';
    }
    console.log('NAVEGAR A CrearContrasena con:', { id, cadena_validar: cadena });
    if (!id || !cadena) {
      alert('Faltan datos para crear la contraseña.');
      return;
    }
    navigate('/CrearContrasena', { state: { id, cadena_validar: cadena } });
  };



  return (
    <Box sx={{ py: 6, px: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to right, #fff, #f5f5f5)' }}>
      <Card
        sx={{
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          p: 3,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
          <Avatar
            sx={{
              bgcolor: usuario ? 'success.light' : (cargando ? '#65815c' : 'error.light'),
              color: usuario ? 'success.dark' : (cargando ? '#fff' : 'error.dark'),
              width: 64,
              height: 64,
              mb: 2,
            }}
          >
            {cargando ? <AccessTime fontSize="large" /> : usuario ? <CheckCircle fontSize="large" /> : <ErrorIcon fontSize="large" />}
          </Avatar>
          <Typography
            variant="h5"
            align="center"
            color="text.primary"
            fontWeight={600}
            sx={{ color: usuario ? '#65815c' : (cargando ? '#65815c' : 'error.main') }}
          >
            {cargando ? 'Validando recuperación...' : usuario ? 'Confirmación de recuperación' : 'Error en validación'}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {cargando ? 'Por favor espera...' : mensaje}
        </Typography>

        <Box width="100%" mt={2} display="flex" flexDirection="column" gap={1}>
          {usuario ? (
            <Button
              variant="contained"
              onClick={() => handleCrearContrasena()}
              sx={{ borderRadius: 2, color: '#fff', backgroundColor: '#65815c', fontWeight: 600 }}
              fullWidth
              size="large"
              startIcon={<KeyOutlined />}
            >
              Crear nueva contraseña
            </Button>
          ) : !cargando && (
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              fullWidth
              size="large"
              startIcon={<HomeFilled />}
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
