
        const userId = 'user123';  // Dummy user ID

        function showTab(tabId) {
            // Hide all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            // Show the selected tab
            document.getElementById(tabId).classList.add('active');
        }

        function uploadPDF() {
            const formData = new FormData();
            const fileField = document.querySelector('input[type="file"]');
            
            formData.append('file', fileField.files[0]);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.summary) {
                    document.getElementById("summaryOutput").value = data.summary;
                    document.getElementById("extractedTextOutput").value = data.extracted_text;
                } else if (data.error) {
                    document.getElementById("error").innerText = data.error;
                }
            })
            .catch(error => {
                document.getElementById("error").innerText = "An error occurred. Please try again.";
                console.error('Error:', error);
            });
        }

        function addBookmark() {
            const sectionText = document.getElementById('bookmarkText').value;

            fetch('/add_bookmark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, section: sectionText })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadBookmarks();
            })
            .catch(error => {
                document.getElementById("error").innerText = "An error occurred. Please try again.";
                console.error('Error:', error);
            });
        }

        function loadBookmarks() {
            fetch('/get_bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            })
            .then(response => response.json())
            .then(data => {
                const bookmarksList = document.getElementById('bookmarksList');
                bookmarksList.innerHTML = '';
                data.bookmarks.forEach(bookmark => {
                    const item = document.createElement('div');
                    item.innerText = bookmark;
                    bookmarksList.appendChild(item);
                });
            })
            .catch(error => console.error('Error:', error));
        }

        function exportContent() {
            const content = document.getElementById("summaryOutput").value || document.getElementById("extractedTextOutput").value;
            const format = document.getElementById("exportFormat").value;
            const filename = document.getElementById("exportFilename").value || 'exported_content';

            if (!content) {
                document.getElementById("error").innerText = "No content to export.";
                return;
            }

            fetch('/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content, format: format, filename: filename })
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();  // Return the file as a Blob
                } else {
                    return response.json().then(err => Promise.reject(err));
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename + (format === 'pdf' ? '.pdf' : '.docx');
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                document.getElementById("error").innerText = error.error || "An error occurred. Please try again.";
                console.error('Export error:', error);
            });
        }

        // Load bookmarks when the page is loaded
        window.onload = loadBookmarks;