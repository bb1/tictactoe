import * as express from 'express';
import { GameManager } from './game-manager';
import { Server } from 'http';
import * as socket from 'socket.io';
import * as cors from 'cors';
import { SocketManager } from './socket-manager';
import { join } from 'path';

const app = express();
const server = new Server(app);
const io = socket(server);

const port = process.env.PORT || '8080'; // default port to listen

const gameManager = new GameManager();
const socketManager = new SocketManager(gameManager);

server.on('listening', () => {
    console.log('=========================================================');
    console.log(`listening on ${port}`);
})

if (process.env.NODE_ENV === 'development') {
    // enable cross origin
    app.use(cors());
}

// define a route handler for the default home page
app.get( "/", express.static(join(__dirname, 'public')));
app.get("/*", function (req, res) {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

socketManager.registerEvents(io);

// start the server
server.listen(parseInt(port));