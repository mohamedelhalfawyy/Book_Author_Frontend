import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Registration.css';
import Footer from "./Common/footer";

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        username: '',
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            toast.error(
                'Password must be at least 8 characters long and contain at least one special character and one number.'
            );
            return;
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(formData.username)) {
            toast.error('Username must contain only letters and numbers.');
            return;
        }


        try {
            // check if user exists
            const response = await fetch('http://localhost:8000/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // If the response indicates an error, display an error message
                toast.error("Invalid username or password. Please try again.");
                return;
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refresh', data.refresh);

            navigate('/books');
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <div className="registration-container">

                <form className="registration-form" onSubmit={handleSubmit}>
                    <h2>Login Form</h2>

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>

                    <p>
                        Don't have an account?{' '}
                        <Link to="/registration">Register here</Link>
                    </p>
                </form>

            <ToastContainer position="top-right" />
            <Footer />
        </div>
    );
};

export default LoginForm;
