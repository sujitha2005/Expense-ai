import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 🔐 Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        console.log("Registration attempt for:", email);
        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables!");
            throw new Error("Server configuration error");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Registration failed: User already exists -", email);
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });
        console.log("User created successfully:", email);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message });
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
