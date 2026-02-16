import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("expense_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Failed to parse saved user:", error);
                localStorage.removeItem("expense_user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await API.post("/auth/login", { email, password });
            setUser(res.data);
            localStorage.setItem("expense_user", JSON.stringify(res.data));
            toast.success("Welcome back!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await API.post("/auth/register", { name, email, password });
            setUser(res.data);
            localStorage.setItem("expense_user", JSON.stringify(res.data));
            toast.success("Account created successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("expense_user");
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
