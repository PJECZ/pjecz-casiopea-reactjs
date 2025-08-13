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
import { forgotPasswordValidate } from '../actions/AuthActions';


const ConfirmarRecuperacion: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get('id');
    const cadena_validar = searchParams.get('cadena_validar');
    
    if (id && cadena_validar) {
      forgotPasswordValidate(id, cadena_validar)
        .then((res) => {
          if (res.success) {
            setUsuario(res.data);
            setMensaje(res.message || 'Recuperación validada exitosamente');
          } else {
            setMensaje(res.message || 'No se pudo validar la recuperación');
          }
        })
        .catch((err) => {
          setMensaje(err.message || 'Error al validar la recuperación');
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      setMensaje('Parámetros inválidos');
      setCargando(false);
    }
  }, [searchParams]);

  const handleCrearContrasena = () => {
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
        {usuario && (
          <Box mb={2} width="100%">
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#65815c', mb: 1, textAlign: 'center' }}>Datos del usuario:</Typography>
            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={1}>
              <Grid size={12}>
                <Typography variant="body2"><Person sx={{ verticalAlign: 'middle', mr: 1 }} /> {usuario.nombres} {usuario.apellido_primero} {usuario.apellido_segundo}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2"><Email sx={{ verticalAlign: 'middle', mr: 1 }} /> {usuario.email}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2"><BadgeOutlined sx={{ verticalAlign: 'middle', mr: 1 }} /> {usuario.curp}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2"><Phone sx={{ verticalAlign: 'middle', mr: 1 }} /> {usuario.telefono}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
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
