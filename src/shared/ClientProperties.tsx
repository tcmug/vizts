

export class ClientProperties {
    id: string;
}

export type ClientList = ClientProperties[];
export type ClientStatesCallback = (cl: ClientList) => any;
