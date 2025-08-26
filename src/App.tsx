import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

const App: React.FC = () => {
  const [showNewAppointmentForm, setShowNewAppointmentForm] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  return (
    <BrowserRouter>
        <AppRoutes
          showNewAppointmentForm={showNewAppointmentForm}
          setShowNewAppointmentForm={setShowNewAppointmentForm}
          showForgotPassword={showForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
        />
      </BrowserRouter>
  );
};

export default App;