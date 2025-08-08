import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppointmentProvider } from './context/AppointmentContext';
import AppRoutes from './AppRoutes';

const App: React.FC = () => {
  const [showNewAppointmentForm, setShowNewAppointmentForm] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  return (
    <AppointmentProvider>
      <BrowserRouter>
        <AppRoutes
          showNewAppointmentForm={showNewAppointmentForm}
          setShowNewAppointmentForm={setShowNewAppointmentForm}
          showForgotPassword={showForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
        />
      </BrowserRouter>
    </AppointmentProvider>
  );
};

export default App;