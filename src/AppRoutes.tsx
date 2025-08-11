import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomePage';
import NewAppointment from './components/NewAppointment';
import ProfilePage from './components/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import SessionExpiredDialog from './components/SessionExpiredDialog';
import ForgotPassword from './components/OlvidoContrasena';
import ValidatePassword from './components/ValidatePassword';
import ConfirmarRegistro from './components/ConfirmarRegistro';

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
        {/* <Route path='/confirmar' element={<ConfirmarRegistro />} /> */}
        <Route path='/cit_clientes_registros/confirmar' element={<ConfirmarRegistro />} />
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
                    <Route path="/perfil" element={<ProfilePage />} />
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