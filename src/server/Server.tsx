
import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import { ClientProperties, ClientList } from "../shared/ClientProperties";

export class Server {

    public static readonly PORT:number = 4040;
    public app: any;
    private server: any;
    private io: any;
    private port: string | number;
    private clients: ClientList;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.clients = [];
        console.log(this.clients);
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || Server.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {

            console.log('Client connected: ' + socket.id);

            socket.on('client_join', (m: ClientProperties) => {
                m.id = socket.id;
                this.clients = [ ...this.clients, m as ClientProperties ];
                socket.broadcast.emit('client_join', m);
                socket.emit('clients_state', this.clients);
            });

            socket.on('client_update', (m: any) => {
                console.log('Client update: ' + socket.id);
                socket.broadcast.emit('client_update', m);
            });

            socket.on('action', (m: any) => {
                console.log('Client action ' + socket.id);
                socket.broadcast.emit('action', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected: ' + socket.id);
                let c = this.clients.filter((c) => c.id == socket.id);
                this.clients = this.clients.filter((c) => c.id !== socket.id);
                socket.broadcast.emit('client_leave', c[0]);
            });

        });
    }
}
