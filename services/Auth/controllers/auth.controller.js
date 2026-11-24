import { getAuth } from 'firebase-admin/auth'
import User from '../models/user.model.js'
import { app } from '../config/firebase.js'
import crypto from "node:crypto"
import redis from '../../../shared/redis/redis.js'

export const login = async (req, res) => {
    try {
        const { token } = req.body

        // 1. Validate input up front — otherwise verifyIdToken(undefined) throws a
        //    confusing error that ends up as a generic 500.
        if (!token) {
            return res.status(400).json({ message: "Missing Firebase ID token" })
        }

        const decoded = await getAuth(app).verifyIdToken(token)

        let user = await User.findOne({ firebaseUid: decoded.uid })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()
        await redis.set(`session-${sessionId}`, JSON.stringify({
            firebaseUid:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar
        }),"EX",7 * 24 * 60 * 60)
    
        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // 2. don't hardcode false
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // 3. Success log immediately before the response
        console.log("login success, sending:", {
            hasUser: !!user,
            userId: user._id
        })

        return res.status(200).json(user)

    } catch (error) {
        // 4. Log the full stack, not just the message — the stack names the exact line.
        console.error("login handler error:", error.stack)

        // 5. Distinguish auth failures (bad/expired token) from real server errors.
        //    verifyIdToken throws an error with a `code` like "auth/id-token-expired".
        if (error.code && error.code.startsWith("auth/")) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }

        return res.status(500).json({ message: "Login failed" })
    }
}

export const logut= async ()=>{
    try {
        const sessionId = req.cookie?.session
        await redis.del(`session-${sessionId}`)

        res.clearCookie('session')
        return res.status(200).json({message:"logout successful"})
    } catch (error) {
        return res.status(500).json({message:"logout failed"})
    }
}