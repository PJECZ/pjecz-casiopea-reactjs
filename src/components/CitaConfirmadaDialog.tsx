import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Fade,
  Grid,
  SvgIconProps
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  NoteAlt as NoteIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

// ─── Interfaces ─────────────────────────────────────────────
interface CitaData {
  id?: string | number;
  inicio?: string; // ISO string
  oficina_descripcion?: string;
  cit_servicio_descripcion?: string;
  notas?: string;
  codigo_acceso_url?: string;
}

interface CitaConfirmadaDialogProps {
  open: boolean;
  handleClose: () => void;
  cita: CitaData | null;
  isSuccess: boolean;
}

interface InfoItemProps {
  icon: React.ElementType<SvgIconProps>;
  label: string;
  value?: string;
  highlight?: boolean;
  compact?: boolean;
}

// ─── Subcomponente InfoItem ────────────────────────────────
const InfoItem: React.FC<InfoItemProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  highlight = false, 
  compact = false 
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: compact ? 1.5 : 2,
      borderRadius: 2,
      transition: 'all 0.2s ease',
      bgcolor: highlight ? '#f0f4ff' : 'transparent',
      border: highlight ? '1px solid #000' : '1px solid transparent',
      '&:hover': {
        bgcolor: '#f8f9fa',
      }
    }}
  >
    <Avatar
      sx={{
        bgcolor: highlight ? '#000' : '#e9ecef',
        color: highlight ? 'white' : '#000',
        width: compact ? 36 : 40,
        height: compact ? 36 : 40
      }}
    >
      <Icon sx={{ fontSize: compact ? 18 : 20 }} />
    </Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#6c757d',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.65rem',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 0.2,
          color: '#000',
          fontWeight: highlight ? 600 : 500,
          fontSize: compact ? '0.9rem' : (highlight ? '1rem' : '0.92rem'),
          wordBreak: 'break-word',
          lineHeight: 1.3
        }}
      >
        {value || 'No especificado'}
      </Typography>
    </Box>
  </Box>
);

// ══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════
const CitaConfirmadaDialog: React.FC<CitaConfirmadaDialogProps> = ({
  open,
  handleClose,
  cita,
  isSuccess,
}) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(18, 21, 40, 0.15)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#000',
          color: 'white',
          p: 3,
          position: 'relative',
          background: 'linear-gradient(135deg, #000 0%, #1e2442 50%, #000 100%)'
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              p: 1.5,
              borderRadius: '50%',
              mb: 1.5
            }}
          >
            <CheckIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Cita agendada
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, fontSize: '0.875rem' }}>
            {isSuccess 
              ? 'Tu cita fue creada correctamente' 
              : 'Revisa los detalles antes de confirmar'}
          </Typography>
        </Box>
      </Box>

      {/* Contenido */}
      <DialogContent sx={{ p: 3, bgcolor: 'white' }}>
        <Stack spacing={1.5}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#f0f4ff',
              borderRadius: 2,
              border: '1px solid #000'
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ md: 7, xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ fontSize: 20, color: '#000' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block' }}>
                      Fecha
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#000', fontWeight: 600, fontSize: '0.95rem' }}>
                      {cita?.inicio 
                        ? new Date(cita.inicio).toLocaleDateString('es-MX', {day: '2-digit', month:'2-digit', year:'numeric'}) 
                        : 'No especificada'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ md: 5, xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon sx={{ fontSize: 20, color: '#000' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block' }}>
                      Hora
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#000', fontWeight: 600, fontSize: '0.95rem' }}>
                      {cita?.inicio 
                        ? new Date(cita.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : '--:--'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <InfoItem
            icon={BusinessIcon}
            label="Oficina"
            value={cita?.oficina_descripcion}
            compact
          />

          <InfoItem
            icon={DescriptionIcon}
            label="Trámite"
            value={cita?.cit_servicio_descripcion}
            compact
          />

          <InfoItem
            icon={cita?.cit_servicio_descripcion?.toLowerCase().includes('expediente') 
              ? DescriptionIcon 
              : NoteIcon
            }
            label={cita?.cit_servicio_descripcion?.toLowerCase().includes('expediente') 
              ? 'Expediente' 
              : 'Notas'
            }
            value={cita?.notas || 'Sin información adicional'}
            compact
          />
        </Stack>
        
        {cita?.codigo_acceso_url && (
          <Box
            sx={{
                mt: 2.5,
                p: 2,
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                border: '1px dashed #dee2e6',
                textAlign: 'center'
            }}
          >
            <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
                Código de acceso
            </Typography>
            <img
                alt="qr"
                src={cita.codigo_acceso_url}
                width={200}
                style={{ borderRadius: 8 }}
            />
            <Typography variant="caption" display="block" mt={1.5} sx={{ color: '#000', fontWeight: 600, fontSize: '0.75rem' }}>
                {cita?.id}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: 2, p: 1.5, bgcolor: '#fff9e6', borderRadius: 2, borderLeft: '3px solid #ffc107',
            display: 'flex', gap: 1, alignItems: 'center'
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>💡</Typography>
          <Typography variant="body2" sx={{ color: '#856404', fontSize: '0.85rem' }}>
            Llega 15 minutos antes de la hora programada
          </Typography>
        </Box>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ p: 2.5, bgcolor: '#f8f9fa', gap: 1.5, borderTop: '1px solid #e9ecef' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: '#dee2e6', color: '#000', textTransform: 'none',
            fontWeight: 600, py: 1.2, borderRadius: 2, fontSize: '0.9rem',
            '&:hover': { borderColor: '#000', bgcolor: 'white' }
          }}
        >
          Cerrar
        </Button>

        <Button
          onClick={() => navigate('/homePage')}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#000', textTransform: 'none', fontWeight: 600,
            py: 1.2, borderRadius: 2, fontSize: '0.9rem',
            '&:hover': { bgcolor: '#1a1f3a', transform: 'translateY(-1px)' },
            transition: 'all 0.2s ease'
          }}
        >
          Ver mis citas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CitaConfirmadaDialog;