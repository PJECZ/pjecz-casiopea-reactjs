import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, TextField, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('nombre') || 'Usuario');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    localStorage.setItem('nombre', name);
    localStorage.setItem('email', email);
    setMessage('Cambios guardados correctamente.');
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <>
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{
          maxWidth: { xs: 380, sm: 600 },
          width: '100%',
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: '#65815c', color: 'white', fontSize: 32 }}>
            {name[0] || 'U'}
          </Avatar>
          <Typography variant="h6" align="center" mb={2} fontWeight="bold" sx={{ color: '#65815c', fontSize: '1.5rem' }}>
            Mi Perfil
          </Typography>
          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2, mb: 1, fontWeight: 'bold', borderRadius: 2, boxShadow: 2 }}
              fullWidth
            >
              Guardar Cambios
            </Button>
          </Grid>
          {message && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1, textAlign: 'center' }}>{message}</Typography>
          )}
        </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default ProfilePage;
