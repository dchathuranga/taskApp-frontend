import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, TextField, Button, Box, Typography, Link } from '@mui/material';
import { signIn, ISignInData } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<ISignInData>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    dispatch(signIn(formData));
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          disabled={status.loading}
        >
          Login
        </Button>
        {status.loading && <Typography variant="body2">Loading...</Typography>}
        {status.message && <Typography variant="body2" color="error">{status.message}</Typography>}
      </Box>
      <Box mt={2}>
        <Typography variant="body2">
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;