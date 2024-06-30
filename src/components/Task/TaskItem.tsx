import React, { useState } from 'react';
import { ITask, updateTask } from '../../redux/slices/taskSlice';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { deleteTask } from '../../redux/slices/taskSlice';
import { useAppDispatch } from '../../redux/hooks';
import DeleteModal from './DeleteModal';
import AddTaskModal from './AddTaskModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface TaskItemProps {
  task: ITask;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completed, setCompleted] = useState(task.completed);

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
    setDeleteModalOpen(false);
  };

  const handleComplete = () => {
    setCompleted(!completed);
    setTimeout(() => {
      const newTask = { ...task, completed: true };
      dispatch(updateTask(newTask));
    }, 1000);
  };

  return (
    <Card variant="outlined" sx={{ marginBottom: 2, width: '100%' }}>
      <CardContent>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ flexWrap: 'wrap', width: '100%' }}
        >
          <Box flex={1} minWidth={{ xs: '100%', sm: '25%' }} sx={{ mb: { xs: 1, sm: 0 } }}>
            <Typography variant="h6">{task.title}</Typography>
          </Box>

          <Box flex={2} minWidth={{ xs: '100%', sm: '35%' }} sx={{ mb: { xs: 1, sm: 0 } }}>
            {task.description && (
              <Typography variant="body2" color="textSecondary">
                {task.description}
              </Typography>
            )}
          </Box>

          <Box flex={1} minWidth={{ xs: '100%', sm: '20%' }} sx={{ mb: { xs: 1, sm: 0 } }}>
            {task.dueDate && (
              <Typography variant="body2" color="textSecondary">
                Due: {new Date(task.dueDate).toLocaleString()}
              </Typography>
            )}
          </Box>

          <Box flex={1} display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} alignItems="center">
            <Tooltip title={completed ? "Mark as Incomplete" : "Mark as Complete"}>
              <IconButton onClick={handleComplete} color={completed ? 'success' : 'default'}>
                {completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Task">
              <IconButton color="primary" sx={{ marginRight: 1 }} onClick={() => setIsModalOpen(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton color="error" onClick={() => setDeleteModalOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>

      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onDelete={handleDelete} />
      <AddTaskModal task={task} open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </Card>
  );
};

export default TaskItem;
