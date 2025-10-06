import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Simulations from './pages/Simulations';
import SimulationControle from './components/SimulationControle';
const SIDEBAR_WIDTH = 220;
const RIGHT_PANEL_WIDTH = 0;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <CssBaseline />

      {/* Top bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          width: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
          transition: 'all 0.3s',
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" noWrap component="div">
            Forklift Dispatch Simulator
          </Typography>
        </Toolbar>

      </AppBar>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main layout (center + right) */}
      <Box
        component="main"
        sx={{
          display: 'grid',
          gridTemplateColumns: `1fr ${RIGHT_PANEL_WIDTH}px`,
          gap: 2,
          ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          mt: '64px', // AppBar height
          minHeight: '100vh',
          p: 2,
          background: '#f5f5f5',
          transition: 'margin 0.3s',
        }}
      >
        {/* Center content */}
        <Box sx={{ background: '#fff', borderRadius: 2, p: 2, overflow: 'auto' }}>
          <Routes>
            <Route path="/forklifts" element={<Dashboard />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/" element={<Navigate to="/forklifts" replace />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
