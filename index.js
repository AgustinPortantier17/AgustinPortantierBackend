import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import productsRouter from './src/routes/products.routes.js';
import cartsRouter from './src/routes/carts.routes.js';
import viewsRouter from './src/routes/views.routes.js';

const app = express();
const port = 8080;

// aca creo el servidor http para poder usar socket.io
const httpServer = createServer(app);
const io = new Server(httpServer);

// configuracion de handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// guardo io en app para poder usarlo en las rutas
app.set('socketio', io);

// rutas de vistas
app.use('/', viewsRouter);

// rutas de la api
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'API de E-commerce funcionando',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts',
            views: {
                home: '/home',
                realTimeProducts: '/realtimeproducts'
            }
        }
    });
});

// cuando un cliente se conecta al socket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

httpServer.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`);
});