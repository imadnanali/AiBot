import express from "express"
import mongoose from "mongoose"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const signUp = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Missing required field" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User already exist!" });
        }

        const hashPass = await bcrypt.hash(password, 10)
        if (!hashPass) {
            res.status(400).json({ message: "Password not hashed!" })
        }

        const user = await User.create({ name, email, password: hashPass });

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '3d' });
        res.status(201).json({ message: "User created successfuly", token, user })
    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Fill all fields" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ message: "User not found!" })
        }
        const userPassCompare = await bcrypt.compare(password, user.password)
        if (!userPassCompare) {
            res.status(400).json({ message: "Wrong password" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY)
        if (!token) {
            res.status(201).json({ message: "Token not generated" })
        }
        res.status(200).json({ message: "User login successfully", user, token })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const currUser = (req, res) => {
    const user = req.user
    res.status(200).json({ user })
}