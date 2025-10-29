import jwt from "jsonwebtoken"
import User from "../model/user.model.js"
import "dotenv/config"

const isAuthenticate = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized" })
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(403).json({ message: "Token is not provided" })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
            if (!decoded) {
            return res.status(403).json({ message: "User not found" })
        }
        const user = await User.findById(decoded.userId).select("-password")
        req.user = user
        console.log(user)
        next()

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export default isAuthenticate;