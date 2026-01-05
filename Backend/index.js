const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const cors = require('cors');
const userModel = require('./modules/userModel');
const verifytoken = require('./verifytoken');
const noteModel = require('./modules/noteModel');

// Configure CORS
const allowedOrigins = [
  'http://localhost:2000',
  'http://127.0.0.1:2000',
  'https://notes-application-yam2.onrender.com',
  'https://www.notes-application-yam2.onrender.com'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development you may want to allow all origins by calling callback(null, true)
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// database connection


mongoose.connect("mongodb+srv://Healthcare:Healthcare@healthcare.v60erxm.mongodb.net/")
.then(()=>{
    console.log("Atlas connection sucessfully")
})
.catch((err)=>{
    console.log(err)
})


const app = express();

// Enable CORS with explicit options and handle preflight
app.use(cors(corsOptions));  // used for CORS policy
app.options('*', cors(corsOptions)); // enable pre-flight for all routes

app.use(express.json());

// endpoint to regsiter

app.post("/register", async (req, res) => {
    let user = req.body;
    try {
        let existingUser = await userModel.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (!err) {
                bcrypt.hash(user.password, salt, async (err, hpass) => {
                    if (!err) {
                        user.password = hpass;
                        try {
                            let doc = await userModel.create(user);
                            res.status(201).send({ message: "User registered sucessfully" });
                        } 
                        catch (err) {
                            res.status(500).send({ message: "Some issue" });
                        }
                    }
                });
            }
        });
    } catch (err) {
        res.status(500).send({ message: "Some issue" });
    }
});



// endpoint to login 


app.post("/login",async(req,res)=>{

    let usecred  = req.body; 
    try
    {
        const user = await userModel.findOne({email:usecred.email})
        if(user!=null)
        {
            bcrypt.compare(usecred.password,user.password,(err,result)=>{
                if(result===true)
                {
                    jwt.sign({email:usecred.email},"nutrifyapp",(err,token)=>{
                        if(!err){
                            res.send({message:"login sucess",userid:user._id,token:token,name:user.name})
                        }
                        else
                        {
                            res.send({message:"some issue"})
                        }

                    })
                }
                else
                {
                    res.status(403).send({Messsage:"incorrect password"})
                }
            })
        }
        else
        {
            res.status(404).send({message:"user not found"})
        }
    }
    catch
    {
        res.status(500).send({message:"some issue"})
    }
})



// endpoint to all notes


app.get("/notes/:id",verifytoken,async(req,res)=>{

    try
    {
    let info = await noteModel.find({userid:req.params.id})
       if(info.length!==0)
        {

            res.status(201).send(info)
        }
        else
        {
            res.status(404).send({message:"User info not found"})
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"some problem in getting the details"})
    }
    
})


// endpoint to create UserContent


app.post("/notes/:id",verifytoken,async(req,res)=>{

    let CreateNote = req.body;
    try
    {
        let item = await noteModel.create(CreateNote);
        res.status(201).send({message:"Note Created Successfully"});
    }
    catch(err)
    {
        res.status(500).send({message:"some problem in creating the note"})
    }
}) 


// endpoint to delete Note


app.delete("/notes/:id/:title",verifytoken,async(req,res)=>{

    let deleteNote = req.params.title;
    let demo = req.params.id;
    try
    {
        let item = await noteModel.deleteOne({userid:demo,title:deleteNote});
        res.status(201).send({message:"Note Delete Successfully"});
    }
    catch(err)
    {
        res.status(500).send({message:"some problem in deleting the note"})
    }
})


// endpoint to update the note  


app.put("/notes/:id/:title",verifytoken,async(req,res)=>{

    let UpdateNote = req.body;
    try
    {
        let item = await noteModel.updateOne({title:req.params.title},UpdateNote);
        res.status(201).send({message:"Note update Successfully"});
    }
    catch(err)
    {
        res.status(500).send({message:"some problem in updating the note"})
    }
})



const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})



















