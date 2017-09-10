
import * as io from 'socket.io-client';
import { ClientProperties, ClientList } from "../shared/ClientProperties";

export default class Client {

    socket: any;
    clientSpecs: any;
    client: ClientProperties;
    clients: ClientList;
    snap: any;

    constructor(props: ClientProperties, snap: any) {

        this.client = props;
        this.clients = [];
        this.socket = io(this.clientSpecs);
        this.snap = snap;

        this.socket.on('connect', () => {
            this.client.id = this.socket.id;
            console.log("I am " + this.client.id);
            this.socket.emit('client_join', this.client);
        });

        this.socket.on('clients_state', (cp: ClientList) => {
            console.log('State received');
            this.clients = cp;
            console.log(this.clients);
        });

        this.socket.on('client_join', (cp: ClientProperties) => {
            console.log("Client joined " + cp.id);
            cp.element = 1;
            this.clients = [ ...this.clients, cp as ClientProperties ];
            console.log(this.clients);
        });

        this.socket.on('client_leave', (cp: ClientProperties) => {
            console.log("Client left " + cp.id);
            cp.element = 1;
            this.clients = this.clients.filter((c) => c.id !== cp.id);
            console.log(this.clients);
        });


    }
}
