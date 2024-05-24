const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

const PORT = process.env.PORT

app.use(express.json());

app.get('/ayam', (req, res) => {
    res.send('Hello World');
});

app.get('/products', async(req, res) => {
    const products = await prisma.product.findMany();
    res.send(products);
});

app.get("/products/:id", async(req, res) => {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(productId),
        }
    });

    if (!product) {
        res.status(404).send({
            message: "product not found"
        });
    }

    res.send(product);
})

app.post('/products', async(req, res) => {
    const newProductData = req.body;

    const product = await prisma.product.create({
        data: {
            name: newProductData.name,
            price: newProductData.price,
            description: newProductData.description,
            image: newProductData.image
        },
    });


    res.send({
        data: product,
        message: "product berhasil ditambahkan"
    });
});

app.delete("/products/:id", async(req, res) => {
    const productId = req.params.id;

    await prisma.product.delete({
        where: {
            id: parseInt(productId),
        }
    });

    res.send({
        message: "product berhasil dihapus"
    });
});

app.put("/products/:id", async(req, res) => {
    const productId = req.params.id;
    const newProductData = req.body;


    if ( 
        !(
        newProductData.name &&
        newProductData.price &&
        newProductData.description &&
        newProductData.image
    )) {
        res.status(400).send({
            message: "data tidak lengkap"
        });
        return;
    }
    const product = await prisma.product.update({
        where: {
            id: parseInt(productId),
        },
        data: {
            name: newProductData.name,
            price: newProductData.price,
            description: newProductData.description,
            image: newProductData.image
        },
    });

    res.send({
        data: product,
        message: "product berhasil diubah"
    });

});

app.patch("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const newProductData = req.body;

    const product = await prisma.product.update({
        where: {
            id: parseInt(productId),
        },
        data: {
            name: newProductData.name,
            price: newProductData.price,
            description: newProductData.description,
            image: newProductData.image
        },
    });

    res.send({
        data: product,
        message: "product berhasil diubah"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});