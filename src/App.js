import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Our App!
        </Typography>
        <Typography variant="body1" paragraph>
          This is a brief description of what our amazing app does. We hope you enjoy it!
        </Typography>
        <Button variant="contained">Get Started</Button>
      </Box>
    </Container>
  );
}

export default App;
