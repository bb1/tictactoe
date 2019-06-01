import * as express from 'express';
import { GameManager } from './game-manager';
import { Server } from 'http';
import * as socket from 'socket.io';
import { LiveStats } from 'shared/model/live-stats';
import * as cors from 'cors';

const app = express();
const server = new Server(app);
const io = socket(server);

const port = process.env.PORT || '8080'; // default port to listen

const gameManager = new GameManager();

server.on('listening', () => {
    console.log(`listening on ${port}`);
})

if (process.env.NODE_ENV === 'development') {
    // enable cross origin
    app.use(cors());
}

// define a route handler for the default home page
app.get( "/", ( _req, res ) => {
    res.send( "Hello world!" );
    //TODO: public route
} );

let openSocketCount = 0;
io.on('connection', (socket) => {
    socket.emit('stats', {
        activeGames: gameManager.activeGames.length,
        players: ++openSocketCount,
    } as LiveStats);
    socket.on('join', function (data) {
        
        console.log(data);
    });
});
io.on('disconnect', () => {
    io.emit('stats', {
        activeGames: gameManager.activeGames.length,
        players: --openSocketCount,
    } as LiveStats);
});

// start the server
server.listen(parseInt(port));