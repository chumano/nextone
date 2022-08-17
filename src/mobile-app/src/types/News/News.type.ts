export interface News {
  id: string;
  title: string;
  description: string;
  content: string;

  imageUrl: string;
  imageDescription: string;

  isPublished: boolean;

  publishedDate: string;
  publishedBy: string;
  publishedUserName: string;
}
