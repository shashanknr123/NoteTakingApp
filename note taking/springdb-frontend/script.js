document.addEventListener('DOMContentLoaded', function() {
    const notesList = document.getElementById('notes-list');
    const titleInput = document.getElementById('title');
    const messageInput = document.getElementById('message');
    const noteDetails = document.getElementById('note-details');
    const updateButton = document.getElementById('update-note');
    const deleteButton = document.getElementById('delete-note');
    const saveButton = document.getElementById('save-note');
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('search-results');
    
    let selectedNoteId = null;
    let allNotes = [];

    // Fetch and display all notes
    function fetchNotes(searchQuery = '') {
        fetch(`http://localhost:8080/getNote?search=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(notes => {
                allNotes = notes; // Save all notes for filtering
                displayNotes(allNotes); // Display notes
                populateSearchResults(allNotes); // Update dropdown list
            });
    }

    // Function to display notes including creation time
    function displayNotes(notes) {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.innerHTML = `<p><strong>${note.title}</strong></p><p> ${new Date(note.createdAt).toLocaleString()}</p>`;
            noteItem.dataset.id = note.id;
            noteItem.addEventListener('click', () => selectNote(note));
            notesList.appendChild(noteItem);
        });
    }

    // Populate the dropdown list with search results
    function populateSearchResults(notes) {
        searchResults.innerHTML = '';
        
        notes.forEach(note => {
            const resultItem = document.createElement('li');
            resultItem.textContent = note.title;
            resultItem.dataset.id = note.id;
            resultItem.addEventListener('click', () => selectNoteFromDropdown(note));
            searchResults.appendChild(resultItem);
        });
        searchResults.classList.toggle('hidden', notes.length === 0);
    }

    // Search notes
    function searchNotes() {
        const query = searchInput.value;
        fetchNotes(query);
    }

    // Function to handle selecting a note from the dropdown
    function selectNoteFromDropdown(note) {
        searchInput.value = note.title;
        selectNote(note);
        searchResults.classList.add('hidden'); // Hide dropdown
    }

    // Function to handle updating an existing note
    function updateNote() {
        const note = {
            id: selectedNoteId,
            title: titleInput.value,
            message: messageInput.value
        };
        
        fetch(`http://localhost:8080/updateNote`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
        .then(response => {
            if (response.ok) {
                alert('Note updated successfully!');
                fetchNotes(); // Refresh the notes list
                noteDetails.classList.add('hidden'); // Hide the note details section
            } else {
                alert('Failed to update note.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the note.');
        });
    }

    // Attach the updateNote function to the update button click event
    updateButton.addEventListener('click', updateNote);

    // Select a note and enable update/delete buttons
    function selectNote(note) {
        selectedNoteId = note.id;
        titleInput.value = note.title;
        messageInput.value = note.message;
        document.getElementById('created-time').textContent = new Date(note.createdAt).toLocaleString(); // Display creation time
        noteDetails.classList.remove('hidden');
        updateButton.classList.remove('hidden');
        deleteButton.classList.remove('hidden');
        saveButton.classList.remove('hidden');
    }

    // Add new note
    document.getElementById('add-new').addEventListener('click', () => {
        selectedNoteId = null;
        titleInput.value = '';
        messageInput.value = '';
        noteDetails.classList.remove('hidden');
        updateButton.classList.add('hidden');
        deleteButton.classList.add('hidden');
        saveButton.classList.remove('hidden');
    });

    // Save note (either create new or update existing)
    saveButton.addEventListener('click', () => {
        if (selectedNoteId === null) {
            // Create new note
            fetch('http://localhost:8080/addNote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: titleInput.value, message: messageInput.value })
            })
            .then(response => response.json())
            .then(() => {
                alert('Note created successfully!');
                fetchNotes();
                noteDetails.classList.add('hidden');
            });
        } else {
            // Update existing note
            updateNote();
        }
    });

    // Delete note
    deleteButton.addEventListener('click', () => {
        if (selectedNoteId !== null) {
            fetch(`http://localhost:8080/deleteNote/${selectedNoteId}`, {
                method: 'DELETE'
            })
            .then(() => {
                alert('Note deleted successfully!');
                fetchNotes();
                noteDetails.classList.add('hidden');
            });
        }
    });

    // Attach the searchNotes function to the search input field
    searchInput.addEventListener('input', searchNotes);

    // Initial fetch of all notes
    fetchNotes();
});
