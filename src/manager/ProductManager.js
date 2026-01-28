import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.init();
    }

    // si no existe el archivo lo creo vacio
    async init() {
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
        }
    }

    // traer todos los productos del json
    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    // buscar producto por id
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    // agregar producto nuevo
    async addProduct(productData) {
        const products = await this.getProducts();
        
        // chequear que esten todos los campos obligatorios
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`El campo ${field} es requerido`);
            }
        }

        // ver si ya existe un producto con ese codigo
        const codeExists = products.some(p => p.code === productData.code);
        if (codeExists) {
            throw new Error('El código del producto ya existe');
        }

        // genero el id automatico (el mas grande + 1)
        const newId = products.length > 0 
            ? Math.max(...products.map(p => p.id)) + 1 
            : 1;

        // armo el objeto del producto nuevo
        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        // lo agrego al array y guardo en el archivo
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // actualizar producto existente
    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        // no dejar que cambien el id
        delete updates.id;

        // mezclo los datos viejos con los nuevos
        products[index] = { ...products[index], ...updates };
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    // borrar producto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);

        if (products.length === filteredProducts.length) {
            throw new Error('Producto no encontrado');
        }

        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
        return true;
    }
}

export default ProductManager;