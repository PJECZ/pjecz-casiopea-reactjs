import React, { createContext, useState, useContext, useEffect } from 'react';

// --- Interfaz para la cita ---
interface Appointment {
  id: string; // UUID generado por el backend
  oficina: string;
  tramite: string;
  notas: string;
  fecha: string;
  hora: string;
}

// --- Interfaz para el contexto ---
interface AppointmentContextProps {
  appointments: Appointment[];
  // Ahora addAppointment recibe una cita completa (con id generado por backend)
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
}

// --- Crea el contexto ---
const AppointmentContext = createContext<AppointmentContextProps | undefined>(undefined);

// --- Exporta el contexto ---
export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    // Cargar citas desde localStorage al iniciar
    const storedAppointments = localStorage.getItem('appointments');
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  });

  useEffect(() => {
    // Guardar citas en localStorage cada vez que se actualicen
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Ahora addAppointment solo agrega la cita recibida (con id del backend)
  const addAppointment = (appointment: Appointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, appointment]);
  };

  // Funcion para eliminar una cita
  const removeAppointment = (id: string) => {
    setAppointments((prevAppointments) => prevAppointments.filter(app => app.id !== id));
  };

  return (
    // --- Provee el contexto de citas ---
    <AppointmentContext.Provider value={{ appointments, addAppointment, removeAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

// --- Hook para usar el contexto de citas ---
export const useAppointments = () => {
  // --- Uso el contexto de citas ---
  const context = useContext(AppointmentContext);
  // --- Validación ---
  if (!context) {
    // --- ERROR ---
    throw new Error('useAppointments debe ser usado dentro de un AppointmentProvider');
  }
  // --- Retorno ---
  return context;
};

// --- Exporta el provider ---
export default AppointmentProvider;