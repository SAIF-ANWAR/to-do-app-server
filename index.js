const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.74crw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const tasksCollection = client.db("todo").collection("tasks");
    await client.connect();
    try {
        app.post('/tasks', async (req, res) => {
            const query = req.body
            const result = await tasksCollection.insertOne(query)
            res.send(result)
        })
        app.get('/tasks', async (req, res) => {
            const email = req.query.email
            const query = { user: email }
            const cursor = tasksCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})