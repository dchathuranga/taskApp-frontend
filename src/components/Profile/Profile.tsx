import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { fetchProfile, updateProfile } from '../../redux/slices/profileSlice';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const userId = useSelector((state: RootState) => state.auth.user.id);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      dispatch(updateProfile({ userId, ...formData }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;
