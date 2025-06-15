// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { sessionService } from '../services/sessions';

const Dashboard = ({ user, userProfile }) => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingSessions();
  }, []);

  const loadUpcomingSessions = async () => {
    try {
      const sessions = await sessionService.getUpcomingSessions();
      setUpcomingSessions(sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {userProfile?.firstName}! 👋
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Membership Status
              </Typography>
              <Typography variant="h5" component="div">
                <Chip 
                  label={userProfile?.membershipType?.toUpperCase()} 
                  color="primary" 
                  variant="outlined"
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sessions This Month
              </Typography>
              <Typography variant="h5" component="div">
                {upcomingSessions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="h5" component="div">
                {userProfile?.joinDate ? 
                  new Date(userProfile.joinDate.seconds * 1000).getFullYear() : 
                  'N/A'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div">
                Upcoming Sessions
              </Typography>
              <Button variant="outlined" href="/sessions">
                View All Sessions
              </Button>
            </Box>
            
            {loading ? (
              <Typography>Loading sessions...</Typography>
            ) : upcomingSessions.length > 0 ? (
              <List>
                {upcomingSessions.slice(0, 5).map((session) => (
                  <ListItem key={session.id} divider>
                    <ListItemText
                      primary={session.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(session.date)} at {session.startTime}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {session.venue} • £{session.cost}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button variant="contained" size="small">
                      Book Now
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                No upcoming sessions available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
