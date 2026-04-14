import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Card, DialogContent, DialogTitle, Dialog, Typography, Button, IconButton, DialogActions, Divider, Grow, CircularProgress, Avatar, Grid, CardActions, Stack } from '@mui/material';
import { AccessTime, EventBusy, SvgIconComponent} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCitas, cancelarCita, Cita } from '../actions/CitasActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import Assignment from '@mui/icons-material/Assignment';
import NotesIcon from '@mui/icons-material/Notes';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
type InfoFieldProps = {
  icon: SvgIconComponent;
  label: string;
  value: React.ReactNode;
  compact?: boolean;
};

// ══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════
const HomePage: React.FC = () => {
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

 // Memorizar el ordenamiento para evitar cálculos innecesarios en cada render
  const citasOrdenadas = useMemo(() => {
    return [...citas].sort((a, b) => Date.parse(a.inicio) - Date.parse(b.inicio));
  }, [citas]);

  // Prepara la interfaz para la cancelación: guarda la referencia de la cita seleccionada y muestra el modal de confirmación.
  const handleOpenDialog = (id: string) => {
    setSelectedAppointmentId(id); // Guarda el ID de la cita seleccionada
    setOpenDialog(true); // Abre el diálogo de confirmación
  };

  // Cierra el diálogo de confirmación y restaura el foco al cuerpo del documento tras la animación para mantener la accesibilidad.
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTimeout(() => {
      if (document.body) {
        document.body.focus();
      }
    }, 1000);
  };


// Funcion para manejar la cancelación de la cita
const handleCancelAppointment = async (id: string) => {
  if(!selectedAppointmentId) return; // Asegura que hay una cita seleccionada antes de proceder
  setLoadingConfirm(true); // Indica que se está procesando la cancelación
  try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No hay token de autenticación');
      await cancelarCita(id);
      setCitas(prev => prev.filter(cita => cita.id !== id));
      setOpenDialog(false);
  } catch (error) {
      console.error('Error al cancelar la cita:', error);
  }
  setLoadingConfirm(false);
  setSelectedAppointmentId(null);
};

useEffect(() => {
  async function Obtener() {
    setLoadingCitas(true);
    try{
      const res = await getCitas();
      setCitas(res);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    } finally {
      setLoadingCitas(false);
    }
  }
  Obtener();
}, []);

if (loadingCitas) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <CircularProgress sx={{ color: '#121528' }} />
    </Box>
  );
}


// Componente para campos de información con iconos
const InfoField: React.FC<InfoFieldProps> = ({ icon: Icon, label, value, compact = false }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: compact ? 1.5 : 1.8,
      borderRadius: 2,
      bgcolor: '#f8f9fa',
      border: '1px solid #e9ecef',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: '#f1f3f5',
        borderColor: '#121528',
      }
    }}
  >
    <Avatar sx={{ bgcolor: '#121528', width: 36, height: 36 }}>
      <Icon sx={{ fontSize: 18, color: 'white' }} />
    </Avatar>

    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#6c757d',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.65rem',
          letterSpacing: '0.5px',
          display: 'block'
        }}
      >
        {label}
      </Typography>

      {/* IMPORTANTE: evitar error de <p> */}
      <Typography
        variant="body2"
        component="div"
        sx={{
          color: '#121528',
          fontWeight: 500,
          fontSize: '0.9rem',
          lineHeight: 1.3,
          wordBreak: 'break-word'
        }}
      >
        {value || 'No especificado'}
      </Typography>
    </Box>
  </Box>
);
return (
  <>
    {/* Contenedor principal */}
    <Container sx={{ pt: 4}} maxWidth="xl">
      {/* Barra de título */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={6} mb={4}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#121528' }}>
          Mis Citas Agendadas
        </Typography>
      </Box>

      {/* Grid de citas */}
      <Grid container spacing={3} mb={3} px={4}>
        {citasOrdenadas.length > 0 ? (
          citasOrdenadas.map((item: Cita) => (
            <Grow key={item.id} in style={{ transformOrigin: '0 0 0' }} {...({ timeout: 1000 })}>
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                display="flex"
                justifyContent="center"
              >
                <Box justifyItems={'center'} alignItems={'center'}>
                  {/* DISEÑO ORIGINAL  CARD RESTAURADO */}
                  <Card
                    sx={{
                      // width: '100%',
                      maxWidth: 450,
                      borderRadius: 4,
                      boxShadow: '0 8px 24px rgba(18, 21, 40, 0.12)',
                      overflow: 'hidden',
                      background: 'white'
                    }}
                  >
                    {/* HEADER */}
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #121528 0%, #1e2442 50%, #121528 100%)',
                        color: 'white',
                        p: 2.5,
                        textAlign: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          bgcolor: 'rgba(255,255,255,0.15)',
                          p: 1.2,
                          borderRadius: '50%',
                          mb: 1
                        }}
                      >
                        <CalendarMonthIcon sx={{ fontSize: 28 }} />
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Cita Programada
                      </Typography>
                    </Box>

                    {/* CONTENIDO */}
                    <Box sx={{ p: 2.5 }}>
                      <Stack spacing={1.5}>

                        {/* FECHA Y HORA */}
                        <Box
                          sx={{
                            p: 1.8,
                            bgcolor: '#f0f4ff',
                            borderRadius: 2,
                            border: '1px solid #121528'
                          }}
                        >
                          <Grid container spacing={1.5} justifyContent="center">
                            <Grid size={{ md: 7, xs: 7 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                                <CalendarMonthIcon sx={{ fontSize: 18, color: '#121528' }} />
                                <Box>
                                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                                    Fecha
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {format(new Date(item.inicio), "dd/MM/yyyy", { locale: es })}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            <Grid size={{ md: 5, xs: 5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                                <AccessTime sx={{ fontSize: 18, color: '#121528' }} />
                                <Box>
                                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600}}>
                                    Hora
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {format(new Date(item.inicio), "HH:mm")}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* OFICINA */}
                        <InfoField
                          icon={BusinessIcon}
                          label="Oficina"
                          value={item.oficina_descripcion}
                          compact
                        />

                        {/* SERVICIO */}
                        <InfoField
                          icon={Assignment}
                          label="Servicio"
                          value={item.cit_servicio_descripcion}
                          compact
                        />

                        {/* NOTAS */}
                        <InfoField
                          // icon={NotesIcon}
                          // label="Notas"
                          icon={item?.cit_servicio_descripcion?.toLowerCase().includes('expediente') 
                              ? DescriptionIcon 
                              : NoteAltIcon
                          }
                          label={item?.cit_servicio_descripcion?.toLowerCase().includes('expediente') 
                              ? 'Expediente' 
                              : 'Notas'
                          }
                          value={
                            item.notas
                              ? item.notas.length > 50
                                ? item.notas.slice(0, 50) + '...'
                                : item.notas
                              : 'Sin notas'
                          }
                          compact
                        />
                      </Stack>

                      {/* QR */}
                      <Box
                        sx={{
                          mt: 2.5,
                          p: 2,
                          bgcolor: '#f8f9fa',
                          borderRadius: 2,
                          border: '1px dashed #dee2e6',
                          display: 'flex',            // Asegura comportamiento de flexbox
                          flexDirection: 'column',    // Alinea elementos verticalmente
                          alignItems: 'center',       // Centra horizontalmente todo el contenido
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600, mb: 1}}>
                          Código de acceso
                        </Typography>

                        <img
                          alt="qr"
                          src={item.codigo_acceso_url}
                          width={200}
                          style={{ borderRadius: 8, display: 'block' }}
                        />

                        <Typography
                          variant="caption"
                          display="block"
                          mt={1}
                          sx={{ fontWeight: 600 }}
                        >
                          {item.id}
                        </Typography>
                      </Box>

                      {/* BOTÓN */}
                      {item.puede_cancelarse && (
                        <Button
                          variant="contained"
                          color="error"
                          fullWidth
                          onClick={() => handleOpenDialog(item.id)}
                          sx={{
                            mt: 2,
                            py: 1.2,
                            borderRadius: 2,
                            fontWeight: 600,
                          }}
                        >
                          Cancelar Cita
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Box>
              </Grid>
            </Grow>
          ))
        ) : (
          /* Estado vacío: se muestra cuando no hay citas */
          <Box width="100%" textAlign="center" py={6}>
            <Avatar sx={{ bgcolor: '#121528', width: 56, height: 56, margin: '0 auto' }}>
              <CalendarMonthIcon sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="h6" mt={2}>
              No tienes citas agendadas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Agenda una nueva cita para comenzar
            </Typography>
          </Box>
        )}
      </Grid>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <Dialog open={openDialog} onClose={loadingConfirm ? undefined : handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <EventBusy sx={{ color: 'error.main', mr: 1.5 }} />
            <Typography variant="h6" fontWeight="bold">Cancelar Cita</Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} disabled={loadingConfirm}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <WarningAmberIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography align="center" variant="subtitle1" fontWeight={500}>
              ¿Estás seguro que deseas cancelar tu cita?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit" disabled={loadingConfirm}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if(selectedAppointmentId) handleCancelAppointment(selectedAppointmentId);
            }}
            variant="contained"
            color="error"
            sx={{ ml: 2, minWidth: 120 }}
            disabled={loadingConfirm}
          >
            {loadingConfirm ? <CircularProgress size={22} color="inherit" /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>

    {/* FOOTER (Fuera del Container para que ocupe todo el ancho) */}
    <Box component="footer"
      sx={{
        mt: 4,
        py: 3,
        bgcolor: '#fff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: citasOrdenadas.length === 0 ? 'fixed' : 'relative',
        bottom: citasOrdenadas.length === 0 ? 0 : 'auto',
        width: '100%',
      }}
    >
      <img src="/images/logo-horizontal-600x200-negro.png" alt="Logo PJECZ" style={{ width: 220, height: 'auto' }} />
    </Box>
  </>
)};

export default HomePage;
