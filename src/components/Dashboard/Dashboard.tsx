import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Typography, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { RootState } from '../../redux/store';
import TaskList from '../Task/TaskList';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { useAppDispatch } from '../../redux/hooks';
import AddTaskModal from '../Task/AddTaskModal';
import { fetchTasks } from '../../redux/slices/taskSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useSelector((state: RootState) => ({
    userId: state.auth.user.id,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks());
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight="bold">
              Dashboard
            </Typography>
            <Box>
              <Tooltip title="Add New Task">
                <IconButton
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                  sx={{ marginRight: 2, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  color="secondary"
                  onClick={handleLogout}
                  sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TaskList />
        </CardContent>
      </Card>
      <AddTaskModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </Container>
  );
};

export default Dashboard;
