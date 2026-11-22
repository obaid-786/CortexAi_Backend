import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config()
const app = express()
app.use(express.json())
const PORT = process.env.PORT

app.get("/",(req,res)=>{
    res.json({"message":"this is AUTH"})
})
app.listen(PORT,()=> {
    console.log(`AUTH is running at ${PORT}`)
    connectDb();
})