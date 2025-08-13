// Componente para confirmar la recuperación de contraseña
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Alert, 
  CircularProgress, 
  Button,
  Divider,
  Chip
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { forgotPasswordValidate } from '../actions/AuthActions';

interface UserData {
  id: string;
  nombres: string;
  apellido_primero: string;
  apellido_segundo: string;
  curp: string;
  telefono: string;
  email: string;
  expiracion: string;
  cadena_validar: string;
  mensajes_cantidad: number;
  ya_registrado: boolean;
  creado: string;
}

interface ValidationResponse {
  success: boolean;
  message: string;
  data: UserData;
}

const ConfirmarRecuperacion: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateRecovery = async () => {
      try {
        const id = searchParams.get('id');
        const cadenaValidar = searchParams.get('cadena_validar');

        if (!id || !cadenaValidar) {
          setError('Parámetros de validación faltantes en la URL');
          setLoading(false);
          return;
        }

        console.log('Validando recuperación con:', { id, cadenaValidar });
        
        const result = await forgotPasswordValidate(id, cadenaValidar);
        setValidationResult(result);
        setError(null);
      } catch (err) {
        console.error('Error al validar recuperación:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al validar la recuperación');
      } finally {
        setLoading(false);
      }
    };

    validateRecovery();
  }, [searchParams]);

  const handleContinue = () => {
    // Redirigir a crear nueva contraseña con los parámetros necesarios
    if (validationResult?.data) {
      navigate(`/CrearContrasena?id=${validationResult.data.id}&cadena_validar=${validationResult.data.cadena_validar}`);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          p: 3
        }}
      >
        <CircularProgress size={60} sx={{ color: '#045e2c', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Validando recuperación de contraseña...
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: 3
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {error ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ErrorIcon sx={{ color: 'error.main', fontSize: 40, mr: 2 }} />
                <Typography variant="h5" color="error.main" fontWeight="bold">
                  Error de Validación
                </Typography>
              </Box>
              
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              
              <Button 
                variant="contained" 
                onClick={handleBackToLogin}
                sx={{ 
                  bgcolor: '#045e2c', 
                  '&:hover': { bgcolor: '#034a24' },
                  width: '100%'
                }}
              >
                Volver al Login
              </Button>
            </>
          ) : validationResult?.success ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40, mr: 2 }} />
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  Validación Exitosa
                </Typography>
              </Box>

              <Alert severity="success" sx={{ mb: 3 }}>
                {validationResult.message || 'La recuperación de contraseña ha sido validada correctamente'}
              </Alert>

              {validationResult.data && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: '#045e2c' }}>
                    Datos del Usuario
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ color: '#045e2c', mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Nombre:</strong> {validationResult.data.nombres} {validationResult.data.apellido_primero} {validationResult.data.apellido_segundo}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BadgeIcon sx={{ color: '#045e2c', mr: 1 }} />
                      <Typography variant="body1">
                        <strong>CURP:</strong> {validationResult.data.curp}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ color: '#045e2c', mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Email:</strong> {validationResult.data.email}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ color: '#045e2c', mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Teléfono:</strong> {validationResult.data.telefono}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={`ID: ${validationResult.data.id}`} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`Creado: ${new Date(validationResult.data.creado).toLocaleDateString()}`} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`Expira: ${new Date(validationResult.data.expiracion).toLocaleDateString()}`} 
                        size="small" 
                        variant="outlined" 
                        color={new Date(validationResult.data.expiracion) > new Date() ? 'success' : 'error'}
                      />
                    </Box>
                  </Box>
                </>
              )}

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button 
                  variant="contained" 
                  onClick={handleContinue}
                  sx={{ 
                    bgcolor: '#045e2c', 
                    '&:hover': { bgcolor: '#034a24' },
                    flex: 1
                  }}
                >
                  Crear Nueva Contraseña
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={handleBackToLogin}
                  sx={{ 
                    borderColor: '#045e2c', 
                    color: '#045e2c',
                    '&:hover': { borderColor: '#034a24', bgcolor: '#f8f9fa' },
                    flex: 1
                  }}
                >
                  Volver al Login
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ErrorIcon sx={{ color: 'warning.main', fontSize: 40, mr: 2 }} />
                <Typography variant="h5" color="warning.main" fontWeight="bold">
                  Validación Fallida
                </Typography>
              </Box>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                {validationResult?.message || 'No se pudo validar la recuperación de contraseña'}
              </Alert>
              
              <Button 
                variant="contained" 
                onClick={handleBackToLogin}
                sx={{ 
                  bgcolor: '#045e2c', 
                  '&:hover': { bgcolor: '#034a24' },
                  width: '100%'
                }}
              >
                Volver al Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfirmarRecuperacion;
