import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

function App() {
  const location = useLocation();
  const [clicked, setClicked] = useState(false);

  const handleButtonClick = () => {
    setClicked(true);
  };


  const isLoginOrRegister = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/history' || location.pathname === '/resume_eval';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {!isLoginOrRegister && !clicked && (
        <>
          <Button onClick={handleButtonClick} variant="outlined" sx={{ marginRight: '10px' }}>
            <NavLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</NavLink>
          </Button>
          <Button onClick={handleButtonClick} variant="outlined">
            <NavLink to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</NavLink>
          </Button>
        </>
      )}
      <Outlet/>
    </Box>
  );
}

export default App;
