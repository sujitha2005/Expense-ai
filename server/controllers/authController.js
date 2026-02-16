import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Simple email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 🔐 Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        console.log("Registration attempt for:", email);
        
        // Validate required fields
        if (!name || !email || !password) {
            console.log("Registration failed: Missing required fields");
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            console.log("Registration failed: Invalid email format", email);
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Validate password length
        if (password.length < 6) {
            console.log("Registration failed: Password too short");
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables!");
            throw new Error("Server configuration error");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Registration failed: User already exists -", email);
            return res.status(400).json({ message: "User already exists" });
        }

        try {
            const user = await User.create({ name, email, password });
            console.log("User created successfully:", email);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } catch (mongoError) {
            console.error("MongoDB error during user creation:", mongoError.message);
            if (mongoError.code === 11000) {
                return res.status(400).json({ message: "Email already registered" });
            }
            throw mongoError;
        }
    } catch (error) {
        console.error("Registration error details:", {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack?.split('\n').slice(0, 5).join('\n')
        });
        res.status(500).json({ message: error.message || "Registration failed" });
    }
};

// 🔓 Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt for:", email);
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            console.log("Login successful:", email);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            console.log("Login failed: Invalid credentials for", email);
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};
