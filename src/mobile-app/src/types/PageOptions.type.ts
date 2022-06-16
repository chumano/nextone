export interface IPageOptions {
  offset: number;
  pageSize?: number;
}

export class PageOptions implements IPageOptions {
  public offset: number;
  public pageSize?: number;
  constructor(offset: number = 0, pageSize: number = 10) {
    this.offset = offset < 0 ? 0 : offset;
    this.pageSize = pageSize <= 0 ? 10 : pageSize;
  }
}
