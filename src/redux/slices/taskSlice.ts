import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { ApiResponse } from '../../api/apiService';
import { RootState } from '../store';
import { AxiosResponse } from 'axios';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  tags?: string[];
  completed?: boolean;
}

interface TaskState {
  tasks: ITask[];
}

const initialState: TaskState = {
  tasks: [],
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse<ITask[]>> = await api.get(`/tasks`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch tasks');
  }
});

export type AddTaskData = Omit<ITask, '_id'>;

export const addTask = createAsyncThunk<
  ITask,
  AddTaskData,
  {
    rejectValue: string;
  }
>(
  'tasks/addTask',
  async (newTask, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<ApiResponse<ITask>> = await api.post('/tasks', newTask);
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk<ITask, ITask>('tasks/updateTask', async (updatedTask, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse<ITask>> = await api.put(`/tasks`, updatedTask);
    return response.data.data;
  } catch (error) {
    return rejectWithValue('Failed to update task');
  }
});

export const deleteTask = createAsyncThunk<string, string>('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse<string>> = await api.delete(`/tasks/${taskId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue('Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const existingTaskIndex = state.tasks.findIndex((task) => task._id === updatedTask._id);
      if (existingTaskIndex === -1) return;
      if (updatedTask.completed) {
        state.tasks.splice(existingTaskIndex, 1);
      } else {
        state.tasks[existingTaskIndex] = updatedTask;
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const deletedTaskId = action.payload;
      state.tasks = state.tasks.filter((task) => task._id !== deletedTaskId);
    });
  },
});

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskById = (taskId: string) => (state: RootState) =>
  state.tasks.tasks.find((task) => task._id === taskId);

export default taskSlice.reducer;
