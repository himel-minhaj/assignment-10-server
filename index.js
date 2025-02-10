require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());
// 
// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyzaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const visaCollection = client.db("visaDB").collection("allVisa");
    const applyCollection = client.db("visaDB").collection("apply");
    app.get("/visa", async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      // const result = visaCollection.find().toArray();
      res.send(result);
    });
    //sudu individual email diya jaigula
    app.get("/visa/MyAddedVisas/:email", async (req, res) => {
      // console.log(req.params.email);
      const cursor = visaCollection.find({ email: req.params.email });
      const result = await cursor.toArray();
      // const result = visaCollection.find().toArray();
      res.send(result);
    });
    app.get("/visa/findVisa/:Visa_type", async (req, res) => {
      console.log(req.params.Visa_type);
      const cursor = visaCollection.find({ Visa_type: req.params.Visa_type });
      const result = await cursor.toArray();
      // const result = visaCollection.find().toArray();
      res.send(result);
    });

    app.get("/visa/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      res.send(result);
    });
    app.post("/visa", async (req, res) => {
      const data = req.body;
      const result = await visaCollection.insertOne(data);
      res.send(result);
    });
    // apply api
    app.get("/apply", async (req, res) => {
      const cursor = applyCollection.find();
      const result = await cursor.toArray();
      // const result = visaCollection.find().toArray();
      res.send(result);
    });
    app.get("/apply/myvisaApplication/:email", async (req, res) => {
      console.log(req.params.email);
      const cursor = applyCollection.find({ email: req.params.email });
      const result = await cursor.toArray();
      // const result = applyCollection.find().toArray();
      res.send(result);
    });
    //  app.get("/apply/:id", async (req, res) => {
    //    const id = req.params.id;
    //    console.log(id);
    //    const query = { _id: new ObjectId(id) };
    //    const result = await applyCollection.findOne(query);
    //    res.send(result);
    //  });
    // apply api
    app.post("/apply", async (req, res) => {
      const data = req.body;
      const result = await applyCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/apply/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await applyCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/visa/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(id) };
      const updateSchedule = {
        $set: {
          countryName: data?.countryName,
          countryImageUrl: data?.countryImageUrl,
          Visa_type: data?.Visa_type,
          Processing_time: data?.Processing_time,
          Description: data?.Description,
          Age_restriction: data?.Age_restriction,
          fee: data?.fee,
          Validity: data?.Validity,
          Application_method: data?.Application_method,
        },
      };
      const result = await visaCollection.updateOne(filter, updateSchedule);
      res.send(result);
    });
    app.delete("/visa/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! Hemal-Minhaj");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
