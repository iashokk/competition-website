// Frontend (React with Material-UI):
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error logging in');
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/register', { email, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>Login Page</Typography>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Box mt={2}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>Login</Button>
                </Box>
                <Box mt={2}>
                    <Button fullWidth variant="outlined" color="secondary" onClick={handleRegister}>Register</Button>
                </Box>
                {message && (
                    <Typography variant="body1" color="textSecondary" align="center" mt={2}>{message}</Typography>
                )}
            </Box>
        </Container>
    );
};

export default LoginPage;