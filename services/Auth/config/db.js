import mongoose from "mongoose"

export default async function connectDb () {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db is connected")
    } catch (error) {
        console.log(`db showing ${error}`)
    }
}