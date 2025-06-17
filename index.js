const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express(); 
const port = process.env.PORT || 5000; 
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
})); 
app.use(express.json()) 

app.use(cookieParser());


const verifyToken = (req, res, next) => {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: 'Forbidden' });
        }
        req.decoded = decoded;
        next();
      });
    };



//Product_Recommendation 
//fA0lxd1yDiNYakUW
// console.log(process.env.MONGODB_URI)
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
   


    const queryCollection = client.db("RecoSysDB").collection("queries");
    const recommendationCollection = client.db("RecoSysDB").collection("recommendations");

// jwt related

app.post('/jwt',async(req,res)=>{
  const userdata = req.body
console.log(userdata)
  const token = jwt.sign(userdata , process.env.JWT_SECRET, {expiresIn : '1d'})


// set token in the cookies



res.cookie('token', token,{
  httpOnly: true,
    secure: false,
    sameSite: 'lax'
})
  res.send({success: true})
})



    // query related

    // POST: Submit a new query
app.post('/queries', async (req, res) => {
  const newQuery = req.body;
  const result = await queryCollection.insertOne(newQuery);
  res.send(result);
});

// GET: Get 6 most recent queries
app.get('/queries/recent', async (req, res) => {
  const recentQueries = await queryCollection
    .find()
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();
  res.send(recentQueries);
});


// My queries
app.get('/queries', async (req, res) => {
  const email = req.query.email;
  const query = {};

  if (email) {
    query.userEmail = email;
  }

  const cursor = queryCollection.find(query).sort({ createdAt: -1 });
  const result = await cursor.toArray();
  res.send(result);
});

const { ObjectId } = require('mongodb');


// Delete Query
app.delete('/queries/:id', async (req, res) => {
  const id = req.params.id;
  const result = await queryCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});


// GET single query
app.get('/queries/:id', async (req, res) => {
  const id = req.params.id;
  const query = await queryCollection.findOne({ _id: new ObjectId(id) });
  res.send(query);
});

// PUT (update) query
app.put('/queries/:id', async (req, res) => {
  const id = req.params.id;
  const updated = req.body;
  const result = await queryCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updated }
  );
  res.send(result);
});


// Post a new recomendation



app.post('/recommendations',verifyToken, async (req, res) => {
  const newRec = req.body;
   console.log(newRec)
   if (req.decoded.email !== newRec.recommenderEmail) {
        return res.status(403).send({ message: 'Forbidden' });
      }
  const result = await recommendationCollection.insertOne(newRec);
 
  // Increase recommendation count
  await queryCollection.updateOne(
    { _id: new ObjectId(newRec.queryId) },
    { $inc: { recommendationCount: 1 } }
  );
  
  res.send(result);
});

app.get('/recommendations', verifyToken, async (req, res) => {
  const email = req.query.email;
  if (req.decoded.email !== email) {
        return res.status(403).send({ message: 'Forbidden' });
      }
  console.log('inside',req.cookies)
  const query = email ? { recommenderEmail: email } : {};
  const recommendations = await recommendationCollection.find(query).sort({ createdAt: -1 }).toArray();
  res.send(recommendations);
});
// Get recomendation 




// GET recommendations made for user's queries
app.get('/recommendations/user/:email',verifyToken, async (req, res) => {
  const userEmail = req.params.email;
if (req.decoded.email !== userEmail) {
        return res.status(403).send({ message: 'Forbidden' });
      }
  // First, get all queries posted by the user
  const userQueries = await queryCollection.find({ userEmail }).toArray();
  const queryIds = userQueries.map(query => query._id);

  // Then, find all recommendations with those queryIds
  const recommendations = await recommendationCollection
    .find({ queryId: { $in: queryIds.map(id => id.toString()) } })
    .toArray();

  res.send(recommendations);
});


// recomendation delete

// DELETE a recommendation by ID and decrease recommendationCount in query
app.delete('/recommendations/:id', async (req, res) => {
  const recommendationId = req.params.id;

  const recommendation = await recommendationCollection.findOne({ _id: new ObjectId(recommendationId) });

  if (!recommendation) return res.send({ success: false, message: "Recommendation not found" });

  const deleteResult = await recommendationCollection.deleteOne({ _id: new ObjectId(recommendationId) });

  if (deleteResult.deletedCount > 0) {
    await queryCollection.updateOne(
      { _id: new ObjectId(recommendation.queryId) },
      { $inc: { recommendationCount: -1 } }
    );
    res.send({ success: true });
  } else {
    res.send({ success: false, message: "Failed to delete recommendation" });
  }
});

// Queries Like Functionality
app.patch('/queries/like/:id', async (req, res) => {
  const queryId = req.params.id;
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).send({ success: false, message: "User email required" });
  }

  try {
    const query = await queryCollection.findOne({ _id: new ObjectId(queryId) });

    if (!query) {
      return res.status(404).send({ success: false, message: "Query not found" });
    }

    let updateOperation;

    if (query.likes && query.likes.includes(userEmail)) {
      // Unlike
      updateOperation = { $pull: { likes: userEmail } };
    } else {
      // Like
      updateOperation = { $addToSet: { likes: userEmail } };
    }

    const result = await queryCollection.updateOne(
      { _id: new ObjectId(queryId) },
      updateOperation
    );

    res.send({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

//  await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => console.log(`Server started on port ${port}`));