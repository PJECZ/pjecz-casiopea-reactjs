import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Card, Divider, Grid, Button, Badge, Avatar } from "@mui/material";
import { validarUsuario } from "../actions/AuthActions";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import { AccessTime, BadgeOutlined, CheckCircle, Email, Key, KeyOutlined, Person, Phone } from "@mui/icons-material";

const ConfirmarRegistro: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [usuario, setUsuario] = useState<any>(null);

  /* Mostrar datos de usuario al obtener el id y cadena_validar desde el enlace  y funcion confirmarCuenta */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const cadena_validar = params.get("cadena_validar");
    if (id && cadena_validar) {
      validarUsuario({ id, cadena_validar })
        .then((res) => {
          if (res.success) {
            setUsuario(res.data);
            setMensaje(res.message || "Cuenta validada exitosamente");
          } else {
            setMensaje(res.message || "No se pudo validar la cuenta");
          }
        })
        .catch((err) => {
          setMensaje(err.message || "Error al validar la cuenta");
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      setMensaje("Parámetros inválidos");
      setCargando(false);
    }
  }, [location.search]);

  return (
    <Box sx={{ py: 6, px: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to right, #fff, #f5f5f5)' }}>   
      <Card
        sx={{
          maxWidth: 650,
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to right, #fff, #f5f5f5)',
          p: 3,
          mt: 2
        }}
      >
        <Box textAlign="center" mb={2}>
          <Avatar
          sx={{
            bgcolor: '#65815c',
            color: '#fff',
            width: 64,
            height: 64,
          }}
          >
            <CheckCircle fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight={600} sx={{ color: '#65815c', mb: 1 }}>
            Confirmación de registro
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Box textAlign="center" mb={2}>
          <Typography variant="body1" sx={{ color: cargando ? '#65815c' : (usuario ? '#363636' : 'error.main'), fontWeight: 500, fontSize: '1.1rem' }}>
            {cargando ? "Validando..." : mensaje}
          </Typography>
        </Box>
        {usuario && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#65815c', mb: 1 }}>Datos del usuario:</Typography>
            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={1}>
              <Grid size={12}>
                <Typography variant="body2"><Person /> {usuario.nombres} {usuario.apellido_primero} {usuario.apellido_segundo}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><Email /> {usuario.email}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><BadgeOutlined /> {usuario.curp}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><Phone /> {usuario.telefono}</Typography>
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              onClick={() => navigate('/CrearContrasena')} 
              sx={{ mt: 2, borderRadius: 2, color: '#fff', backgroundColor: '#65815c' }} 
              fullWidth 
              size="large"
              startIcon={<KeyOutlined />}
            >
              Crear contraseña
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ConfirmarRegistro;
