import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"

dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use("/auth", proxy(process.env.AUTH_URI))

app.get("/",(req,res)=>{
    res.json({"message":"this is home route"})
})
app.listen(PORT,()=> {
    console.log(`gateway is running at http:localhost:${PORT}`)
})