const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const cors = require('cors');
const userModel = require('./modules/userModel');
const verifytoken = require('./verifytoken');
const noteModel = require('./modules/noteModel');



// database connection


mongoose.connect("mongodb://localhost:27017/noteapp")
.then(()=>{
    console.log("connection sucessfully")
})
.catch((err)=>{
    console.log(err)
})


const app = express();

app.use(cors());  //userd for cors policy

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
                            res.status(201).send({ message: "User registered" });
                        } catch (err) {
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



app.listen(8000,()=>{
    console.log("server running")
})



















