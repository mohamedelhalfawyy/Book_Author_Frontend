import React, { useState } from 'react';
import '../../CSS/Popup.css';

const Popup = ({
                   bookId,
                   bookName,
                   pages,
                   onClose,
                   className,
                   isEditing,
                   setIsEditing,
                   newTitle,
                   setNewTitle,
                   newPageContent,
                   setNewPageContent,
                   isEditingPopup,
                   isAdmin,
                   setIsEditingPopup,
               }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const changePage = (direction) => {
        const nextPageIndex = currentPageIndex + direction;
        if (nextPageIndex >= 0 && nextPageIndex < pages.length) {
            setCurrentPageIndex(nextPageIndex);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setIsEditingPopup(true);
        setNewTitle(pages[currentPageIndex]?.title);
        setNewPageContent(pages[currentPageIndex]?.content);
    };

    const updateBookTitle = async () => {
        try {
            if (newTitle !== '') {
                const token = localStorage.getItem('accessToken');
                await fetch(`http://localhost:8000/books/${bookId}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title: newTitle }),
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updatePageContent = async () => {
        try {
            if (newPageContent !== '') {
                const token = localStorage.getItem('accessToken');
                await fetch(`http://localhost:8000/pages/${pages[currentPageIndex]?.id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: newPageContent }),
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const saveChanges = async () => {
        try {
            await updateBookTitle();
            await updatePageContent();

            onClose();
            if (newTitle !== '') window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="popup">
            <div className={`popup-content ${className}`}>
                <h3>Pages of Book {bookName}</h3>
                {isEditingPopup ? (
                    <div className="edit-form">
                        <input
                            type="text"
                            placeholder="New Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="New Page Content"
                            value={newPageContent}
                            onChange={(e) => setNewPageContent(e.target.value)}
                        ></textarea>
                    </div>
                ) : (
                    <div className="page-content">
                        <p>{pages[currentPageIndex]?.content}</p>
                    </div>
                )}
                <div className="button-group">
                    {!isEditing && currentPageIndex > 0 && (
                        <button className="previous-btn" onClick={() => changePage(-1)}>
                            Previous
                        </button>
                    )}
                    {!isEditing && currentPageIndex < pages.length - 1 && (
                        <button className="next-btn" onClick={() => changePage(1)}>
                            Next
                        </button>
                    )}
                    {isAdmin && !isEditing && (
                        <button className="edit-btn" onClick={handleEditClick}>
                            Edit
                        </button>
                    )}
                    {isEditing && (
                        <button className="save-btn" onClick={saveChanges}>
                            Save Changes
                        </button>
                    )}
                </div>
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Popup;
