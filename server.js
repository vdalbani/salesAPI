require("dotenv").config();

const mongoDBConnectionString = process.env.MONGODB_CONNECTION_STRING;
const HTTP_PORT = process.env.PORT || 3000;


const express= require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dataService = require("./data-services.js");




//const mongoose = require("mongoose");
const data = dataService(mongoDBConnectionString);
const app = express();

//MIGHT NEED MORGAN


// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());


// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)

app.post("/api/sales",(req,res)=>{
    data.addNewSale(req.body)
    .then((data)=>{
        res.json({message:"Sale " + data + " added succesfully"});
        console.log("ADDED SUCCESFULLY: " + data);
    })
    .catch((err)=>{
        console.log("THERE WAS AN ERROR");
        res.status(500).end();
    })
});


  //GET ALL   
// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales",(req,res)=>{
    data.getAllSales().then((data)=>{
        console.log("LOADED SUCCESFULLY!");
        res.json(data);
    })
    .catch((err)=>{
        console.log("DID NOT LOAD BECAUSE: ");
        res.status(500).end();
    })
});

  //GET ONE WITH ID
// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:_id", (req,res) => {
    data.getSalesById(req.params._id).then((data)=>{
        if(data.length > 0){
            console.log("GET ONE LOADED SUCCESFULLY");
            res.json(data);
        }else{
            console.log("GET ONE LOADED SUCCESFULLY BUT NOT MATCH");
            res.status(404).end();
        }
    })
    .catch((err)=>{
        console.log("GET ONE DID NOT LOAD");
        res.status(500).end();
    })
});


// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:_id", (req, res) => {

    data.updateSaleById(req.params._id, req.body)
    .then((data)=>{
        console.log("UPDATED SUCCESSFULLY");
        res.json({"message": data });
    })
    .catch((err)=>{
        console.log("NOT UPDATED");
        res.status(500).end();
    })
});

// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:_id", (req, res) => {

    data.deleteSaleById(req.params._id).then((data)=>{
        if(data.length > 0){
            console.log("DELETED SUCCESFULLY");
           // res.json(data);
            res.json({"message":  data });
        }else{
            console.log("DELETION LOADED SUCCESFULLY BUT NOT MATCH");
            res.status(404).end();
        }
    })
    .catch((err)=>{
        console.log("NOT DELETED");
        res.status(500).end();
    })
});

////////////////////
// Catch-All 404 error

app.use((req, res) => {
    res.status(404).end();
});
///////////////////////

// ************* Initialize the Service & Start the Server**********************


data.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{console.log(`server listening on: ${HTTP_PORT}`)});
}).catch((err)=>{
    console.log("unable to start the server: ", err.message);
    process.exit();
});

