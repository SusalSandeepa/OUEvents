import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import eventRouter from './routes/eventRouter.js';
import jwt from 'jsonwebtoken';

dotenv.config(); // Load environment variables from .env file

const app = express() 

// Middleware to parse JSON bodies
app.use(express.json())

// Middleware for user authentication (attach user details to request if token is valid)
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization") // Get the token from the Authorization header

        if(token != null){
            token = token.replace("Bearer ","") // Remove "Bearer " from the tokens
            jwt.verify(token,process.env.JWT_SECRET, // decode the token using the secret key
                (err, decoded)=>{
                    if(decoded == null){
                        res.json({
                            message : "Invalid token please login again"
                        })
                        return
                    }else{
                        req.user = decoded // attach decoded user details to the request object
                    }
                }
            )
        }
        next() // proceed to the next middleware or route handler
    }
)

const connectionString = process.env.MONGO_URI; // Get MongoDB connection string from environment variables

mongoose.connect(connectionString).then( // connect to MongoDB
    ()=>{
        console.log("Database Connected")
    }
).catch(
    ()=>{
        console.log("Database Connection Failed")
    }
)

app.use("/api/users", userRouter) 
app.use("/api/events", eventRouter)

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
