import React from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Perform logout logic here
        navigate("/login"); // Navigate to the login page after logout
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="title">DigitalShelf</h1>
            </div>
            <div className="header-right">
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
