const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config()

const port =process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rimjj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('conn err', err);
  const serviceCollection = client.db("carMechanic").collection("services");
  const reviewCollection = client.db("carMechanic").collection("reviews");
  const orderCollection = client.db("carMechanic").collection("orders");

  console.log('Database connect');

// add service
  app.post('/addService', (req, res) =>{
    const newService = req.body;
    console.log('adding new service', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted Count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // show serviceData in ui
  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  // add review
  app.post('/addReview', (req, res) =>{
    const review = req.body;
    console.log('adding review', review);
    reviewCollection.insertOne(review)
    .then(result => {
      console.log('inserted Count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

   // show reviews in ui
   app.get('/reviews', (req, res) => {
    reviewCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })


   // single data checkout service with id
   app.get('/services:id',(req, res) =>{
    serviceCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })

  // order service
  app.post('/addOrder', (req, res) =>{
    const order = req.body;
    console.log('adding new product', order);
    orderCollection.insertOne(order)
    .then(result => {
      console.log('inserted Count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req, res) => {
    orderCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  // delete services
  app.delete('/delete/:id', (req, res) => {
    const id = (req.params.id);
    console.log(id);
    console.log('delete',id);
    serviceCollection.deleteOne({_id:ObjectID(id)})
    // .then(documents => res.send(!!documents.value))
    .then(err, documents =>{
      res.send(documents.deleteCount > 0)
      console.log(documents, err);
    })
  })



});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)