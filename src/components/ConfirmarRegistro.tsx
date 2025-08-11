import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Card, Divider, Grid, Button } from "@mui/material";
import { validarUsuario } from "../actions/AuthActions";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import { KeyOutlined } from "@mui/icons-material";

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
          maxWidth: 450,
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to right, #fff, #f5f5f5)',
          p: 3,
          mt: 2
        }}
      >
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" fontWeight={600} sx={{ color: '#486238', mb: 1 }}>
            Confirmación de registro
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Box textAlign="center" mb={2}>
          <Typography variant="body1" sx={{ color: cargando ? '#65815c' : (usuario ? '#486238' : 'error.main'), fontWeight: 500, fontSize: '1.1rem' }}>
            {cargando ? "Validando..." : mensaje}
          </Typography>
        </Box>
        {usuario && (
          <Box sx={{ mb: 3, p:2, border: '1px solid #d3e0d1', borderRadius: 2, background: '#f7faf5', boxShadow: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#65815c', mb: 1 }}>Datos del usuario:</Typography>
            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={1}>
              <Grid size={12}>
                <Typography variant="body2"><b>Nombre:</b> {usuario.nombres} {usuario.apellido_primero} {usuario.apellido_segundo}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><b>Correo:</b> {usuario.email}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><b>CURP:</b> {usuario.curp}</Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>
              <Grid size={12}>
                <Typography variant="body2"><b>Teléfono:</b> {usuario.telefono}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><b>ID:</b> {usuario.id}</Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/CrearContrasena')} 
              sx={{ mt: 2, borderRadius: 2 }} 
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
