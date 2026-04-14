import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import SessionExpiredDialog from './components/SessionExpiredDialog';

const App: React.FC = () => {

  const [showNewAppointmentForm, setShowNewAppointmentForm] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  

  return (
    <>
    
      <BrowserRouter>
          <AppRoutes
            showNewAppointmentForm={showNewAppointmentForm}
            setShowNewAppointmentForm={setShowNewAppointmentForm}
            showForgotPassword={showForgotPassword}
            setShowForgotPassword={setShowForgotPassword}
          />
          <SessionExpiredDialog />
        </BrowserRouter>

    </>
  );
};

export default App;