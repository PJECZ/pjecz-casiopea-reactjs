import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { terminarRegistro } from "../actions/AuthActions";
import axios from "axios";

const ConfirmarRegistro: React.FC = () => {
  const location = useLocation();
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [enviando, setEnviando] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [cadenaValidar, setCadenaValidar] = useState<string>("");
  const [usuario, setUsuario] = useState<any>(null);

  /* useEffect para validar el registro */
  useEffect(() => {
    /* Validar los parámetros del enlace */
    const params = new URLSearchParams(location.search);
    /* Obtener los parámetros del enlace */
    const idParam = params.get("id");
    /* Obtener el parámetro cadena_validar */
    const cadena_validar = params.get("cadena_validar");

    /* Validar que los parámetros del enlace sean correctos */
    if (idParam && cadena_validar) {
      /* Asignar los parámetros a las variables */
      setId(idParam);
      setCadenaValidar(cadena_validar);
      /* Validar el registro */
      axios.post("/api/v5/cit_clientes_registros/validar", {
        id: idParam,
        cadena_validar,
      })
        .then((res) => {
          /* Validar que el registro sea correcto */
          if (res.data && res.data.data) {
            /* Asignar los datos del usuario */
            setUsuario(res.data.data);
            /* Mostrar mensaje de éxito */
            setMensaje("¡Registro validado exitosamente! Revisa tus datos antes de finalizar el registro.");
            /* Mostrar el formulario */
            setMostrarFormulario(true); // Si quieres mostrar el formulario después
          } else {
            /* Mostrar mensaje de error */
            setMensaje("No se encontraron datos de usuario para mostrar.");
          }
        })
        .catch((err) => {
          /* Validar que el registro sea correcto */
          if (err.response && err.response.data && err.response.data.error) {
            /* Mostrar mensaje de error */
            setMensaje(`Error: ${err.response.data.error}`);
          } else {
            /* Mostrar mensaje de error */
            setMensaje("Error al validar el registro.");
          }
        })
        .finally(() => {
          /* Finalizar el registro */
          setCargando(false);
        });
    } else {
      /* Mostrar mensaje de error */
      setMensaje("Parámetros inválidos en el enlace.");
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
          <Typography variant="body2"><b>ID:</b> {id}</Typography>
          <Typography variant="body2"><b>Cadena validar:</b> {cadenaValidar}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ConfirmarRegistro;
