export interface CreateNewsDTO {
    title: string;
    description: string;
    content: string;

    imageUrl: string;
    imageDescription: string;

}

export interface UpdateNewsDTO {
    title: string;
    description: string;
    content: string;

    imageUrl: string;
    imageDescription: string;

}

export interface NewsFilter{
    textSearch?: string,
    publishState?: 0 | 1 | 2,
    page?: number,
    pageSize?: number
}