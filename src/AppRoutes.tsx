import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomePage';
import NewAppointment from './components/NewAppointment';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import SessionExpiredDialog from './components/SessionExpiredDialog';
import ForgotPassword from './components/OlvidoContrasena';
import ValidatePassword from './components/ValidatePassword';
import ConfirmarRegistro from './components/ConfirmarRegistro';
import CrearContrasena from './components/CrearContrasena';
import ConfirmarRecuperacion from './components/ConfirmarRecuperacion';
interface AppRoutesProps {
  showNewAppointmentForm: boolean;
  setShowNewAppointmentForm: (v: boolean) => void;
  showForgotPassword: boolean;
  setShowForgotPassword: (v: boolean) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ showNewAppointmentForm, setShowNewAppointmentForm, showForgotPassword, setShowForgotPassword }) => {
  return (
    <>
      <SessionExpiredDialog />
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword onBack={() => setShowForgotPassword(false)} />} />
        <Route path="/validate-password" element={<ValidatePassword />} />
        <Route path='/cit_clientes_registros/confirmar' element={<ConfirmarRegistro />} />
        <Route path='/CrearContrasena' element={<CrearContrasena />} />
        <Route path='/cit_clientes_recuperaciones/confirmar' element={<ConfirmarRecuperacion />} />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <>
                <Navbar showNewAppointmentForm={showNewAppointmentForm} setShowNewAppointmentForm={setShowNewAppointmentForm} />
                <Box>
                  <Routes>
                    <Route path="/homepage" element={<HomeScreen />} />
                    <Route path="/new-appointment" element={<NewAppointment />} />
                  </Routes>
                </Box>
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;