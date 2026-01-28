import fs from 'fs';

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.init();
    }

    // crear el archivo si no existe
    async init() {
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
        }
    }

    // traer todos los carritos
    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    // buscar carrito por id
    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    // crear carrito nuevo (vacio)
    async createCart() {
        const carts = await this.getCarts();
        
        // generar id automatico
        const newId = carts.length > 0 
            ? Math.max(...carts.map(c => c.id)) + 1 
            : 1;

        const newCart = {
            id: newId,
            products: []  // empieza vacio
        };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    // agregar producto al carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = carts[cartIndex];
        // busco si el producto ya esta en el carrito
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            // si ya existe, sumo 1 a la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // si no existe, lo agrego con cantidad 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default CartManager;