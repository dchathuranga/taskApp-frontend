import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { List, ListItem } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
    <List>
      {tasks.map(task => (
        <ListItem key={task._id}>
          <TaskItem task={task} />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
