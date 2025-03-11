import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

const styles = `
  .book-list, .book-details, .add-book-form, .cart, .nav-bar {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .book-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
  }
  .book-card h3 {
    color: #4CAF50;
  }
  .book-details button, .add-book-form button, .cart-button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  .book-details button:hover, .add-book-form button:hover, .cart-button:hover {
    background-color: #45a049;
  }
  .cart {
    margin-top: 20px;
    border-top: 2px solid #4CAF50;
    padding-top: 10px;
  }
  .nav-bar {
    background-color: #4CAF50;
    color: #fff;
    padding: 10px;
    text-align: center;
  }
  .nav-bar a, .cart-button {
    color: #fff;
    margin: 0 10px;
    text-decoration: none;
    font-weight: bold;
  }
`;

const BookList = ({ books, addToCart }) => (
  <div className="book-list">
    <h2>Book List</h2>
    {books.map((book) => (
      <div key={book.id} className="book-card">
        <h3>{book.title}</h3>
        <p>Author: {book.author}</p>
        <p>Price: ${book.price}</p>
        <button onClick={() => addToCart(book)}>Add to Cart</button>
      </div>
    ))}
  </div>
);

const AddBook = ({ addBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && author.trim() && price.trim()) {
      addBook({ id: Date.now(), title, author, price: parseFloat(price) });
      setTitle('');
      setAuthor('');
      setPrice('');
    }
  };

  return (
    <div className="add-book-form">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required type="number" />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

const Cart = ({ cart, calculateTotalPrice }) => (
  <div className="cart">
    <h2>Shopping Cart</h2>
    {cart.length === 0 ? (
      <p>No items in cart</p>
    ) : (
      cart.map((item, index) => (
        <p key={index}>{item.title} - ${item.price} x {item.quantity}</p>
      ))
    )}
    {cart.length > 0 && <h3>Total Price: ${calculateTotalPrice()}</h3>}
  </div>
);

function App() {
  const initialBooks = [
    { id: 1, title: "1984", author: "George Orwell", price: 350 },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 300 },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 280 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", price: 250 },
    { id: 5, title: "Moby-Dick", author: "Herman Melville", price: 400 },
  ];

  const [books, setBooks] = useState(initialBooks);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (book) => {
    const existingItem = cart.find((item) => item.id === book.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  const addBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Router>
      <style>{styles}</style>
      <nav className="nav-bar">
        <Link to="/">Home</Link> | 
        <Link to="/add-book">Add a Book</Link> | 
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          {showCart ? "Hide Cart" : "View Cart"}
        </button>
      </nav>
      {showCart && <Cart cart={cart} calculateTotalPrice={calculateTotalPrice} />}
      <Routes>
        <Route path="/" element={<BookList books={books} addToCart={addToCart} />} />
        <Route path="/add-book" element={<AddBook addBook={addBook} />} />
      </Routes>
    </Router>
  );
}

export default App;
