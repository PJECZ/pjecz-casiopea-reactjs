import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../actions/AuthActions';
interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  // Efecto para manejar el countdown y redirección automática
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate('/');
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (email !== confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }
    setLoading(true);

    if (!email || !email.includes('@')) {
      setLoading(false);
      setError('Por favor ingresa un correo válido.');
      return;
    }

    try {
      const response = await forgotPassword(email);
      setMessage(response?.message || 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.');
      
      // Limpiar el formulario y activar el estado de éxito
      setEmail('');
      setConfirmEmail('');
      setSuccess(true);
      setCountdown(3);
    } catch (err: any) {
      setError(err?.message || 'Error al solicitar recuperación de contraseña');
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          height: '100%',
          backgroundImage: "url('/images/bg3.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          backgroundAttachment: { xs: 'scroll', sm: 'fixed' },
          backgroundBlendMode: 'overlay',
          backgroundOpacity: 0.4,
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: { xs: 0, sm: 2 },
        }}
      >
        {/* Capa oscura y blur sobre la imagen de fondo */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.38)', backdropFilter: 'blur(4px)' }} />
          <Paper elevation={2} sx={{
            zIndex: 1,
            maxWidth: { xs: 380, sm: 460 },
            width: '100%',
            p: { xs: 2, sm: 4 },
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: 3,
            mx: { xs: 1, sm: 'auto' },
            my: { xs: 4, sm: 0 }
          }}
          >
            {/* Logo institucional */}
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box textAlign="left">
                <img src="/images/logo2.png" alt="Logo Sistema Citas" style={{ width: '60vw', maxWidth: 160, minWidth: 100, height: 'auto' }} />
              </Box>
            </Box>
            <Typography variant="h6" align="center" mb={2} fontWeight="bold" sx={{ color: '#65815c', fontSize: '1.5rem' }}>
              Recuperar contraseña
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" mb={3}>
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  fullWidth
                  required
                  autoFocus
                  disabled={success}
                  slotProps={{
                    input: {
                      autoComplete: 'off'
                    },
                    inputLabel: {
                      shrink: true,
                    }
                  }}    
                  placeholder='Ingrese su correo electrónico'
                />
                <TextField
                  label="Confirmar correo electrónico"
                  type="email"
                  value={confirmEmail}
                  onChange={e => {
                    setConfirmEmail(e.target.value);
                    setError(null);
                  }}
                  fullWidth
                  required
                  disabled={success}
                  slotProps={{
                    input: {
                      autoComplete: 'off'
                    },
                    inputLabel: {
                      shrink: true,
                    }
                  }}
                  placeholder='Confirmar su correo electrónico'   
                />
                {error && <Alert severity="error">{error}</Alert>}
                {message && !success && <Alert severity="info">{message}</Alert>}
                {success && (
                  <Alert severity="success">
                    {message}
                    <br />
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                      Redirigiendo al login en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                    </Typography>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading || success} 
                  fullWidth
                  sx={{ backgroundColor: '#65815c', color: 'white', '&:hover': { backgroundColor: '#70815c' }, mb: 2, '&:disabled': { backgroundColor: '#ccc' } }}
                >
                  {loading ? 'Enviando...' : success ? 'Recuperación enviada' : 'Recuperar contraseña'}
                </Button>
                <Button 
                  variant="text"  
                  onClick={handleBack} 
                  disabled={success}
                  fullWidth 
                  sx={{ mt: -1, color: '#65815c' , fontWeight: 'bold', '&:disabled': { color: '#ccc' } }}
                >
                  Volver al inicio de sesión
                </Button>
              </Stack>
            </form>

            {/* Logo institucional */}
            <Box textAlign="center" sx={{ mt: 2 }}> 
              <img src="/images/logo-horizontal-600x200-negro.png" alt="Logo PJECZ" style={{ width: 200, height: 'auto' }} />
            </Box>
          </Paper>
        </Box>
    </>
    );
};

export default ForgotPassword;
