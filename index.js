const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());



// data base 

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnw0w8y.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnw0w8y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    // get a Brand Data
    const database = client.db("insertDB").collection("Brand");
    app.get("/brand" , async(req, res) => {
        const result = await database.find().toArray();
         res.send(result);
    })
    //  top 3 car data
    const top3 = client.db("insertDB").collection("top3");

    app.get("/top3" , async(req, res) => {
        const result = await top3.find().toArray();
         res.send(result);
    })

    //  add data to server
    const modelsData = client.db("insertDB").collection("models");

    app.get("/models/:name", async (req, res) => {
        const name = req.params.name;
        const filter = {
            brand: name
          }
        const result = await modelsData.find(filter).toArray();
        res.send(result);
    })

    app.get("/models/id/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await modelsData.findOne(query)
        res.send(result);
    })

    app.post("/models" , async(req, res) => {
        const body = req.body;
        const result = await modelsData.insertOne(body);
        res.send(result);
    })

    app.put("/models/id/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id)};
        const updateUser = {
            $set : {
                name: body.name,
                price: body.price,
                photo: body.photo,
                description: body.description,
                rating: body.rating
            }
        }
        const result = await modelsData.updateOne(filter , updateUser);
        console.log(filter);
        res.send(result);
    })


    // my card data
    const cardData = client.db("insertDB").collection("mycard");

    app.get("/mycard", async(req, res) => {
        const result = await cardData.find().toArray();
        res.send(result);
    });

    app.post("/mycard" , async(req , res )=>{
        const my = req.body ;
        const result = await cardData.insertOne(my);
        res.send(result);
    })

    app.patch('/mycard/:id', async(req , res)=>{
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: id };
        const updateUser = {
            $set : {
                name: body.name,
                price: body.price,
                photo: body.photo,
                description: body.description,
                rating: body.rating
            }
        }
        const result = await cardData.updateOne(filter , updateUser);
        res.send(result);
    })

    app.delete("/mycard/:id" , async(req , res)=>{
        const id = req.params.id;
        const query = { _id: id}
        const result = await cardData.deleteOne(query);
        res.send(result);
        console.log(id);
    })
    
    
 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req , res) => {
    res.send(' checking')
    
});

app.listen(port , (req , res) => {
    console.log("Connected to port " + port);
})