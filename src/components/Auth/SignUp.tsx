import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { signUp } from '../../redux/slices/authSlice';
import { useAppDispatch } from '../../redux/hooks';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password) return;
    if (password === confirmPassword) {
      dispatch(signUp({
        username,
        email,
        password
      }));
      navigate('/login');
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          name="username"
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          type="email"
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          onClick={handleSignUp}
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
