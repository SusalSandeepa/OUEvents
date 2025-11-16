import express from 'express';

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

app.get("/",
    (req,res)=>{
        console.log(req.body)
        console.log('Get request received')
        
        res.json(
            {
                message: "Hello from server!"
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
