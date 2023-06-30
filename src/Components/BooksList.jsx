import React, { useState, useEffect, useCallback } from 'react';
import Footer from "./Common/footer";
import '../CSS/BooksList.css';
import Header from "./Common/header";
import Popup from "./Common/popup";

const Book = React.memo(({ book, onCardClick, isAdmin }) => {
    return (
        <div key={book.id} className="card" onClick={() => onCardClick(book)}>
            <h3>{book.title}</h3>
            <p>Author: {book.author.name}</p>
            <p>Readers: {book.readers.length}</p>
        </div>
    );
});

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [pages, setPages] = useState([]);
    const [isAuthor, setIsAuthor] = useState(false);
    const [authorId, setAuthorId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPopup, setIsEditingPopup] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newPageContent, setNewPageContent] = useState('');

    // Fetch books and other data
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/books/', {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchPages = useCallback(async (bookId) => {
        try {
            const response = await fetch(`http://localhost:8000/books/${bookId}/pages/`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }
            const data = await response.json();
            setPages(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const checkIsAdmin = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8000/is_author/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setAuthorId(data.id); // Set the author ID
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchData().then(() => console.log('Books Fetched~'));
        checkIsAdmin().then(() => console.log('Admin Checked~'));
    }, [fetchData, checkIsAdmin]);

    const handleCardClick = (book) => {
        if (book.author.id === authorId) {
            setSelectedBook({ id: book.id, name: book.title });
            fetchPages(book.id);
            setIsAuthor(true);
        } else {
            // Allow the author to read other books
            setSelectedBook({ id: book.id, name: book.title });
            fetchPages(book.id);
            setIsEditing(false);
            setIsEditingPopup(false);
            setIsAuthor(false);
        }
    };



    const handlePopupClose = () => {
        setNewTitle('');
        setNewPageContent('');
        setIsEditing(false);
        setIsEditingPopup(false);
        setSelectedBook(null);
        setPages([]);
    };

    return (
        <div>
            <Header />
            <h2>Books List</h2>
            <div className="card-container">
                {books.map((book) => (
                    <Book
                        key={book.id}
                        book={book}
                        onCardClick={handleCardClick}
                        isAdmin={isAuthor}
                    />
                ))}
            </div>
            {selectedBook && (
                <Popup
                    bookId={selectedBook.id}
                    bookName={selectedBook.name}
                    pages={pages}
                    onClose={handlePopupClose}
                    className="active"
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    isEditingPopup={isEditingPopup}
                    setIsEditingPopup={setIsEditingPopup}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    newPageContent={newPageContent}
                    setNewPageContent={setNewPageContent}
                    isAdmin={isAuthor}
                />
            )}

            <Footer />
        </div>
    );
};

export default BooksList;
