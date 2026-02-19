import { Router } from 'express';
import ProductManager from '../manager/ProductManager.js';
import path from 'path';

const router = Router();
const productManager = new ProductManager(path.join(process.cwd(), 'src', 'data', 'products.json'));

// pagina home con lista de productos
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { 
            title: 'Lista de Productos',
            products 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// pagina de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { 
            title: 'Productos en Tiempo Real',
            products 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
