export interface IPageOptions {
  Offset: number;
  PageSize: number;
}

export class PageOptions implements IPageOptions {
  public Offset: number;
  public PageSize: number;
  constructor(offset: number = 0, pageSize: number = 10) {
    this.Offset = offset < 0 ? 0 : offset;
    this.PageSize = pageSize <= 0 ? 10 : pageSize;
  }
}
