import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
    Stack, Typography, InputAdornment, Alert, Card, 
    List, ListItemButton, ListItemIcon, ListItemText, CircularProgress,
    Divider, Chip, Grid, Container,
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';
import { AccessTime, Assignment, CalendarMonth, EventAvailable, Description as DescriptionIcon} from '@mui/icons-material';
import NotesIcon from '@mui/icons-material/Notes';

// Acciones y Tipos
import { 
    getDistritos, getOficinasFiltradas, getFechasDisponibles, 
    getHorasDisponibles, getServiciosPorOficina, createCita, Distrito, 
    ExpedienteRow,
    JuzgadoOrigen,
    getJuzgadosOrigen
} from '../actions/CitasActions';
import CitaConfirmadaDialog from './CitaConfirmadaDialog';

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
    dark:  '#000',
    mid:   '#000',
    light: '#ffffff',
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

    // ─ Campos del formulario ─
    const [distrito,    setDistrito]    = useState('');
    const [oficina,     setOficina]     = useState<Oficina | null>(null);
    const [tramite,     setTramite]     = useState('');
    const [notas,       setNotas]       = useState('');
    const [expedientes, setExpedientes] = useState<ExpedienteRow[]>([]);
    const [juzgados,    setJuzgados]    = useState<JuzgadoOrigen[]>([]);
    const [expInput,    setExpInput]    = useState({expediente: '', juzgadoId: ''});
    const [fecha,       setFecha]       = useState<Dayjs | null>(null);
    const [hora,        setHora]        = useState('');

    // ─ Datos remotos ─
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    const [oficinas, setOficinas] = useState<Oficina[]>([]);
    const [tramites, setTramites] = useState<OficinaServicio[]>([]);
    const [fechas, setFechas] = useState<string[]>([]);
    const [horas, setHoras] = useState<string[]>([]);
    
    // ─ Estados para el Diálogo de Confirmación ─
    const [dialog, setDialog] = useState<{ open: boolean, cita: any | null, isSuccess: boolean}>({ open: false, cita: null, isSuccess: false });
    
    // ─ Submit y Mensajes ─
    const [loadingStep, setLoadingStep] = useState<'distrito' | 'oficinas' | 'tramites' | 'fechas' | 'horas' | null>(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isExpedientesTramite = useMemo(() => {
        const t = tramites.find(t => t.cit_servicio_clave === tramite);
        return t?.cit_servicio_descripcion.toLowerCase().includes('expediente') ?? false;
    }, [tramites, tramite]);

    const notasResumen = useMemo((): string | null => {
        if (isExpedientesTramite) {
            if (expedientes.length === 0) return null;
            return expedientes.map(e => {
                const j = juzgados.find(j => j.clave === e.juzgadoId);
                return `${e.expediente} (${j?.descripcion ?? e.juzgadoId})`;
            }).join(', ');
        }
        const n = notas.trim();
        return n.length > 0 ? n : null;
    }, [isExpedientesTramite, expedientes, juzgados, notas]);

    const isFormComplete = useMemo(() => {
        const notasValidas = isExpedientesTramite 
            ? expedientes.length > 0    // si es expediente, debe tener al menos uno
            : notas.trim().length > 0;   // si es notas, no debe estar vacío
        
        return !!(oficina && tramite && fecha && hora && notasValidas);
    }, [oficina, tramite, fecha, hora,notas, isExpedientesTramite, expedientes]);


    // ─ Handler para agregar expediente a la tabla ─
    const handleAddExpediente = useCallback(() => {
        const exp = expInput.expediente.trim();
        if(expedientes.length >= 5) {
            setError('No puedes agregar más de 5 expedientes.');
            return;
        }
        if (!exp || !expInput.juzgadoId) return;
        setExpedientes(prev => [...prev, { expediente: exp, juzgadoId: expInput.juzgadoId }]);
        setExpInput({ expediente: '', juzgadoId: '' });
    }, [expInput, expedientes]);

    const handleRemoveExpediente = useCallback((index: number) => {
        setExpedientes(prev => prev.filter((_, i) => i !== index));
    }, []);


    const handleCloseConfirm = useCallback(() =>  {
        setOficina(null); 
        setTramite(''); 
        setNotas('');
        setExpedientes([]);
        setExpInput({ expediente: '', juzgadoId: '' }); 
        setFecha(null); 
        setHora('');
        setDistrito(''); 
        setDialog({ open: false, cita: null, isSuccess: false });
        
    }, []);

    const handleSubmit = useCallback(async () => {
        setError(null);
        if (!isFormComplete) return;
        setLoadingSubmit(true);

        const finalNotas = isExpedientesTramite
            ? expedientes.map(e => `${e.expediente} (${juzgados.find(j => j.clave === e.juzgadoId)?.descripcion ?? e.juzgadoId})`).join('; ')
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
            setTimeout(() => {
                setDialog({ open: true, cita: nuevaCita, isSuccess: true });
                setLoadingSubmit(false);

            }, 1500);
            
        } catch (e: any) {
            setTimeout(() => {
                setError(e.message || 'Error al agendar la cita.');
                setLoadingSubmit(false);
            }, 1500);
        } 
    }, [isFormComplete, notas, tramite, fecha, hora, oficina, expedientes, juzgados, isExpedientesTramite]);


    // ─── Lógica de Efectos ────────────────────────────────
    useEffect(() => {
        const obtener = async () => {
            setLoadingStep('distrito');
            try {
                const res: Distrito[] = await getDistritos();
                if (Array.isArray(res)) {
                    const sorted = res.sort((a: Distrito, b: Distrito) => {
                        const PRIMERO = 'CIUDAD JUDICIAL DE SALTILLO';
                        if (a.nombre === PRIMERO) return -1;
                        if (b.nombre === PRIMERO) return 1;
                        return a.nombre.localeCompare(b.nombre);
                    });
                    setDistritos(sorted);
                } else {
                    setDistritos([]);
                    setError('Error al cargar distritos.');
                }
            } catch (e) {
                console.error('Error al obtener distritos:', e);
                setError('No se pudieron cargar los distritos.');
            } finally {
                setLoadingStep(null);
            }
        };
        obtener();
    }, []);

    // Cada que cambia el distrito, reseteamos los campos dependientes y cargamos las oficinas
    useEffect(() => {
        setOficina(null); setTramite(''); setFechas([]); setHoras([]);
        if (!distrito) return;
        setLoadingStep('oficinas');
        getOficinasFiltradas(distrito)
        .then(res => setOficinas(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingStep(null));
    }, [distrito]);

    // Cada que cambia la oficina, reseteamos los campos dependientes y cargamos los trámites
    useEffect(() => {
        setTramite(''); setFechas([]); setHoras([]);
        if (!oficina) return;
        setLoadingStep('tramites');
        getServiciosPorOficina(oficina.clave)
        .then(res => setTramites(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingStep(null));
    }, [oficina]);

    // Cada que cambia el trámite, reseteamos los campos dependientes y cargamos las fechas
    useEffect(() => {
        setFecha(null); setFechas([]); setHoras([]);
        if (!oficina || !tramite) return;
        setLoadingStep('fechas');
        getFechasDisponibles(oficina.clave, tramite)
        .then(res => setFechas(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingStep(null));
    }, [oficina, tramite]);

    // Cada que cambia la fecha, reseteamos el campo de hora y cargamos las horas disponibles
    useEffect(() => {
        setHora(''); setHoras([]);
        if (!oficina || !tramite || !fecha) return;
        setLoadingStep('horas');
        getHorasDisponibles(oficina.clave, tramite, fecha.format('YYYY-MM-DD'))
        .then(res => setHoras(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingStep(null));
    }, [oficina, tramite, fecha]);
   
    // cargar juzgados origen
    useEffect(() => {
        if(!isExpedientesTramite) return;
        getJuzgadosOrigen()
            .then(data => setJuzgados(data))
            .catch(err => console.error('Error al cargar juzgados origen:', err));
    }, [isExpedientesTramite]);
    return (        
            <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex',alignContent: 'center', py: 16, px: { xs: 1, sm: 3, md: 5 } }}>

                <Box mx="auto" width="100%">
                    <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4, width: '100%' }}>
                        <Box display="flex" minHeight={600} flexDirection={{ xs: 'column', md: 'row' }}>
                            
                            {/* ── Panel izquierdo: Formulario ── */}
                            <Box flex={1} sx={{ p: 4, borderRight: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h5" fontWeight={700} mb={3} color={C.dark} gutterBottom>
                                    Nueva Cita
                                </Typography>
                                
                                <Grid container spacing={3}>
                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <FormControl fullWidth>
                                            <InputLabel id="distrito-label">Ubicación</InputLabel>
                                            <Select
                                                labelId="distrito-label"
                                                value={distrito}
                                                label="Ubicación"
                                                onChange={e => setDistrito(e.target.value)}
                                                startAdornment={<InputAdornment position="start"><LocationCityIcon /></InputAdornment>}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona una ubicación</span>;
                                                    }
                                                    return distritos.find(d => d.clave === selected)?.nombre || '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>Selecciona una ubicación</MenuItem>
                                                {distritos.map(d => 
                                                    <MenuItem key={d.clave} value={d.clave}>
                                                        {d.clave === 'DSAL-CJ' ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Chip 
                                                                    label="Nuevo" 
                                                                    size="small" 
                                                                    sx={{ 
                                                                        backgroundColor: '#000',
                                                                        color: 'white', 
                                                                        fontSize: '0.65rem',
                                                                        height: 20
                                                                    }} 
                                                                />
                                                                {d.nombre}
                                                            </Box>
                                                        ) : (
                                                            d.nombre
                                                        )}
                                                    </MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <FormControl fullWidth disabled={!distrito}>
                                            <InputLabel>Unidad</InputLabel>
                                            <Select
                                                value={oficina?.clave || ''}
                                                label="Unidad"
                                                onChange={e => setOficina(oficinas.find(o => o.clave === e.target.value) || null)}
                                                startAdornment={<InputAdornment position="start"><BusinessIcon /></InputAdornment>}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona una unidad</span>;
                                                    }
                                                    return oficinas.find(o => o.clave === selected)?.descripcion || '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>Selecciona una unidad</MenuItem>
                                                {oficinas.map(o => <MenuItem key={o.clave} value={o.clave}>{o.descripcion}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <FormControl fullWidth disabled={!oficina}>
                                            <InputLabel>Tipo de trámite</InputLabel>
                                            <Select
                                                value={tramite}
                                                label="Tipo de trámite"
                                                onChange={e => setTramite(e.target.value)}
                                                startAdornment={<InputAdornment position="start"><Assignment /></InputAdornment>}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona un tipo de trámite</span>;
                                                    }
                                                    return tramites.find(t => t.cit_servicio_clave === selected)?.cit_servicio_descripcion || '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>Selecciona un tipo de trámite</MenuItem>
                                                {tramites.map(t => 
                                                    <MenuItem key={t.cit_servicio_clave} value={t.cit_servicio_clave}>
                                                        {t.cit_servicio_descripcion}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* */}

                                    <Grid size={{ md: 6, xs: 12 }}>
                                        {isExpedientesTramite ? (
                                            <Box>
                                                <Stack spacing={1} mb={1}>
                                                {/* ── Inputs para agregar ── */}
                                                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                                        <TextField
                                                            size="small"
                                                            label="Expediente"
                                                            value={expInput.expediente}
                                                            onChange={e => setExpInput(prev => ({ ...prev, expediente: e.target.value }))}
                                                            onKeyDown={e => e.key === 'Enter' && handleAddExpediente()}
                                                            placeholder="Ej. 123/2026"
                                                            disabled={expedientes.length >= 5}
                                                            fullWidth
                                                            slotProps={{
                                                                input: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <DescriptionIcon fontSize="small" sx={{ color: '#9e9e9e' }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                },
                                                            }}
                                                        />

                                                        <FormControl size="small" fullWidth>
                                                            <InputLabel shrink id="juzgado-label">Juzgado</InputLabel>
                                                            <Select
                                                                value={expInput.juzgadoId}
                                                                label="Juzgado"
                                                                onChange={e => setExpInput(prev => ({ ...prev, juzgadoId: e.target.value }))}
                                                                disabled={expedientes.length >= 5}
                                                                displayEmpty
                                                                renderValue={(selected) => {
                                                                    if (!selected) {
                                                                        return <span style={{ color: '#9e9e9e' }}>Selecciona un juzgado</span>;
                                                                    }
                                                                    return juzgados.find(j => j.clave === selected)?.descripcion || '';
                                                                }}

                                                            >
                                                                <MenuItem value="" disabled>Selecciona un juzgado</MenuItem>
                                                                {juzgados.map(j => (
                                                                    <MenuItem key={j.clave} value={j.clave}>
                                                                        {j.descripcion}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>

                                                        <Button
                                                            variant="contained"
                                                            onClick={handleAddExpediente}
                                                            disabled={!expInput.expediente.trim() || !expInput.juzgadoId || expedientes.length >= 5}
                                                            sx={{ bgcolor: C.dark, minWidth: 40, px: 1.5, height: 40, flexShrink: 0 }}
                                                        >
                                                            <Typography fontWeight={700} fontSize={20} lineHeight={1}>+</Typography>
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                                {expedientes.length >= 5 && (
                                                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                                                        Límite máximo de 5 expedientes alcanzado.
                                                    </Typography>
                                                )}

                                                {/* ── Tabla ── */}
                                                <Card variant="outlined" sx={{ mt: 1 }}>
                                                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                                        <Box component="thead">
                                                            <Box component="tr" sx={{ bgcolor: '#000', color: 'white' }}>
                                                                <Box component="th" sx={{ p: 1, textAlign: 'left', borderBottom: '1px solid', borderColor: 'divider', fontWeight: 700, width: '45%' }}>
                                                                    Expediente
                                                                </Box>
                                                                <Box component="th" sx={{ p: 1, textAlign: 'left', borderBottom: '1px solid', borderColor: 'divider', fontWeight: 700 }}>
                                                                    Juzgado
                                                                </Box>
                                                                <Box component="th" sx={{ p: 1, width: 32, borderBottom: '1px solid', borderColor: 'divider' }} />
                                                            </Box>
                                                        </Box>
                                                        <Box component="tbody">
                                                            {expedientes.length === 0 ? (
                                                                <Box component="tr">
                                                                    <Box component="td" colSpan={3} sx={{ p: 2, textAlign: 'center', color: 'text.disabled', fontStyle: 'italic' }}>
                                                                        Sin expedientes agregados
                                                                    </Box>
                                                                </Box>
                                                            ) : (
                                                                expedientes.map((row, i) => {
                                                                    const juzgado = juzgados.find(j => j.clave === row.juzgadoId);
                                                                    return (
                                                                        <Box component="tr" key={i} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                                                                            <Box component="td" sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                                                                                {row.expediente}
                                                                            </Box>
                                                                            <Box component="td" sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                                                                                {juzgado?.descripcion ?? row.juzgadoId}
                                                                            </Box>
                                                                            <Box component="td" sx={{ p: 0.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                                                                                <Button
                                                                                    size="small"
                                                                                    onClick={() => handleRemoveExpediente(i)}
                                                                                    sx={{ minWidth: 28, p: 0.25, color: 'error.main' }}
                                                                                >
                                                                                    ✕
                                                                                </Button>
                                                                            </Box>
                                                                        </Box>
                                                                    );
                                                                })
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Box>
                                        ) : (
                                            <TextField
                                                fullWidth multiline label="Notas" value={notas}
                                                onChange={e => setNotas(e.target.value)}
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ color: '#9e9e9e' }}>
                                                                <NotesIcon />
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                placeholder='Escribe aquí tus notas...'
                                            />
                                        )}
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <Typography variant="caption" fontWeight={700} color={C.dark}>FECHAS DISPONIBLES</Typography>
                                        <Card variant="outlined" sx={{ mt: 1 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateCalendar
                                                    value={fecha}
                                                    onChange={val => setFecha(val)}
                                                    shouldDisableDate={d => !fechas.includes(d.format('YYYY-MM-DD'))}
                                                    disabled={!tramite || loadingStep === 'fechas'}
                                                    sx={{
                                                        '& .MuiPickersDay-root.Mui-selected': {
                                                            backgroundColor: '#000 !important',
                                                            color: 'white !important',
                                                            '&:hover': {
                                                                backgroundColor: '#333 !important',
                                                            },
                                                            '&:focus': {
                                                                backgroundColor: '#000 !important',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Card>
                                    </Grid>

                                    <Grid size={{ md: 6, xs: 12 }} >
                                        <Typography variant="caption" fontWeight={700} sx={{color:'#000'}}>HORAS DISPONIBLES</Typography>
                                        <Card variant="outlined" sx={{ mt: 1, height: 338, overflowY: 'auto' }}>
                                            {loadingStep === 'horas' ? (
                                            <Box 
                                                display="flex" 
                                                flexDirection="column" 
                                                alignItems="center" 
                                                justifyContent="center" 
                                                height="100%" 
                                                p={4}
                                            >
                                                <CircularProgress size={32} sx={{ color: C.dark, mb: 2 }} />
                                                <Typography variant="caption" sx={{ color: '#000', fontWeight: 600 }}>
                                                    CARGANDO HORARIOS...
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <List dense sx={{ p: 1 }}>
                                                {/* Validación: Si no hay horas y ya se seleccionó una fecha */}
                                                {horas.length === 0 && (
                                                    <Box sx={{ py: 8, textAlign: 'center' }}>
                                                        <Typography variant="body2" sx={{ color: '#000', fontStyle: 'italic' }}>
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
                                                                bgcolor: '#000',
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
                            <Box 
                                sx={{ 
                                    width: { md: 300 }, 
                                    bgcolor: 'grey.50', 
                                    p: {xs: 2, sm: 3, md: 4}, 
                                    borderLeft: '1px solid', 
                                    borderColor: 'divider',
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    overflow: 'hidden',
                                    minWidth: 0,
                                }}
                            >
                                <Box sx={{ bgcolor: C.dark, borderRadius: 2, p: 1.5, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventAvailable sx={{ color: 'white' }} />
                                    <Typography variant="subtitle2" color="white" fontWeight={700}>RESUMEN</Typography>
                                </Box>

                                <SummaryRow label="Ubicación" value={distritos.find(d => d.clave === distrito)?.nombre} empty={!distrito} icon={<LocationCityIcon />} />
                                <SummaryRow label="Unidad" value={oficina?.descripcion} empty={!oficina} icon={<BusinessIcon />} />
                                <SummaryRow label="Tipo de trámite" value={tramite ? 
                                    <Box component={'span'}>
                                        <Chip 
                                            label={tramites.find(t => t.cit_servicio_clave === tramite)?.cit_servicio_descripcion} 
                                            size="small" 
                                            sx={{
                                                backgroundColor:'#000', 
                                                color:'white', 
                                                height: 'auto',
                                                '& .MuiChip-label': {
                                                    whiteSpace: 'normal',
                                                    display: 'block',
                                                    py: 0.5,
                                                }
                                            }} 
                                        /> 
                                    </Box>
                                    : null} empty={!tramite} icon={<Assignment />} 
                                />
                                <SummaryRow label="Fecha" value={fecha?.format('DD/MM/YYYY')} empty={!fecha} icon={<CalendarMonth />} />
                                <SummaryRow label="Hora" value={hora} empty={!hora} icon={<AccessTime />} />
                                <SummaryRow
                                    label={ isExpedientesTramite ? 'Expedientes' : 'Notas'}
                                    value={notasResumen || 'Sin capturar'}
                                    empty={!notasResumen}
                                    icon={ 
                                        isExpedientesTramite ? <DescriptionIcon sx={{ fontSize: 16 }} /> :<NotesIcon sx={{ fontSize: 16 }} />
                                    }
                                />

                                
                                <Box sx={{ mt: 16, px: 1 }}>
                                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                    {/* <Alert severity="success" sx={{ mb: 2 }}></Alert> */}
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
                    open={dialog.open}
                    handleClose={handleCloseConfirm}
                    cita={dialog.cita}
                    isSuccess={dialog.isSuccess}
                />

            </Container>
        );
    };

export default NewAppointment;