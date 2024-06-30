import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { AddTaskData, ITask, addTask, updateTask } from '../../redux/slices/taskSlice';
import { useAppDispatch } from '../../redux/hooks';

interface AddTaskModalProps {
  open: boolean;
  handleClose: () => void;
  task?: ITask;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, handleClose, task }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setTags(task.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setTags([]);
    }
  }, [task]);

  const handleSaveTask = () => {
    if (!title) return;
    const newTask: AddTaskData = { title, description, dueDate, tags };

    if (task) {
      dispatch(updateTask({ ...task, ...newTask }));
    } else {
      dispatch(addTask(newTask));
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-task-modal-title"
      aria-describedby="add-task-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="add-task-modal-title" variant="h6" component="h2">
          {task ? 'Edit Task' : 'Add New Task'}
        </Typography>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          fullWidth
          label="Due Date and Time"
          type="datetime-local"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <TextField
          fullWidth
          label="Tags (comma separated)"
          margin="normal"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveTask} variant="contained" color="primary">
            {task ? 'Save Changes' : 'Add Task'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTaskModal;
