import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

// --- Interfaz para la ruta privada ---
interface PrivateRouteProps {
  children: JSX.Element;
}

// Componente de ruta privada que valida si el usuario tiene sesión activa
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // --- Validación ---
  const token = localStorage.getItem('access_token');
  // --- Retorno ---
  return token ? children : <Navigate to="/" replace />;
};

// --- Exporta la ruta privada ---
export default PrivateRoute;
