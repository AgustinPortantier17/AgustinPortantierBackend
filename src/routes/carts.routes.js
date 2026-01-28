import { Router } from 'express';
import CartManager from '../manager/CartManager.js';
import path from 'path';

const router = Router();
// creo el cartManager apuntando al json de carritos
const cartManager = new CartManager(path.join(process.cwd(), 'src', 'data', 'carts.json'));

// crear carrito nuevo (vacio)
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// traer los productos de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(parseInt(req.params.cid));
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(
            parseInt(req.params.cid),
            parseInt(req.params.pid)
        );
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;