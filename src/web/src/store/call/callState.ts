export enum CallStatus {
    idle,
    calling
}

export interface CallState {
    status : CallStatus
    isSender: boolean,
    converstationId?: string;
}