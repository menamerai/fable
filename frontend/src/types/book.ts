export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: Uint8Array;
  imageUrl?: string;
  markdown?: string;
}
