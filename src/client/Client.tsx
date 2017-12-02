
import * as io from 'socket.io-client';
import { ClientProperties, ClientList } from '../shared/ClientProperties';
import { Action } from './Action';
import { ActionMapper } from './MainAction';

export interface ClientDef {
    onJoin: Function,
    onLeave: Function,
    onUpdate: Function,
    onAction: Function
}

export class Client {

    socket: any;
    clientSpecs: any;
    client: ClientProperties;
    clients: ClientList;
    clientDef: ClientDef;

    log(msg) {
        console.log(msg);
    }

    constructor(props: ClientDef) {

        this.clientDef = props;
        this.client = { id: '' };
        this.clients = [];
        this.socket = io(this.clientSpecs);

        this.socket.on('connect', () => {
            this.client.id = this.socket.id;
            this.log('I am ' + this.client.id);
            this.socket.emit('client_join', this.client);
        });

        this.socket.on('clients_state', (cp: ClientList) => {
            this.log('State received for: ' + cp.length);
            this.clients = cp;
            for (let cp of this.clients) {
                this.clientDef.onJoin(cp);
            }
        });

        this.socket.on('client_join', (cp: ClientProperties) => {
            this.log('Client joined ' + cp.id);
            this.clients = [ ...this.clients, cp as ClientProperties ];
            this.clientDef.onJoin(cp);
        });

        this.socket.on('client_leave', (cp: ClientProperties) => {
            this.log('Client left ' + cp.id);
            this.clients = this.clients.filter((c) => c.id !== cp.id);
            this.clientDef.onLeave(cp);
        });

        this.socket.on('client_update', (cp: ClientProperties) => {
            this.log('Client update ' + cp);
            this.clientDef.onUpdate(cp);
        });

        this.socket.on('action', (cp: Action) => {
            this.log('Client action ' + cp);
            this.clientDef.onAction(ActionMapper(cp));
        });
    }

    action = (action: Action) => {
        this.socket.emit('action', action);
    }

    update = (update) => {
        this.socket.emit('client_update', update);
    }
}
