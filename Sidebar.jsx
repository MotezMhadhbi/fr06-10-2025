import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useLocation, Link } from 'react-router-dom';

const navItems = [
  { text: 'Forklifts', icon: <DashboardIcon />, path: '/forklifts' },
  { text: 'Simulations', icon: <AssignmentIcon />, path: '/simulations' },
  { text: 'Orders', icon: <LocalShippingIcon />, path: '/orders' },
  { text: 'KPIs', icon: <BarChartIcon />, path: '/kpis' },
];

export default function Sidebar({ open, onToggle }) {
  const location = useLocation();

  return (
    <>
      
      <IconButton
        onClick={onToggle}
        color="primary"
        sx={{
          position: 'fixed',
          top: '50%',
          left: open ? 220 : 0,
          transform: 'translateY(-50%)',
          zIndex: 1400,
          backgroundColor: '#fff',
          boxShadow: 1,
          borderRadius: '0 4px 4px 0',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 220,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box' },
        }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}