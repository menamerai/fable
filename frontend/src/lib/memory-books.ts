import { BOOKS } from "@/lib/data";
import { Book } from "@/types/book";

const subscribers: (() => void)[] = [];

export const MemoryBooksDB = {
  books: BOOKS,
  subscribe: (callback: () => void) => {
    subscribers.push(callback);
    return () => {
      subscribers.splice(subscribers.indexOf(callback), 1);
    };
  },
  notify: () => {
    subscribers.forEach((callback) => callback());
  },
  getBooks: () => {
    return MemoryBooksDB.books;
  },
  addBook: (book: Book) => {
    MemoryBooksDB.books.push(book);
    MemoryBooksDB.books = [...MemoryBooksDB.books];
    MemoryBooksDB.notify();
  },
};
