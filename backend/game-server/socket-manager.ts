import { GameManager } from "./game-manager";
import { LiveStats } from "shared/model/live-stats";
import * as socket from 'socket.io';
import { PlayerSetup } from "shared/model/player-setup";

export class SocketManager {
    openSocketCount = 0;

    constructor(private gameManager: GameManager) {

    }

    registerEvents(io: socket.Server) {
        io.on('connection', (socket) => {
            io.emit('stats', {
                activeGames: this.gameManager.activeGames.length,
                players: ++this.openSocketCount,
            } as LiveStats);

            this.registerSingleClientEvents(socket, io);
        });
        io.on('disconnect', (reason: string) => {
            // TODO: wird nicht sauber disconnected wenn der TAb geschlossen wird
            // broadcast to all
            io.emit('stats', {
                activeGames: this.gameManager.activeGames.length,
                players: --this.openSocketCount,
            } as LiveStats);
        });
    }

    registerSingleClientEvents(socket: socket.Socket, io: socket.Server) {
        socket.on('join', (data: PlayerSetup, callback: Function) => {
            const game = this.gameManager.newPlayer(data.name, data.playerCount, data.gridSize, data.gridSize);
            console.info(`Player ${game.newPlayer.name} (${game.newPlayer.symbol}) joined the game ${game.joinedGame.playerList.gameId}`);
            const missingPlayers = game.joinedGame.playerList.maxPlayerCount - game.joinedGame.playerList.playerCount;
            if (missingPlayers) {
                console.info(` waiting for ${game.joinedGame.playerList.playerCount}`);
            } else {
                console.info(`STARTING!`);
                game.joinedGame.playerList.shufflePlayers();
            }
            const gameChannel = io.of(`/game/${game.joinedGame.playerList.gameId}`);
            socket.on('disconnect', (reason: string) => {
                game.joinedGame.playerList.kickPlayer(game.newPlayer.symbol);
                gameChannel.emit('stateUpdate', game.joinedGame.playerList.exportState());
                io.emit('stats', {
                    activeGames: this.gameManager.activeGames.length,
                    players: --this.openSocketCount,
                } as LiveStats);
            });
            socket.join(`/game/${game.joinedGame.playerList.gameId}`, () => {
                gameChannel.emit('stateUpdate', game.joinedGame.playerList.exportState());
            });
            callback(game.newPlayer);
        });
    }
}