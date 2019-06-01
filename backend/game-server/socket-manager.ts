import { GameManager } from "./game-manager";
import { LiveStats } from "shared/model/live-stats";
import * as socket from 'socket.io';

export class SocketManager {
    openSocketCount = 0;

    constructor(private gameManager: GameManager) {

    }

    registerEvents(io: socket.Server) {
        io.on('connection', (socket) => {
            socket.emit('stats', {
                activeGames: this.gameManager.activeGames.length,
                players: ++this.openSocketCount,
            } as LiveStats);

            this.registerSingleClientEvents(socket);
        });
        io.on('disconnect', () => {
            // broadcast to all
            io.emit('stats', {
                activeGames: this.gameManager.activeGames.length,
                players: --this.openSocketCount,
            } as LiveStats);
        });
    }

    registerSingleClientEvents(socket: socket.Socket) {
        socket.on('join', function (data) {
            console.log(data);
        });
    }
}