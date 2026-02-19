import { Router } from 'express';
import ProductManager from '../manager/ProductManager.js';
import path from 'path';

const router = Router();
// creo el productManager apuntando al json de productos
const productManager = new ProductManager(path.join(process.cwd(), 'src', 'data', 'products.json'));

// traer todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// traer un producto especifico
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(parseInt(req.params.pid));
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// crear producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        
        // mando evento socket para actualizar la lista en tiempo real
        const io = req.app.get('socketio');
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
        
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// actualizar producto existente
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
        
        // actualizo en tiempo real con socket
        const io = req.app.get('socketio');
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
        
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(parseInt(req.params.pid));
        
        // mando actualizar con socket
        const io = req.app.get('socketio');
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
        
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;