import { useSyncExternalStore } from 'react';
import { MemoryBooksDB } from '@/lib/memory-books';

export function useMemoryDb() {
  const books = useSyncExternalStore(
    MemoryBooksDB.subscribe,
    MemoryBooksDB.getBooks
  );

  return {
    books,
    addBook: MemoryBooksDB.addBook,
  };
}
