// Componente para validar la contraseña
import React from 'react';
import { TextField, Box } from '@mui/material';

const ValidatePassword: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 400 }}>
            <TextField
                fullWidth
                variant="outlined"
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                type="password"
                slotProps={{
                    input: {
                        autoComplete: 'off'
                    },
                    inputLabel: {
                        shrink: true,
                    }
                }}
                sx={{ mb: 2, input: { color: '#grey.700' }, label: { color: '#045e2c' } }}
            />
            <TextField
                fullWidth
                variant="outlined"
                label="Confirmar Contraseña"
                placeholder="Ingrese su contraseña"
                type="password"
                slotProps={{
                    input: {
                        autoComplete: 'off'
                    },
                    inputLabel: {
                        shrink: true,
                    }
                }}
                sx={{ mb: 2, input: { color: '#grey.700' }, label: { color: '#045e2c' } }}
            />
        </Box>
    );
};

export default ValidatePassword;
