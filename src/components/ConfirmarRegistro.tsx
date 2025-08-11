import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { validarUsuario } from "../actions/AuthActions";

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
    <Box sx={{ mt: 6, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6" align="center" mb={2} fontWeight="bold" sx={{ color: '#65815c', fontSize: '1.5rem' }}>
        Confirmación de registro
      </Typography>
      <Typography variant="body1" align="center" mb={2} sx={{ color: '#65815c', fontSize: '1rem' }}>
        {cargando ? "Validando..." : mensaje}
      </Typography>

      {/* Mostrar datos del usuario si existen */}
      {usuario && (
        <Box sx={{ mb: 3, p:2, border: '1px solid #d3e0d1', borderRadius: 2, background: '#f7faf5' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#65815c' }}>Datos del usuario:</Typography>
          <Typography variant="body2"><b>Nombre:</b> {usuario.nombres} {usuario.apellido_primero} {usuario.apellido_segundo}</Typography>
          <Typography variant="body2"><b>Correo:</b> {usuario.email}</Typography>
          <Typography variant="body2"><b>CURP:</b> {usuario.curp}</Typography>
          <Typography variant="body2"><b>Teléfono:</b> {usuario.telefono}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ConfirmarRegistro;
