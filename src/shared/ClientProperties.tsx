

export class ClientProperties {
    name: string;
    id: string;
    element?: any;
}

export type ClientList = ClientProperties[];
export type ClientStatesCallback = (cl: ClientList) => any;
