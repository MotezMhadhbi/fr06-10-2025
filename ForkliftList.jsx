import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpdateIcon from '@mui/icons-material/Update';

export default function ForkliftList({ forklifts, onBlock, onUnblock, onStatusChange }) {
  const [statusInputs, setStatusInputs] = useState({});

  const handleStatusInput = (id, value) => {
    setStatusInputs(inputs => ({ ...inputs, [id]: value }));
  };

  return (
    <Grid container spacing={3}>
      {forklifts.map(forklift => (
        <Grid item xs={12} sm={6} md={4} key={forklift.ForkliftId}>
          <Card
            elevation={3}
            sx={{
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {forklift.name}
              </Typography>
              <Chip
                label={forklift.status}
                color={forklift.status === 'blocked' ? 'error' : 'primary'}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                Position:{' '}
                {forklift.displayX !== undefined && forklift.displayY !== undefined
                  ? `(${forklift.displayX}, ${forklift.displayY})`
                  : 'Unknown'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="error"
                startIcon={<BlockIcon />}
                onClick={() => onBlock(forklift.ForkliftId)}
                disabled={forklift.status === 'blocked'}
              >
                Block
              </Button>
              <Button
                size="small"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => onUnblock(forklift.ForkliftId)}
                disabled={forklift.status !== 'blocked'}
              >
                Unblock
              </Button>
              <TextField
                size="small"
                label="Set Status"
                value={statusInputs[forklift.ForkliftId] || ''}
                onChange={e => handleStatusInput(forklift.ForkliftId, e.target.value)}
                sx={{ width: 120 }}
              />
              <Button
                size="small"
                startIcon={<UpdateIcon />}
                onClick={() => {
                  onStatusChange(forklift.ForkliftId, statusInputs[forklift.ForkliftId] || '');
                  setStatusInputs(inputs => ({ ...inputs, [forklift.ForkliftId]: '' }));
                }}
              >
                Update
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
