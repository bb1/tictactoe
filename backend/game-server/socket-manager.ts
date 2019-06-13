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
            const {joinedGame, newPlayer} = this.gameManager.newPlayer(data.name, data.playerCount, data.gridSize, data.gridSize);
            let logMsg = `Player ${newPlayer.name} (${newPlayer.symbol}) joined the game ${joinedGame.playerList.gameId}`;
            const missingPlayers = joinedGame.playerList.maxPlayerCount - joinedGame.playerList.playerCount;
            if (missingPlayers > 0) {
                logMsg += ` waiting for ${missingPlayers} players`;
            } else {
                logMsg += ` STARTING the game!`;
                joinedGame.playerList.shufflePlayers();
            }
            console.info(logMsg);
            // join game channel
            const gameChannel = io.of(`/game/${joinedGame.playerList.gameId}`);
            socket.join(`/game/${joinedGame.playerList.gameId}`, () => {
                gameChannel.emit('stateUpdate', joinedGame.playerList.exportState());
            });
            // ingame events:
            socket.on('disconnect', (reason: string) => {
                joinedGame.playerList.kickPlayer(newPlayer.symbol);
                gameChannel.emit('stateUpdate', joinedGame.playerList.exportState());
                io.emit('stats', {
                    activeGames: this.gameManager.activeGames.length,
                    players: --this.openSocketCount,
                } as LiveStats);
            });
            socket.on('place', ({x, y}, callback: (args: any) => void) => {
                if (joinedGame.playerList.nextPlayer === newPlayer) {
                    callback('forbidden');
                    return;
                }
                if (joinedGame.playerList.maxPlayerCount === joinedGame.playerList.playerCount) {
                    callback('game not full');
                    return;
                }
                try {
                    const won = joinedGame.grid.playerAction(x, y, newPlayer);
                    gameChannel.emit('place', {x, y, player: newPlayer.symbol});
                    if (won) {
                        gameChannel.emit('winner', {player: newPlayer.symbol});
                        this.gameManager.removeGame(joinedGame.playerList.gameId);
                    }
                } catch (e) {
                    callback(e.message);
                }
            });
            callback(newPlayer);
        });
    }
}