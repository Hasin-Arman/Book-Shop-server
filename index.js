
const express = require('express');
const app = express();
const cors=require('cors');
const port =process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const ObjectId=require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.23pjc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("bookShop").collection("books");
  
 app.post('/addBook',(req, res)=>{
    bookCollection.insertOne(req.body)
    .then(result=>{
        console.log(result.insertedCount);
    })
 })


 app.get('/books',(req,res)=>{
     bookCollection.find({})
     .toArray((err,documents)=>{
         res.send(documents)
     })
 })


 app.get('/book/:id',(req,res)=>{
      bookCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err,documents)=>{
        res.send(documents)
      })
 })

});

client.connect(err => {
    const orderCollection = client.db("bookShop").collection("orders");
    app.post('/addOrder',(req, res)=>{
        orderCollection.insertOne(req.body)
        .then(result=>{
            console.log(result.insertedCount);
        })
     })

     app.get('/orderInfo',(req,res)=>{
        orderCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
  });


app.listen(port)