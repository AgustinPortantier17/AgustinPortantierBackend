import express from  'express';
import productsRouter from './src/routes/products.routes.js';
import cartsRouter from './src/routes/carts.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'API de E-commerce funcionando',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`);
});