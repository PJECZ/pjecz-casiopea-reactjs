import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Card, Divider, Button, Avatar } from "@mui/material";
import { validarUsuario } from "../actions/AuthActions";
import {
  AccessTime, BadgeOutlined, CheckCircle, Email,
  HomeFilled, KeyOutlined, Person, Phone, ErrorOutline,
} from "@mui/icons-material";

const ConfirmarRegistro: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [usuario, setUsuario] = useState<any>(null);
  const validacionEjecutada = useRef<boolean>(false);

  useEffect(() => {
    if (validacionEjecutada.current) return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const cadena_validar = params.get("cadena_validar");

    if (id && cadena_validar) {
      validacionEjecutada.current = true;
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
          validacionEjecutada.current = false;
        })
        .finally(() => setCargando(false));
    } else {
      setMensaje("Parámetros inválidos");
      setCargando(false);
    }
  }, [location.search, navigate]);

  const handleCrearContrasena = () => {
    let id = usuario.id;
    let cadena = usuario.cadena_validar;
    if (!cadena) {
      const params = new URLSearchParams(location.search);
      cadena = params.get("cadena_validar") || "";
    }
    if (!id || !cadena) {
      alert("Faltan datos para crear la contraseña.");
      return;
    }
    navigate("/CrearContrasena", { state: { id, cadena_validar: cadena } });
  };

  // Configuración dinámica por estado
  const estadoConfig = {
    icono: cargando ? <AccessTime sx={{ fontSize: 36 }} /> : usuario ? <CheckCircle sx={{ fontSize: 36 }} /> : <ErrorOutline sx={{ fontSize: 36 }} />,
    avatarBg: cargando ? "#f5f5f5" : usuario ? "#EAF3DE" : "#FCEBEB",
    avatarColor: cargando ? "#888" : usuario ? "#3B6D11" : "#A32D2D",
    etiqueta: cargando ? "" : usuario ? "Registro verificado" : "Error de validación",
    titulo: cargando ? "Validando registro..." : usuario ? "Confirmación de registro" : "Cuenta ya validada",
  };

  // Filas de datos del usuario
  const datosUsuario = usuario
    ? [
        { icono: <Person />, label: "Nombre completo", valor: `${usuario.nombres} ${usuario.apellido_primero} ${usuario.apellido_segundo}` },
        { icono: <Email />, label: "Correo electrónico", valor: usuario.email },
        { icono: <BadgeOutlined />, label: "CURP", valor: usuario.curp, mono: true },
        { icono: <Phone />, label: "Teléfono", valor: usuario.telefono },
      ]
    : [];

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        overflow: "auto",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 620,
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
        elevation={0}
      >
        {/* Header */}
        <Box
          sx={{
            px: 4,
            pt: 4,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: estadoConfig.avatarBg,
              color: estadoConfig.avatarColor,
              width: 72,
              height: 72,
            }}
          >
            {estadoConfig.icono}
          </Avatar>

          {estadoConfig.etiqueta && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "text.disabled",
              }}
            >
              {estadoConfig.etiqueta}
            </Typography>
          )}

          <Typography variant="h5" fontWeight={500} color="text.primary">
            {estadoConfig.titulo}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {cargando ? "Por favor espera..." : mensaje}
          </Typography>
        </Box>

        {/* Datos del usuario */}
        {usuario && (
          <>
            <Divider />
            <Box sx={{ px: 4, py: 2.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.disabled",
                  display: "block",
                  mb: 1.5,
                }}
              >
                Datos del usuario
              </Typography>

              {datosUsuario.map((fila, i) => (
                <React.Fragment key={i}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: "grey.100",
                        color: "text.secondary",
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        "& .MuiSvgIcon-root": { fontSize: 18 },
                      }}
                    >
                      {fila.icono}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" color="text.disabled" display="block" lineHeight={1.2}>
                        {fila.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="text.primary"
                        sx={fila.mono ? { fontFamily: "monospace" } : {}}
                      >
                        {fila.valor}
                      </Typography>
                    </Box>
                  </Box>
                  {i < datosUsuario.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </>
        )}

        {/* Botón de acción */}
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
                bgcolor: "#000",
                color: "#fff",
                fontWeight: 500,
                py: 1.5,
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Crear contraseña
            </Button>
          ) : (
            !cargando && (
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                fullWidth
                size="large"
                startIcon={<HomeFilled />}
                sx={{ borderRadius: 2, fontWeight: 500, py: 1.5 }}
              >
                Ir al inicio
              </Button>
            )
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ConfirmarRegistro;