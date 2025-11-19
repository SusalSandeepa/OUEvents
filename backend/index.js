import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';

dotenv.config();// Load environment variables from .env file

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database Connected")
    }
).catch(
    ()=>{
        console.log("Database Connection Failed")
    }
)

app.use("/api/users", userRouter)

app.get("/",
    (req,res)=>{
        console.log(req.body)
        console.log('Get request received')

        res.json(
            {
                message: "Hello from server!!"
            }
        )
    }
)

app.post("/",
    (req, res)=>{
        console.log('Post request received')

        res.json(
            {
                message: "Post request received!"
            }
        )
    }
)

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
