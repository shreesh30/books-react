import axios from "axios";
import { createContext, useCallback, useState } from "react";

const BooksContext = createContext();

function Provider({ children }) {
  const [books, setBooks] = useState([]);

  const valueToShare = {
    books,

    fetchBooks: useCallback(async () => {
      const response = await axios.get("http://localhost:3001/books");
      setBooks(response.data);
    }, []),

    createBook: async (title) => {
      const response = await axios.post("http://localhost:3001/books", {
        title,
      });

      const updatedBooks = [...books, response.data];

      setBooks(updatedBooks);
    },
    deleteById: async (id) => {
      await axios.delete(`http://localhost:3001/books/${id}`);

      const updatedBooks = books.filter((book) => {
        return book.id !== id;
      });

      setBooks(updatedBooks);
    },
    editById: async (id, title) => {
      const response = await axios.put(`http://localhost:3001/books/${id}`, {
        title,
      });

      const updateBooks = books.map((book) => {
        if (book.id === id) {
          return { ...book, ...response.data };
        }
        return book;
      });

      setBooks(updateBooks);
    },
  };

  return (
    <BooksContext.Provider value={valueToShare}>
      {children}
    </BooksContext.Provider>
  );
}

export { Provider };
export default BooksContext;
