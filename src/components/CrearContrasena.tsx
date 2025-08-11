import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Card, Divider, Button, TextField, Avatar, CircularProgress } from "@mui/material";
import { KeyOutlined, CheckCircle, ErrorOutline } from "@mui/icons-material";
import { terminarRegistro } from "../actions/AuthActions";

const CrearContrasena: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Obtener id y cadena_validar desde location.state o query params
  const state = location.state as { id?: string; cadena_validar?: string };
  const params = new URLSearchParams(location.search);
  const id = state?.id || params.get("id") || "";
  const cadena_validar = state?.cadena_validar || params.get("cadena_validar") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState<boolean|null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!password || !confirmPassword) {
      setMensaje("Por favor ingresa y confirma tu contraseña.");
      setSuccess(false);
      return;
    }
    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden.");
      setSuccess(false);
      return;
    }
    setLoading(true);
    try {
      const res = await terminarRegistro({ id, cadena_validar, password });
      setMensaje(res.message || "¡Contraseña creada exitosamente!");
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setMensaje(err.message || "No se pudo crear la contraseña.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6, px: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to right, #fff, #f5f5f5)' }}>
      <Card sx={{ maxWidth: 600, borderRadius: 4, boxShadow: 3, p: 3, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: success === true ? 'success.light' : (success === false ? 'error.light' : '#65815c'), color: success === true ? 'success.dark' : (success === false ? 'error.dark' : '#fff'), width: 64, height: 64, mb: 2 }}>
          {success === true ? <CheckCircle fontSize="large" /> : success === false ? <ErrorOutline fontSize="large" /> : <KeyOutlined fontSize="large" />}
        </Avatar>
        <Typography variant="h5" fontWeight={600} sx={{ color: '#65815c', mb: 1, textAlign: 'center' }}>
          Crear nueva contraseña
        </Typography>
        <Divider sx={{ my: 2, width: '100%' }} />
        <form style={{ width: '100%' }} onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {mensaje && (
            <Typography variant="body2" sx={{ color: success === true ? 'success.main' : 'error.main', mt: 1, textAlign: 'center' }}>{mensaje}</Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, borderRadius: 2, backgroundColor: '#65815c', fontWeight: 600 }}
            startIcon={<KeyOutlined />}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear contraseña'}
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default CrearContrasena;
