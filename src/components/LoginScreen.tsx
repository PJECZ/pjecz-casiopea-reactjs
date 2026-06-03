// Pantalla de login y registro para el sistema de citas del PJECZ
import React, { useState } from 'react';
import ForgotPassword from './OlvidoContrasena';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Paper, InputAdornment,
  ButtonGroup, FormControl, IconButton, Grid,
  Typography,Alert, AlertTitle,
} from '@mui/material';
import { Sync, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../actions/AuthActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const LoginScreen = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) navigate('/homepage', { replace: true });
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [showPassword, setShowPassword] = useState(false);
  const [nombres, setNombres] = useState('');
  const [apellidoPrimero, setApellidoPrimero] = useState('');
  const [apellidoSegundo, setApellidoSegundo] = useState('');
  const [curp, setCurp] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Por favor, complete todos los campos');
        setIsLoading(false);
        return;
      }
      try {
        const data = await login(email.trim(), password.trim());
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('email', email.trim());
        setTimeout(() => { setIsLoading(false); navigate('/homepage'); }, 1200);
      } catch {
        setIsLoading(false);
        setErrorMessage('Correo electrónico o contraseña incorrectos');
      }
      return;
    } else {
      if (!email.trim() || !confirmEmail.trim()) {
        setErrorMessage('Por favor, complete todos los campos');
        setMessageType('error'); setIsLoading(false); return;
      }
      if (email.trim() !== confirmEmail.trim()) {
        setErrorMessage('Los correos electrónicos no coinciden');
        setMessageType('error'); setIsLoading(false); return;
      }
      if (!nombres.trim() || !apellidoPrimero.trim() || !apellidoSegundo.trim() || !curp.trim() || !telefono.trim()) {
        setErrorMessage('Por favor, complete todos los campos');
        setMessageType('error'); setIsLoading(false); return;
      }
      try {
        const { registrarUsuario } = await import('../actions/AuthActions');
        const payload = {
          nombres: nombres.trim(), apellido_primero: apellidoPrimero.trim(),
          apellido_segundo: apellidoSegundo.trim(), curp: curp.trim(),
          telefono: telefono.trim(), email: email.trim(),
        };
        const resp = await registrarUsuario(payload);
        setIsLoading(false);
        if (resp.success) {
          setMessageType('success');
          setErrorMessage('Por favor, revisa tu correo electrónico para verificar tu cuenta.');
          setNombres(''); setApellidoPrimero(''); setApellidoSegundo('');
          setCurp(''); setTelefono(''); setEmail(''); setConfirmEmail('');
          // setTimeout(() => setErrorMessage(''), 6000);
        } else {
          setErrorMessage(resp.message || 'No se pudo crear la cuenta');
          setMessageType('error');
        }
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Error inesperado al crear la cuenta');
        setMessageType('error');
      }
    }
  };

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setEmail(''); setConfirmEmail(''); setPassword('');
    setNombres(''); setApellidoPrimero(''); setApellidoSegundo('');
    setCurp(''); setTelefono(''); setErrorMessage('');
  };

  React.useEffect(() => {
    if (isLogin) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isLogin]);

  const inputSx = { input: { color: 'grey.700' }, label: { color: '#1c1f33ff' } };
  const slotProps = {
    input: { autoComplete: 'off' },
    inputLabel: { shrink: true },
  };

  if (showForgotPassword) {
    return (
      <Box sx={{
        minHeight: '100vh', width: '100%',
        backgroundImage: "url('/images/bg_new.jpeg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundAttachment: { xs: 'scroll', sm: 'fixed' },
        backgroundColor: 'rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', p: { xs: 0, sm: 2 },
      }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }} />
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: isLogin ? '100%' : 'auto',
      height: isLogin ? '100vh' : 'auto',
      backgroundImage: "url('/images/bg_new.jpeg')",
      backgroundSize: 'cover', backgroundPosition: 'center',
      backgroundAttachment: { xs: 'scroll', sm: 'fixed' },
      backgroundColor: 'rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', p: { xs: 0, sm: 2 },
    }}>
      <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }} />

      <Paper elevation={2} sx={{
        maxWidth: { xs: 380, sm: 460 },
        width: '100%',
        //  Más padding interno general
        p: { xs: 3, sm: 5 },
        backdropFilter: 'blur(10px)',
        backgroundColor: '#fff',
        borderRadius: 3,
        mx: { xs: 1, sm: 'auto' },
        my: { xs: 4, sm: 2, md: 1 },
      }}>

        {/* Logo */}
        <Box textAlign="center" sx={{ mb: 4 }}>  {/* ✅ más espacio bajo el logo */}
          <img
            src="/images/logo_citas_login.png"
            alt="Logo Sistema Citas"
            style={{ maxWidth: 200, minWidth: 100, height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </Box>

        {/* Tabs login / registro */}
        <Box display="flex" justifyContent="center" sx={{ mb: 4 }}> {/* ✅ más espacio bajo los tabs */}
          <ButtonGroup variant="text" fullWidth>
            <Button
              onClick={() => switchMode(true)}
              sx={{
                borderBottom: isLogin ? '2px solid #000' : 'none',
                color: isLogin ? 'white' : '#1c1f33ff',
                backgroundColor: isLogin ? '#000' : 'transparent',
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => switchMode(false)}
              sx={{
                borderBottom: !isLogin ? '2px solid #000' : 'none',
                color: !isLogin ? 'white' : '#1c1f33ff',
                backgroundColor: !isLogin ? '#000' : 'transparent',
              }}
            >
              Crear Cuenta
            </Button>
          </ButtonGroup>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {/* ✅ rowSpacing da espacio vertical uniforme entre todos los campos */}
          <Grid container spacing={3}>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth variant="outlined"
                label="Correo Electrónico"
                placeholder="Ingrese su correo electrónico"
                type="email" slotProps={slotProps}
                value={email} onChange={(e) => setEmail(e.target.value)}
                sx={inputSx}
              />
            </Grid>

            {!isLogin && (
              <>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth variant="outlined"
                    label="Confirmar Correo"
                    placeholder="Confirme su correo electrónico"
                    type="email" slotProps={slotProps}
                    value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth variant="outlined"
                    label="Nombres"
                    placeholder="Ingrese sus nombres"
                    slotProps={slotProps}
                    value={nombres} onChange={(e) => setNombres(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth variant="outlined"
                    label="Primer Apellido"
                    placeholder="Primer apellido"
                    slotProps={slotProps}
                    value={apellidoPrimero} onChange={(e) => setApellidoPrimero(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth variant="outlined"
                    label="Segundo Apellido"
                    placeholder="Segundo apellido"
                    slotProps={slotProps}
                    value={apellidoSegundo} onChange={(e) => setApellidoSegundo(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth variant="outlined"
                    label="CURP"
                    placeholder="Ingrese su CURP"
                    slotProps={slotProps}
                    value={curp} onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    sx={inputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth variant="outlined"
                    label="Teléfono"
                    placeholder="Ingrese su teléfono"
                    slotProps={slotProps}
                    value={telefono} onChange={(e) => setTelefono(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </>
            )}

            {isLogin && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password} autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    label="Contraseña"
                    sx={inputSx}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end" sx={{ color: '#1c1f33ff' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                      inputLabel: { shrink: true },
                    }}
                  />
                </FormControl>
              </Grid>
            )}

            {errorMessage && (
              <Grid size={{ xs: 12 }}>
                <Alert
                  role="alert"
                  severity={messageType === 'success' ? 'success' : 'error'}
                  icon={
                    messageType === 'success'
                      ? <CheckCircleOutlineIcon fontSize="inherit" />
                      : <ErrorOutlineIcon fontSize="inherit" />
                  }
                  sx={{ borderRadius: 2, mt: 1 }}
                >
                  <AlertTitle>
                    {messageType === 'success' ? '¡Cuenta creada exitosamente!' : 'Ocurrió un error'}
                  </AlertTitle>

                  <Typography variant="body2">
                    {errorMessage}
                  </Typography>

                  {messageType === 'success' && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, opacity: 0.8 }}
                    >
                      <WarningAmberIcon sx={{ fontSize: 14 }} />
                      ¿No lo ves en tu bandeja? Revisa tu carpeta de spam o correo no deseado.
                    </Typography>
                  )}
                </Alert>
              </Grid>
            )}

            {isLogin && (
              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="flex-end">
                  <Link
                    to="/forgot-password"
                    style={{ color: '#1c1f33ff', textTransform: 'none', textDecoration: 'none',fontSize: 15 }}
                    onClick={() => setShowForgotPassword(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth variant="contained" type="submit"
                disabled={isLoading}
                sx={{
                  backgroundColor: '#000', color: 'white',
                  '&:hover': { backgroundColor: '#1c1f33ff' },
                  '&:disabled': { backgroundColor: '#ccc' },
                  py: 1.5,
                }}
                startIcon={isLoading ? <Sync sx={{ animation: 'spin 1s linear infinite' }} /> : null}
              >
                {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginScreen;