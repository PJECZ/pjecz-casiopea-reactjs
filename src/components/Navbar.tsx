// Importa React y el hook useEffect para efectos secundarios
import React, { useState, useEffect } from 'react';
// Importa componentes de Material UI usados para la barra de navegación y su diseño
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
// Importa íconos y utilidades de Material UI y React Router
import AddIcon from '@mui/icons-material/Add';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useTheme, useMediaQuery } from '@mui/material'; // Para manejar estilos responsivos
import { useLocation, useNavigate } from 'react-router-dom'; // Para navegación y ubicación
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import { AccountCircle, PersonPinCircleOutlined } from '@mui/icons-material';

// Props que recibe el Navbar para controlar el formulario de nueva cita
type NavbarProps = {
  showNewAppointmentForm: boolean; // Indica si se debe mostrar el formulario de nueva cita
  setShowNewAppointmentForm: (value: boolean) => void; // Función para ocultar el formulario de nueva cita
};

// Componente principal Navbar
const Navbar: React.FC<NavbarProps> = ({ 
  showNewAppointmentForm, // Indica si se debe mostrar el formulario de nueva cita
  setShowNewAppointmentForm, // Función para ocultar el formulario de nueva cita
}) => {
  // Hooks para navegación, estado de pestañas, logout, drawer y diseño responsivo
  const location = useLocation(); // Ubicación actual para determinar la pestaña activa
  const navigate = useNavigate(); // Navegación programática
  const [activeTab, setActiveTab] = React.useState('homepage'); // Pestaña seleccionada
  const [loadingLogout, setLoadingLogout] = useState(false); // Estado de carga al cerrar sesión
  const [openDrawer, setOpenDrawer] = React.useState(false); // Estado del menú lateral (drawer)
  const theme = useTheme(); // Tema de MUI
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detecta si es móvil
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null); // Anchor para el menú desplegable del perfil

  // Cambia la pestaña activa según la ruta actual
  useEffect(() => {
    if (location.pathname.startsWith('/new-appointment')) {  // Si la ruta es /new-appointment
      setActiveTab('newappointment');
    } else if (location.pathname.startsWith('/homepage')) { // Si la ruta es /homepage
      setActiveTab('homepage');
    } else { // Si la ruta no es ninguna de las anteriores
      setActiveTab('');
    }
  }, [location.pathname]);

  // Maneja el cambio de pestaña y navegación
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue); // Cambia la pestaña activa
    setShowNewAppointmentForm(false); // Oculta el formulario de nueva cita
    if (newValue === 'homepage') navigate('/homepage'); // Navega a la pantalla de citas
    if (newValue === 'newappointment') navigate('/new-appointment'); // Navega a la pantalla de nueva cita
  };

  // Oculta el Navbar en la pantalla de login (ruta raíz)
  if (location.pathname === '/') return null;

  // Render principal del Navbar
  return (
    <AppBar position="sticky" color="default" elevation={2}>
      {/* Distribuye los elementos en la barra */}
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Si es móvil, muestra solo el logo y el menú hamburguesa; si es desktop, muestra logo y tabs */}
        {isMobile ? (
          <>
            <Box display="flex" alignItems="center">
              {/* Logo */}
              <img src="/images/logo2.png" alt="Logo" style={{ width: 70, height: 'auto', display: 'block' }} />
            </Box>
            {/* Botón de menú hamburguesa para abrir el Drawer */}
            <IconButton
              color="inherit"
              edge="end"
              aria-label="menu"
              onClick={() => setOpenDrawer(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon sx={{ color: '#486238' }} />
            </IconButton>
          </>
        ) : (
          <Box display="flex" alignItems="center">
            {/* Logo */}
            <img src="/images/logo2.png" alt="Logo" style={{ width: 70, height: 'auto', display: 'block' }} />
            {/* Tabs de navegación para escritorio */}
            <Tabs
              value={!showNewAppointmentForm ? (['homepage', 'newappointment'].includes(activeTab) ? activeTab : activeTab === '' ? false : 'homepage') : false}
              onChange={handleTabChange}
              sx={{
                ml: 4,
                color: '#486238 !important',
                '& .MuiTabs-indicator': { backgroundColor: '#486238' },
                '& .Mui-selected': { color: '#486238 !important' },
                '& .Mui-selected:hover': { color: '#486238 !important' },
                '& .Mui-selected:focus': { color: '#486238 !important' }
              }}
            >
              {/* Tab para crear nueva cita */}
              <Tab icon={<AddIcon />} iconPosition="start" label="Nueva Cita" value="newappointment" />
              {/* Tab para ver citas existentes */}
              <Tab icon={<EventNoteIcon />} iconPosition="start" label="Mis Citas" value="homepage" />
            </Tabs>
          </Box>
        )}

        {/* Botón de cerrar sesión visible solo en escritorio */}
        {!isMobile && (
          <Box>
            <IconButton
              onClick={event => setProfileMenuAnchor(event.currentTarget)}
              size="large"
              sx={{ color: '#486238', backgroundColor: '#e9f3e2', ml: 1 }}
            >
              {loadingLogout ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                // Mostrar iniciales del nombre del usuario
                <Avatar sx={{ bgcolor: '#b1c89e', color: '#486238' }}>
                </Avatar>
              )}
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={() => setProfileMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                onClick={() => {
                  setProfileMenuAnchor(null);
                  navigate('/perfil');
                }}
              >
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                Ver mi perfil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setProfileMenuAnchor(null);
                  setShowNewAppointmentForm(true);
                  setLoadingLogout(true);
                  setTimeout(() => {
                    localStorage.removeItem('access_token');
                    setLoadingLogout(false);
                    navigate('/');
                  }, 1200);
                }}
                disabled={loadingLogout}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      {/* Drawer para menú lateral en móvil */}
      <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setOpenDrawer(false)}>
          <List>
            {/* Opción para ver citas */}
            <ListItem disablePadding>
              <ListItemButton selected={activeTab === 'homepage'} onClick={() => { setActiveTab('homepage'); navigate('/homepage'); }}>
                <ListItemIcon><EventNoteIcon sx={{ color: '#486238' }} /></ListItemIcon>
                <ListItemText primary="Mis Citas" />
              </ListItemButton>
            </ListItem>
            {/* Opción para crear nueva cita */}
            <ListItem disablePadding>
              <ListItemButton selected={activeTab === 'newappointment'} onClick={() => { setActiveTab('newappointment'); navigate('/new-appointment'); }}>
                <ListItemIcon><AddIcon sx={{ color: '#486238' }} /></ListItemIcon>
                <ListItemText primary="Nueva Cita" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {/* Opción para cerrar sesión */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                // Logout desde el menú móvil
                setShowNewAppointmentForm(true);
                setLoadingLogout(true);
                setTimeout(() => {
                  localStorage.removeItem('access_token');
                  setLoadingLogout(false);
                  navigate('/');
                }, 1200);
              }}>
                <ListItemIcon>{loadingLogout ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon sx={{ color: '#486238' }} />}</ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

// Exporta el componente Navbar para su uso en la app
export default Navbar;
