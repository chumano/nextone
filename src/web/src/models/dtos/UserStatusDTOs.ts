import { IPageOptions } from "../apis/PageOptions.model";

export interface GetListUserStatusDTO extends IPageOptions {
    excludeMe? : boolean
}