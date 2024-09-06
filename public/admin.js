
// Your Code Here
document.addEventListener('DOMContentLoaded', async () => {
    const bookList = document.getElementById('book-list');
    const bookForm = document.getElementById('book-form');

    // Function to fetch and display books
    async function fetchBooks() {
        const response = await fetch('http://localhost:3001/listBooks');
        const books = await response.json();

        bookList.innerHTML = ''; // Clear existing book list

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'col-md-4 mb-3';

            const card = document.createElement('div');
            card.className = 'card';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = book.title;
            cardBody.appendChild(title);

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.className = 'form-control mb-2';
            quantityInput.value = book.quantity;
            cardBody.appendChild(quantityInput);

            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary';
            saveButton.textContent = 'Save';
            cardBody.appendChild(saveButton);

            // Event listener for Save button
            saveButton.addEventListener('click', async () => {
                const updatedQuantity = quantityInput.value;
                await fetch('http://localhost:3001/updateBook', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: book.id,
                        quantity: updatedQuantity,
                    }),
                });
                alert(`Quantity for "${book.title}" updated to ${updatedQuantity}`);
                fetchBooks(); // Refresh the book list to show updated quantities
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger ms-2';
            deleteButton.textContent = 'Delete';
            cardBody.appendChild(deleteButton);

            // Event listener for Delete button
            deleteButton.addEventListener('click', async () => {
                await fetch('http://localhost:3001/deleteBook', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: book.id }),
                });
                fetchBooks(); // Refresh the book list to remove the deleted book
            });

            card.appendChild(cardBody);
            bookItem.appendChild(card);
            bookList.appendChild(bookItem);
        });
    }

    fetchBooks(); // Initial load of books

    // Handle form submission for adding a new book
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const currentYear = new Date().getFullYear();

        const response = await fetch('http://localhost:3001/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                year: currentYear
            }),
        });

        const newBook = await response.json();
        alert(`New book added: ${newBook.title}`);
        fetchBooks(); // Refresh the book list to include the new book
        bookForm.reset(); // Clear the form
    });
});
