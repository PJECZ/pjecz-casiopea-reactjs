import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const App: React.FC = () => {
  const [sessionExpired, setSessionExpired] = useState(false);

  const [showNewAppointmentForm, setShowNewAppointmentForm] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  
  useEffect(() => {
    const handleSessionExpired = () => setSessionExpired(true);
    window.addEventListener('sessionExpired', handleSessionExpired);
    
    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, []);
     
  const handleLogin = () => {
    setShowNewAppointmentForm(true);
  };

  return (
    <>
    
      <BrowserRouter>
          <AppRoutes
            showNewAppointmentForm={showNewAppointmentForm}
            setShowNewAppointmentForm={setShowNewAppointmentForm}
            showForgotPassword={showForgotPassword}
            setShowForgotPassword={setShowForgotPassword}
          />
        </BrowserRouter>

        <Dialog open={sessionExpired} onClose={() => setSessionExpired(false)}>
          <DialogTitle>Sesión expirada</DialogTitle>
          <DialogContent>Su sesión ha expirado. Por favor, inicie sesión nuevamente.</DialogContent>
          <DialogActions>
            <Button onClick={handleLogin} color="primary" autoFocus>Iniciar sesión</Button>
          </DialogActions>
        </Dialog>
    </>
  );
};

export default App;