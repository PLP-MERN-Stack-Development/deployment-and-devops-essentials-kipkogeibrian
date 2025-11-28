import React, { useState, useEffect } from 'react';
import { bookAPI, healthCheck } from './services/api';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', publishedYear: '', genre: ''
  });
  const [borrowerName, setBorrowerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    checkBackendConnection();
    fetchBooks();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await healthCheck();
      setConnectionStatus('connected');
      console.log('✅ Backend connection successful');
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('❌ Backend connection failed:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to load books. Please check backend connection.');
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookAPI.create(formData);
      setFormData({ title: '', author: '', isbn: '', publishedYear: '', genre: '' });
      fetchBooks();
      alert('Book added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    if (!borrowerName.trim()) {
      alert('Please enter borrower name');
      return;
    }
    try {
      await bookAPI.borrow(bookId, borrowerName);
      setBorrowerName('');
      fetchBooks();
      alert('Book borrowed successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to borrow book');
    }
  };

  const returnBook = async (bookId) => {
    try {
      await bookAPI.return(bookId);
      fetchBooks();
      alert('Book returned successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to return book');
    }
  };

  const deleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookAPI.delete(bookId);
      fetchBooks();
      alert('Book deleted successfully!');
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Library Management System</h1>
        <p>Manage your book collection with ease</p>
        <div className={`connection-status ${connectionStatus}`}>
          Backend: {connectionStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </header>

      {/* Rest of your JSX remains the same */}
      {/* ... */}
    </div>
  );
}

export default App;