import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Registration.css';
import Footer from "./Common/footer";

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);

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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(formData.username)) {
            toast.error('Username must contain only letters and numbers.');
            return;
        }

        setLoading(true);

        try {

            // check if user exists
            await fetch('http://localhost:8000/users/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then(async (data) => {
                    for (const user of data) {
                        if (user.username === formData.username) {
                            toast.error('Username already exists. Please choose another.');
                            setLoading(false);
                            continue;
                        }

                        if (user.email === formData.email) {
                            toast.error('Email already exists. Please choose another.');
                            setLoading(false);
                            continue;
                        }

                        // submit the form data to the API
                        await fetch('http://localhost:8000/register/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData),
                        })
                            .then((response) => response.json())
                            .then(async (data) => {
                                // Generate user token
                                await fetch('http://localhost:8000/token/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(formData),
                                })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        localStorage.setItem('token', data.access);
                                        localStorage.setItem('refresh', data.refresh);

                                        navigate('/books');
                                    })
                                    .catch((error) => {
                                        console.error('Failed to generate token:', error);
                                    });

                                // Reset the form fields
                                setFormData({
                                    username: '',
                                    password: '',
                                    email: '',
                                });
                            })
                            .catch((error) => {
                                console.error('Registration failed:', error);
                            });
                    }
                })
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            {loading ? (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                </div>
            ) : (
                <form className="registration-form" onSubmit={handleSubmit}>
                    <h2>Registration Form</h2>
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

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Register</button>

                    <p className={"link"}>
                        Already have an account?{' '}
                        <Link to="/login">Login here</Link>
                    </p>
                </form>
            )}
            <ToastContainer position="top-right" />
            <Footer />
        </div>
    );
};

export default RegistrationForm;
