const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

let dbClient;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("productsdb").collection("products");
    app.listen(3000, function () {
        console.log("The server is waiting for a connection...");
    });
});

app.get("/api/products", function (req, res) {

    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, products) {

        if (err) return console.log(err);
        res.send(products)
    });

});
app.get("/api/products/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({ _id: id }, function (err, product) {

        if (err) return console.log(err);
        res.send(product);
    });
});

app.post("/api/products", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const productName = req.body.name;
    const productPrice = req.body.price;
    const product = { name: productName, price: productPrice };

    const collection = req.app.locals.collection;
    collection.insertOne(product, function (err, result) {

        if (err) return console.log(err);
        res.send(product);
    });
});

app.delete("/api/products/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({ _id: id }, function (err, result) {

        if (err) return console.log(err);
        let product = result.value;
        res.send(product);
    });
});

app.put("/api/products", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const productName = req.body.name;
    const productPrice = req.body.price;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({ _id: id }, { $set: { price: productPrice, name: productName } },
        { returnDocument: 'after' }, function (err, result) {
            if (err) return console.log(err);
            const product = result.value;
            res.send(product);
        });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
