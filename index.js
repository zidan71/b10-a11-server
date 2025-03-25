const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId, Db } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytuhl.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const tutorsCollection = client.db('tutorCollection').collection('tutors')
const bookTutorsCollection = client.db('tutorCollection').collection('bookTutors')



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    app.get('/tutors', async (req, res) => {
      const cursor = tutorsCollection.find()
      const result = await cursor.toArray()
      
      res.send(result)
    })

    app.get('/tutors/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await tutorsCollection.findOne(query)
      res.send(result)
    })

    app.delete('/tutors/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await tutorsCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/tutors', async (req, res) => {
      const query = req.body
      const result = await tutorsCollection.insertOne(query)
      res.send(result)
    })


    app.put('/tutors/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedDoc = {
        $set: req.body
      }
      const result = await tutorsCollection.updateOne(query, updatedDoc, options)
      res.send(result)
    })

    app.get('/tutors/category/:category', async (req, res) => {
      const category = req.params.category; // Get the category (language) from URL
      const query = { language: category }; // Find tutors where language matches
      const result = await tutorsCollection.find(query).toArray();
      res.send(result);
    });
    


    // book tutors related api

    app.post('/bookTutors', async (req, res) => {
      const tutor = req.body;
      const result = await bookTutorsCollection.insertOne(tutor)
      res.send(result)
    })

    app.get('/bookTutors', async (req, res) => {
      const query = bookTutorsCollection.find()
      const result = await query.toArray()
      res.send(result)
    })

    
   
  
    app.put('/tutors/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      
      const updatedDoc = {
        $inc: { review: 1 }, 
      };
    
      
        const result = await tutorsCollection.updateOne(query, updatedDoc);
        res.send(result)      
    });
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('server is running smoothly')
})

app.listen(port, () => {
  console.log(`server is running on ${port}`)
})