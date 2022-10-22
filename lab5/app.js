const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const productScheme = new Schema(
    {
        name: String,
        price: Number
    },
    {
        versionKey: false
    }
);
const Product = mongoose.model("Product", productScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect(url, options, function (err) {
    if (err) return console.log(err);
    app.listen(3000, function () {
        console.log("The server is waiting for a connection...");
    });
});


app.get("/api/products", function (req, res) {

    Product.find({}, function (err, products) {
        if (err) return console.log(err);
        res.send(products)
    });
});

app.get("/api/products/:id", function (req, res) {

    const id = req.params.id;
    Product.findOne({ _id: id }, function (err, product) {
        if (err) return console.log(err);
        res.send(product);
    });

});

app.post("/api/products", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const productName = req.body.name;
    const productPrice = req.body.price;
    const product = new Product({ name: productName, price: productPrice });

    product.save(function (err) {
        if (err) return console.log(err);
        res.send(product);
    });

});

app.delete("/api/products/:id", function (req, res) {

    const id = req.params.id;
    Product.findByIdAndDelete(id, function (err, product) {
        if (err) return console.log(err);
        res.send(product);
    });

});

app.put("/api/products", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const productName = req.body.name;
    const productPrice = req.body.price;
    const newProduct = { name: productName, price: productPrice };

    Product.findOneAndUpdate({ _id: id }, newProduct,
        { new: true },
        function (err, product) {
            if (err) return console.log(err);
            res.send(product);
        });
});

// прослушиваем прерывание работы программы (ctrl-c)
//process.on("SIGINT", () => {
//    dbClient.close();
//    process.exit();
//});
