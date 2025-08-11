import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { confirmarCuenta } from "../actions/AuthActions";
import axios from "axios";

const ConfirmarRegistro: React.FC = () => {
  const location = useLocation();
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [cadenaValidar, setCadenaValidar] = useState<string>("");
  const [usuario, setUsuario] = useState<any>(null);

  /* Mostrar datos de usuario al obtener el id y cadena_validar desde el enlace  y funcion confirmarCuenta */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cadena_validar = params.get("cadena_validar");
    if (cadena_validar) {
      setCadenaValidar(cadena_validar);
      confirmarCuenta(cadena_validar)
        .then((res) => {
          setUsuario(res.data.data);
          setMensaje("Registro confirmado exitosamente");
        })
        .catch((err) => {
          setMensaje("Error al confirmar el registro");
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
