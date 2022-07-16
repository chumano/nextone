import { CallMessageData } from "../../types/CallMessageData";

export interface CallState{
    isCalling : boolean;
    callInfo?: CallMessageData
}