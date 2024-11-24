let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];

// البحث عن الكتب
document.getElementById("search-button").addEventListener("click", function () {
    const query = document.getElementById("search-input").value.trim();
    const resultsContainer = document.getElementById("results-container");

    if (!query) {
        resultsContainer.innerHTML = `<p>يرجى إدخال كلمة للبحث.</p>`;
        return;
    }

    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                resultsContainer.innerHTML = data.items.map(book => {
                    const volumeInfo = book.volumeInfo;
                    return `
                        <div class="result-card">
                            <img src="${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${volumeInfo.title}">
                            <h4>${volumeInfo.title}</h4>
                            <p>المؤلف: ${volumeInfo.authors?.join(', ') || 'غير معروف'}</p>
                            <button onclick="saveBook('${volumeInfo.title}', '${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}', '${volumeInfo.previewLink || '#'}')">
                                حفظ الكتاب
                            </button>
                            <button onclick="window.open('${volumeInfo.previewLink}', '_blank')">
                                عرض الكتاب
                            </button>
                        </div>
                    `;
                }).join("");
            } else {
                resultsContainer.innerHTML = `<p>لم يتم العثور على نتائج.</p>`;
            }
        })
        .catch(() => {
            resultsContainer.innerHTML = `<p>حدث خطأ أثناء البحث.</p>`;
        });
});

// حفظ الكتاب
function saveBook(title, image, link) {
    if (savedBooks.some(book => book.title === title)) {
        alert("الكتاب محفوظ بالفعل!");
        return;
    }

    savedBooks.push({ title, image, link });
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    updateSavedBooks();
}

// تحديث قائمة الكتب المحفوظة
function updateSavedBooks() {
    const savedBooksContainer = document.getElementById("saved-books-container");
    if (savedBooks.length === 0) {
        savedBooksContainer.innerHTML = `<p>لا توجد كتب محفوظة.</p>`;
    } else {
        savedBooksContainer.innerHTML = savedBooks.map((book, index) => `
            <div class="saved-book">
                <img src="${book.image}" alt="${book.title}">
                <h4>${book.title}</h4>
                <button onclick="removeBook(${index})">حذف</button>
                <button onclick="window.open('${book.link}', '_blank')">عرض الكتاب</button>
            </div>
        `).join("");
    }
}

// حذف الكتاب
function removeBook(index) {
    savedBooks.splice(index, 1);
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    updateSavedBooks();
}

// عرض الكتب المحفوظة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
    updateSavedBooks();
});



const savedBooksContainer = document.getElementById('saved-books-container');
const clearSavedBooksButton = document.getElementById('clear-saved-books');

// إضافة كتاب محفوظ
function addBookToSaved(title) {
    const bookIcon = document.createElement('div');
    bookIcon.classList.add('book-icon');
    bookIcon.textContent = title;

    // إضافة خيار حذف فردي
    bookIcon.onclick = function () {
        bookIcon.remove();
        checkIfEmpty();
    };

    savedBooksContainer.appendChild(bookIcon);
    checkIfEmpty();
}

// التحقق من وجود كتب
function checkIfEmpty() {
    if (savedBooksContainer.children.length === 0) {
        savedBooksContainer.innerHTML = '<p>لا توجد كتب محفوظة.</p>';
    } else {
        const placeholder = savedBooksContainer.querySelector('p');
        if (placeholder) placeholder.remove();
    }
}

// حذف كل الكتب
clearSavedBooksButton.onclick = function () {
    savedBooksContainer.innerHTML = '<p>لا توجد كتب محفوظة.</p>';
};

// مثال: إضافة كتاب عند الضغط على زر البحث
document.getElementById('search-button').onclick = function () {
    const searchInput = document.getElementById('search-input');
    if (searchInput.value.trim()) {
        addBookToSaved(searchInput.value.trim());
        searchInput.value = '';
    }
};