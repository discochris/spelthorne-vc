// components/Sessions.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { CalendarToday, LocationOn, People, Payment } from '@mui/icons-material';
import { sessionService } from '../services/sessions';

const Sessions = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const sessionsData = await sessionService.getSessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setMessage({ type: 'error', text: 'Failed to load sessions' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (sessionId) => {
    setRegistering(true);
    try {
      await sessionService.registerForSession(sessionId, user.uid);
      setMessage({ type: 'success', text: 'Successfully registered for session!' });
      setDialogOpen(false);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ type: 'error', text: 'Failed to register for session' });
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Training Sessions
      </Typography>

      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {sessions.map((session) => (
          <Grid item xs={12} md={6} lg={4} key={session.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {session.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(session.date)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="textSecondary">
                    {session.venue}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="textSecondary">
                    Max {session.maxParticipants} players
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Payment sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="textSecondary">
                    £{session.cost}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {session.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`}
                    size="small"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedSession(session);
                      setDialogOpen(true);
                    }}
                  >
                    Register
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Registration Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedSession && (
          <>
            <DialogTitle>Register for {selectedSession.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {formatDate(selectedSession.date)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Time:</strong> {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Venue:</strong> {selectedSession.venue}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Cost:</strong> £{selectedSession.cost}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {selectedSession.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => handleRegister(selectedSession.id)}
                variant="contained"
                disabled={registering}
              >
                {registering ? <CircularProgress size={20} /> : 'Confirm Registration'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Sessions;
