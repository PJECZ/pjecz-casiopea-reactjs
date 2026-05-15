// Importa React y el hook useEffect para efectos secundarios
import React, { useState, useEffect } from 'react';
// Importa componentes de Material UI usados para la barra de navegación y su diseño
import {
  AppBar,
  Box,
  Toolbar,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Button,
  Container,
} from '@mui/material';
// Importa íconos y utilidades de Material UI y React Router
import AddIcon from '@mui/icons-material/Add';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import EventNoteIcon from '@mui/icons-material/EventNote';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { useTheme, useMediaQuery } from '@mui/material'; // Para manejar estilos responsivos
import { useLocation, useNavigate } from 'react-router-dom'; // Para navegación y ubicación
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';

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
  const [menuWidth, setMenuWidth] = useState<number | null>(null);


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
    <AppBar position="fixed" color="default" elevation={2}>

      <Container maxWidth="xl">

        {/* Distribuye los elementos en la barra */}
        <Toolbar sx={{ justifyContent: 'space-between', height: 85 }}>
          {/* Si es móvil, muestra solo el logo y el menú hamburguesa; si es desktop, muestra logo y tabs */}
          {isMobile ? (
            <>
              <Box display="flex" alignItems="center">
                {/* Logo */}
                <img src="/images/logo_navbar.png" alt="Logo" style={{ width: 70, height: 'auto', display: 'block' }} />
              </Box>
              {/* Botón de menú hamburguesa para abrir el Drawer */}
              <IconButton
                color="inherit"
                edge="end"
                aria-label="menu"
                onClick={() => setOpenDrawer(true)}
                sx={{ ml: 2 }}
              >
                <MenuIcon sx={{ color: '#000' }} />
              </IconButton>
            </>
          ) : (
            <Box display="flex" alignItems="center">
              {/* Logo */}
              <img src="/images/logo_navbar.png" alt="Logo" style={{ height: 60, display: 'block' }} />
              <Box sx={{ flex: 1 }}>
                <List component="nav" sx={{ display: 'flex', justifyContent: 'center' }}>
                  
                  <ListItem disablePadding sx={{ width: 'auto' }}>
                    <ListItemButton
                      selected={activeTab === 'homepage'}
                      onClick={() => {
                        setActiveTab('homepage');
                        setShowNewAppointmentForm(false);
                        navigate('/homepage');
                      }}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: '#e9eef7',
                          color: '#000'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <EventNoteIcon sx={{ color: '#000' }} />
                      </ListItemIcon>
                      <ListItemText primary="Mis Citas" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding sx={{ width: 'auto' }}>
                    <ListItemButton
                      selected={activeTab === 'newappointment'}
                      onClick={() => {
                        setActiveTab('newappointment');
                        setShowNewAppointmentForm(false);
                        navigate('/new-appointment');
                      }}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: '#e9eef7',
                          color: '#000'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <AddIcon sx={{ color: '#000' }} />
                      </ListItemIcon>
                      <ListItemText primary="Nueva Cita" />
                    </ListItemButton>
                  </ListItem>

                </List>
              </Box>
            </Box>
          )}

          {/* Botón de cerrar sesión visible solo en escritorio */}
          {!isMobile && (
            <Box>
              <Button
                onClick={event => {setProfileMenuAnchor(event.currentTarget); setMenuWidth(event.currentTarget.offsetWidth);}}
                size="large"
                sx={{
                  display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  backgroundColor: '#f5f7fb',
                  color: '#000',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#e9eef7'
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#000',
                    width: 36,
                    height: 36,
                    fontSize: 14
                  }}
                >
                  {localStorage.getItem('email')?.slice(0, 1).toUpperCase()}
                </Avatar>
                {loadingLogout ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  // Mostrar correo del usuario
                  <Box sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      lineHeight: 1.2
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                      {/* Mostrar correo del usuario */}
                      {localStorage.getItem('email')}
                    </Typography>
                  </Box>

                )}
                {loadingLogout ? null : (
                  <KeyboardArrowDownIcon />
                )}
              </Button>
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={() => setProfileMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem
                  onClick={() => {
                    setProfileMenuAnchor(null);
                    setShowNewAppointmentForm(true);
                    setLoadingLogout(true);

                    setTimeout(() => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('email');
                      setLoadingLogout(false);
                      navigate('/');
                    }, 1200);
                  }}
                  disabled={loadingLogout}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    width: menuWidth ? menuWidth - 32 : 'auto', // Ajusta el ancho del menú al ancho del botón menos el padding
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#fbe9e7',
                    }
                  }}
                  >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      //color: '#d32f2f'
                    }}
                  >
                    {loadingLogout ? (
                      <CircularProgress size={18} />
                    ) : (
                      <LogoutIcon fontSize="small" />
                    )}
                  </ListItemIcon>

                  <ListItemText
                    primary="Salir"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#000'
                    }}
                  />

                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
        {/* Drawer para menú lateral en móvil */}
        <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpenDrawer(false)}>
            {/* Información del usuario en la parte superior del drawer */}
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#0d0e14ff', color: '#eaeaeaff', width: 40, height: 40 }}>
                  {localStorage.getItem('email')?.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, fontSize: '0.875rem' }}>
                    Usuario
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                    {localStorage.getItem('email')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <List>
              {/* Opción para ver citas */}
              <ListItem disablePadding>
                <ListItemButton selected={activeTab === 'homepage'} onClick={() => { setActiveTab('homepage'); navigate('/homepage'); }}>
                  <ListItemIcon><EventNoteIcon sx={{ color: '#000' }} /></ListItemIcon>
                  <ListItemText primary="Mis Citas" />
                </ListItemButton>
              </ListItem>
              {/* Opción para crear nueva cita */}
              <ListItem disablePadding>
                <ListItemButton selected={activeTab === 'newappointment'} onClick={() => { setActiveTab('newappointment'); navigate('/new-appointment'); }}>
                  <ListItemIcon><AddIcon sx={{ color: '#000' }} /></ListItemIcon>
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
                    localStorage.removeItem('email');
                    setLoadingLogout(false);
                    navigate('/');
                  }, 1200);
                }}>
                  <ListItemIcon>{loadingLogout ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon sx={{ color: '#000' }} />}</ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

      </Container>

    </AppBar>
  );
};

// Exporta el componente Navbar para su uso en la app
export default Navbar;
