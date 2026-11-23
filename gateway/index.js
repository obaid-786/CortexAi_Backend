import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
dotenv.config()
const app = express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(cookieParser())
const PORT = process.env.PORT


app.use("/auth", proxy(process.env.AUTH_URI, {
  proxyReqPathResolver: (req) => {
    console.log("FORWARDING:", req.method, req.originalUrl, "->", req.originalUrl)
    return req.originalUrl
  },
  proxyErrorHandler: (err, res, next) => {
    console.error("PROXY ERROR:", err)
    res.status(502).json({ error: err.message })
  }
}))

app.get("/",(req,res)=>{
    res.json({"message":"this is home route"})
})

// LAST middleware — 
app.use((err, req, res, next) => {
  console.error("Gateway error:", err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT,()=> {
    console.log(`gateway is running at http:localhost:${PORT}`)
})