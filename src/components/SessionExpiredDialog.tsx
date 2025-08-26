// Componente de diálogo para mostrar cuando la sesión del usuario ha expirado
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccessTime } from '@mui/icons-material';

// Nombre del evento personalizado que indica expiración de sesión
const SESSION_EXPIRED_EVENT = 'sessionExpired';

// Componente funcional principal
const SessionExpiredDialog: React.FC = () => {
  // Estado para controlar la visibilidad del diálogo
  const [open, setOpen] = useState(false);
  // Estado para mostrar el loader mientras se cierra la sesión
  const [loading, setLoading] = useState(false);
  // Hook para redirección de rutas
  const navigate = useNavigate();

  // Efecto para suscribirse al evento de expiración de sesión
  useEffect(() => {
    // Handler que abre el diálogo cuando se dispara el evento
    const handler = () => setOpen(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, handler);
    // Limpieza del evento al desmontar el componente
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
  }, []);

  // Función que maneja el cierre del diálogo y la redirección al login
  const handleClose = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      navigate('/'); // Redirige al usuario a la pantalla de login
      // Asegura que el foco se mueve a un elemento visible fuera del modal
      setTimeout(() => {
        if (document.body) {
          document.body.focus();
        }
      }, 100);
    }, 1200);
  };


  // Renderizado del diálogo de sesión expirada
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="session-expired-dialog"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="center" mb={1}>
          <Avatar
            sx={{
              bgcolor: 'warning.light',
              color: 'warning.dark',
              width: 64,
              height: 64,
            }}
          >
            <AccessTime fontSize="large" />
          </Avatar>
        </Box>
        <Typography
          variant="h6"
          align="center"
          color="text.primary"
        >
          Sesión Expirada
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente para continuar.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: '#486238',
            '&:hover': {
              bgcolor: '#3a4f2d',
            },
            textTransform: 'none',
            px: 4,
            minWidth: 90,
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
