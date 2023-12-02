const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const router = require('./route');
const path = require("path")

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

if(process.env.NODE_ENV !== "PRODUCTION"){
   require("dotenv").config ({path: "backend/.env"})
}

// Use your router without prefixing
app.use(router);
app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((error) => {
        console.log("Error while connecting to mongoose", error);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
