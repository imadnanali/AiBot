import mongoose from "mongoose";

const useSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Please enter a valid Gmail address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true })

const User = mongoose.model("User", useSchema);
export default User;
