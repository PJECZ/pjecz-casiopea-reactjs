import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
    Stack, Typography, InputAdornment, Alert, Card, 
    List, ListItemButton, ListItemIcon, ListItemText, CircularProgress,
    Divider, Chip, Grid, Autocomplete, Container,
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';
import { AccessTime, Assignment, CalendarMonth, EventAvailable } from '@mui/icons-material';
import NotesIcon from '@mui/icons-material/Notes';

// Acciones y Tipos
import { 
    getDistritos, getOficinasFiltradas, getFechasDisponibles, 
    getHorasDisponibles, getServiciosPorOficina, createCita, Distrito 
} from '../actions/CitasActions';
import CitaConfirmadaDialog from './CitaConfirmadaDialog';
import { set } from 'lodash';

// ─── Tipos y Paleta ────────────────────────────────────────
type Oficina = { 
    clave: string; 
    descripcion: string; 
    domicilio_completo: string; 
};
type OficinaServicio = { 
    cit_servicio_clave: string; 
    cit_servicio_descripcion: string 
};

const C = {
    dark:  '#252b50',
    mid:   '#1e2545',
    light: '#e8eaf6',
    white: '#ffffff',
};

// ─── Fila del panel resumen ────────────────────────────────
const SummaryRow = ({ label, value, icon, empty }: { label: string, value: any, icon: any, empty: boolean }) => (
    <Box>
        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ py: 1.25 }}>
            <Box sx={{ color: empty ? 'text.disabled' : C.dark, mt: 0.15, flexShrink: 0 }}>
                {icon}
            </Box>
            <Box flex={1}>
                <Typography variant="caption" sx={{
                    color: 'text.secondary', textTransform: 'uppercase',
                    letterSpacing: .5, fontWeight: 700, display: 'block', lineHeight: 1.2
                }}>
                    {label}
                </Typography>
                <Typography variant="body2"
                    component="div"
                    sx={{
                    color: empty ? 'text.disabled' : C.dark,
                    fontStyle: empty ? 'italic' : 'normal',
                    fontWeight: empty ? 400 : 500,
                    mt: 0.25,
                }}>
                    {value}
                </Typography>
            </Box>
        </Stack>
        <Divider />
    </Box>
);

// ══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════
const NewAppointment: React.FC = () => {
    const navigate = useNavigate();

    // ─ Campos del formulario ─
    const [distrito,    setDistrito]    = useState('');
    const [oficina,     setOficina]     = useState<Oficina | null>(null);
    const [tramite,     setTramite]     = useState('');
    const [notas,       setNotas]       = useState('');
    const [expedientes, setExpedientes] = useState<string[]>([]);
    const [fecha,       setFecha]       = useState<Dayjs | null>(null);
    const [hora,        setHora]        = useState('');

    // ─ Datos remotos ─
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    // const [loadingDistritos, setLoadingDistritos] = useState(true);
    const [oficinas, setOficinas] = useState<Oficina[]>([]);
    const [loadingOficinas, setLoadingOficinas] = useState(false);
    const [tramites, setTramites] = useState<OficinaServicio[]>([]);
    const [loadingTramites, setLoadingTramites] = useState(false);
    const [fechas, setFechas] = useState<string[]>([]);
    const [loadingFechas, setLoadingFechas] = useState(false);
    const [horas, setHoras] = useState<string[]>([]);
    const [loadingHoras, setLoadingHoras] = useState(false);

    // ─ Estados para el Diálogo de Confirmación ─
    const [openConfirm, setOpenConfirm] = useState(false);
    const [citaCreada, setCitaCreada] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // ─ Submit y Mensajes ─
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    

    const isExpedientesTramite = () => {
        const t = tramites.find(t => t.cit_servicio_clave === tramite);
        return t?.cit_servicio_descripcion.toLowerCase().includes('expediente');
    };

    const notasResumen   = isExpedientesTramite()
        ? expedientes.filter(e => e.trim()).join(', ') || null
        : notas.trim() || null;

     const isFormComplete = oficina && tramite && fecha && hora;

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        // Si fue éxito, quizás quieras limpiar el formulario o redirigir
        if (isSuccess) navigate('/homepage');
    };

    const handleSubmit = async () => {
        setError(null);
        if (!isFormComplete) return;
        setLoadingSubmit(true);

        const finalNotas = isExpedientesTramite()
            ? expedientes.filter(e => e.trim()).join(',') || 'Sin expedientes'
            : notas.trim() || 'Sin notas';

        try {
            const res =  await createCita({
                cit_servicio_clave: tramite,
                fecha: fecha!.format('YYYY-MM-DD'),
                hora_minuto: hora,
                oficina_clave: oficina!.clave,
                notas: finalNotas,
            });
            const nuevaCita = res;
            // Seteamos los datos para el modal
            setCitaCreada(nuevaCita);
            setIsSuccess(true);
            setOpenConfirm(true);
            // setSuccessMsg('Cita agendada con éxito. Redirigiendo...');
            // setTimeout(() => navigate('/homepage'), 2500);
        } catch (e: any) {
            setError(e.message || 'Error al agendar.');
        } finally {
            setLoadingSubmit(false);
        }
    };


    // ─── Lógica de Efectos ────────────────────────────────
    useEffect(() => {
        const obtener = async () => {
            setLoading(true);
            try{
                const res = await getDistritos()
                setDistritos(res);
            }
            catch(e){
                console.error('Error al obtener distritos:', e);
            } finally {
                setLoading(false);
            }
        };
        obtener();
    }, []);

    useEffect(() => {
        setOficina(null); setTramite(''); setFechas([]); setHoras([]);
        if (!distrito) return;
        setLoadingOficinas(true);
        getOficinasFiltradas(distrito)
        .then(res => setOficinas(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingOficinas(false));
    }, [distrito]);

    useEffect(() => {
        setTramite(''); setFechas([]); setHoras([]);
        if (!oficina) return;
        setLoadingTramites(true);
        getServiciosPorOficina(oficina.clave)
        .then(res => setTramites(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingTramites(false));
    }, [oficina]);

    useEffect(() => {
        setFecha(null); setFechas([]); setHoras([]);
        if (!oficina || !tramite) return;
        setLoadingFechas(true);
        getFechasDisponibles(oficina.clave, tramite)
        .then(res => setFechas(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingFechas(false));
    }, [oficina, tramite]);

    useEffect(() => {
        setHora(''); setHoras([]);
        if (!oficina || !tramite || !fecha) return;
        setLoadingHoras(true);
        getHorasDisponibles(oficina.clave, tramite, fecha.format('YYYY-MM-DD'))
        .then(res => setHoras(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingHoras(false));
    }, [oficina, tramite, fecha]);
   
    if (loading) {
        return (
             <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress sx={{ color: '#252b50' }} />
                <Typography sx={{ ml: 2 }}>Cargando configuración...</Typography>
            </Box>
        );
    }
    return (        
            <Container maxWidth="xl">
                <Box mx="auto" mt={6} mb={6}>
                    <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box display="flex" minHeight={600} flexDirection={{ xs: 'column', md: 'row' }}>
                            
                            {/* ── Panel izquierdo: Formulario ── */}
                            <Box flex={1} sx={{ p: 4, borderRight: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h5" fontWeight={700} color={C.dark} gutterBottom>
                                    Nueva Cita
                                </Typography>
                                
                                <Grid container spacing={3}>
                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <FormControl fullWidth>
                                            <InputLabel id="distrito-label">Distrito</InputLabel>
                                            <Select
                                                labelId="distrito-label"
                                                value={distrito}
                                                label="Distrito"
                                                onChange={e => setDistrito(e.target.value)}
                                                startAdornment={<InputAdornment position="start"><LocationCityIcon /></InputAdornment>}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona un distrito</span>;
                                                    }
                                                    return distritos.find(d => d.clave === selected)?.nombre || '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>Selecciona un distrito</MenuItem>
                                                {distritos.map(d => <MenuItem key={d.clave} value={d.clave}>{d.nombre}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <FormControl fullWidth disabled={!distrito}>
                                            <InputLabel>Oficina</InputLabel>
                                            <Select
                                                value={oficina?.clave || ''}
                                                label="Oficina"
                                                onChange={e => setOficina(oficinas.find(o => o.clave === e.target.value) || null)}
                                                startAdornment={<InputAdornment position="start"><BusinessIcon /></InputAdornment>}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona una oficina</span>;
                                                    }
                                                    return oficinas.find(o => o.clave === selected)?.descripcion || '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>Selecciona una oficina</MenuItem>
                                                {oficinas.map(o => <MenuItem key={o.clave} value={o.clave}>{o.descripcion}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <FormControl fullWidth disabled={!oficina}>
                                            <InputLabel>Trámite</InputLabel>
                                            <Select
                                                value={tramite}
                                                label="Trámite"
                                                onChange={e => setTramite(e.target.value)}
                                                startAdornment={<InputAdornment position="start"><Assignment /></InputAdornment>}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona un tramite</span>;
                                                    }
                                                    return tramites.find(t => t.cit_servicio_clave === selected)?.cit_servicio_descripcion || '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>Selecciona un tramite</MenuItem>



                                                {tramites.map(t => <MenuItem key={t.cit_servicio_clave} value={t.cit_servicio_clave}>{t.cit_servicio_descripcion}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        {isExpedientesTramite() ? (
                                            <Autocomplete
                                                multiple freeSolo options={[]}
                                                value={expedientes}
                                                onChange={(_, newValue) => setExpedientes(newValue)}
                                                renderValue={(value, getTagProps) =>
                                                    value.map((option, index) => {
                                                    // Extraemos la key explícitamente para evitar el error anterior
                                                    const { key, ...tagProps } = getTagProps({ index });
                                                    return (
                                                        <Chip
                                                        key={key} 
                                                        label={option}
                                                        size="small"
                                                        {...tagProps}
                                                        />
                                                    );
                                                    })
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Expedientes"
                                                        placeholder="Escribe y presiona Enter"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <TextField
                                                fullWidth multiline label="Notas" value={notas}
                                                onChange={e => setNotas(e.target.value)}
                                                slotProps={{
                                                    input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start" sx={{ color: '#252b50' }}>
                                                        <NotesIcon />
                                                        </InputAdornment>
                                                    ),
                                                    },
                                                }}
                                                placeholder='Escribe aquí tus notas...'
                                                // InputProps={{ startAdornment: <InputAdornment position="start"><NotesIcon /></InputAdornment> }}
                                            />
                                        )}
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <Typography variant="caption" fontWeight={700} color={C.dark}>FECHA</Typography>
                                        <Card variant="outlined" sx={{ mt: 1 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateCalendar
                                                    value={fecha}
                                                    onChange={val => setFecha(val)}
                                                    shouldDisableDate={d => !fechas.includes(d.format('YYYY-MM-DD'))}
                                                    disabled={!tramite || loadingFechas}
                                                />
                                            </LocalizationProvider>
                                        </Card>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <Typography variant="caption" fontWeight={700} color={C.dark}>HORA DISPONIBLE</Typography>
                                        <Card variant="outlined" sx={{ mt: 1, height: 338, overflowY: 'auto' }}>
                                            {loadingHoras ? (
                                            <Box 
                                                display="flex" 
                                                flexDirection="column" 
                                                alignItems="center" 
                                                justifyContent="center" 
                                                height="100%" 
                                                p={4}
                                            >
                                                <CircularProgress size={32} sx={{ color: '#252b50', mb: 2 }} />
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                    CARGANDO HORARIOS...
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <List dense sx={{ p: 1 }}>
                                                {/* Validación: Si no hay horas y ya se seleccionó una fecha */}
                                                {horas.length === 0 && (
                                                    <Box sx={{ py: 8, textAlign: 'center' }}>
                                                        <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                                            {fecha ? 'No hay horas disponibles para este día' : 'Selecciona una fecha primero'}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Mapeo de horas disponibles */}
                                                {horas.map((h) => (
                                                    <ListItemButton
                                                        key={h}
                                                        selected={hora === h}
                                                        onClick={() => setHora(h)}
                                                        sx={{
                                                            borderRadius: 1.5,
                                                            mb: 0.5,
                                                            '&.Mui-selected': {
                                                                bgcolor: '#252b50',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: '#1e2545' },
                                                                '& .MuiListItemIcon-root': { color: 'white' }
                                                            },
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                            <AccessTime 
                                                                sx={{ 
                                                                    fontSize: 18, 
                                                                    color: hora === h ? 'inherit' : 'action.disabled' 
                                                                }} 
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={h.slice(0, 5)} 
                                                            primaryTypographyProps={{ 
                                                                variant: 'body2', 
                                                                fontWeight: hora === h ? 700 : 500 
                                                            }} 
                                                        />
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        )}
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* ── Panel derecho: Resumen ── */}
                            <Box sx={{ width: { md: 300 }, bgcolor: 'grey.50', p: 3, borderLeft: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ bgcolor: C.dark, borderRadius: 2, p: 1.5, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventAvailable sx={{ color: 'white' }} />
                                    <Typography variant="subtitle2" color="white" fontWeight={700}>RESUMEN</Typography>
                                </Box>

                                <SummaryRow label="Distrito" value={distritos.find(d => d.clave === distrito)?.nombre} empty={!distrito} icon={<LocationCityIcon />} />
                                <SummaryRow label="Oficina" value={oficina?.descripcion} empty={!oficina} icon={<BusinessIcon />} />
                                <SummaryRow label="Trámite" value={tramite ? <Box component={'span'}><Chip label={tramites.find(t => t.cit_servicio_clave === tramite)?.cit_servicio_descripcion} size="small" sx={{ fontSize: 10 }} /> </Box>: null} empty={!tramite} icon={<Assignment />} />
                                <SummaryRow label="Fecha" value={fecha?.format('DD/MM/YYYY')} empty={!fecha} icon={<CalendarMonth />} />
                                <SummaryRow label="Hora" value={hora} empty={!hora} icon={<AccessTime />} />
                                <SummaryRow
                                    label={isExpedientesTramite() ? 'Expedientes' : 'Notas'}
                                    value={notasResumen || 'Sin capturar'}
                                    empty={!notasResumen}
                                    icon={<NotesIcon sx={{ fontSize: 16 }} />}
                                    />

                                
                                <Box sx={{ mt: 16, px: 1 }}>
                                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                    {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
                                    <Button
                                        fullWidth variant="contained" size="large"
                                        onClick={handleSubmit}
                                        disabled={!isFormComplete || loadingSubmit}
                                        sx={{ bgcolor: C.dark, py: 1.5, fontWeight: 700 }}
                                    >
                                        {loadingSubmit ? <CircularProgress size={24} color="inherit" /> : 'AGENDAR CITA'}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Box>
                {/* Componente de Diálogo */}
                <CitaConfirmadaDialog
                    open={openConfirm}
                    handleClose={handleCloseConfirm}
                    cita={citaCreada}
                    isSuccess={isSuccess}
                />
            </Container>
        );
    };

export default NewAppointment;