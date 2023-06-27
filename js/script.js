let myLibrary = [];
let bookIdNumbers = [0,1,2,3,4,5,6];
const bookDisplay = document.querySelector('.book-display');
const addBookBtn = document.querySelector('.add-book-menu-btn');
const formContainer = document.querySelector('.form-container');
const addMenuBtn = document.querySelectorAll('.add-menu-btn');
const addBookForm = document.querySelector('.add-book-form');
const hasReadEdit = document.querySelector('#has-read-edit');


function Book(title, author, genre, pages, hasRead, id) {
  this.title = title
  this.author = author
  this.genre = genre
  this.pages = pages
  this.hasRead = hasRead
  this.id = id
}

// Open form on add button click

addBookBtn.addEventListener('click', () => formContainer.classList.toggle('modal-open'));

// Handle bookend click

bookDisplay.addEventListener('click', (e) => {
  if (e.target.classList.contains('book-display')) return;

  console.log(e.target)

  if (e.target.type === 'button' || e.target.type === 'checkbox') {
    let parent = e.target.parentNode.parentNode;
    let selectedId = parseInt(parent.dataset.id);
    if (e.target.classList.contains('remove-confirm')) {
      removeBook(selectedId);
      parent.remove();
    } else if (e.target.classList.contains('remove-btn')) {
      e.target.classList.add('remove-confirm');
      e.target.textContent = 'Confirm?';
      setTimeout(() => {
        e.target.classList.remove('remove-confirm');
        e.target.textContent = 'Remove';
      }, 5000);
    } else if (e.target.classList.contains('has-read-edit')) {
      changeReadStatus(selectedId);
    }
    return;
  }

  if (e.target.classList.contains('cbox-label')) return;

  const bookEnd = !(e.target.classList.contains('book-end') || e.target.classList.contains('book-open')) ? e.target.parentNode : e.target;
  const children = Array.from(bookEnd.children);

  bookEnd.classList.toggle('book-open');
  if (bookEnd.classList.contains('book-open')) {
    children.forEach(child => child.classList.remove('hidden'));
  } else {
    children.forEach(child => (child.classList.contains('hideable')) ? child.classList.add('hidden') : '');
  }
});

function removeBook(selectedId) {
  myLibrary = myLibrary.filter(book => book.id !== selectedId);
  updateStatusDisplay();
}

function changeReadStatus(selectedId) {
  myLibrary.forEach(book => {
    if (book.id !== selectedId) return;
    book.hasRead = (book.hasRead === true) ? false : true;
  });
  updateStatusDisplay();
}

// Display functions

function displayBooks() {
  bookDisplay.innerHTML = '';
  myLibrary.forEach(book => {
    const bookEnd = createBookEnd(book.title, book.author, book.genre, book.pages, book.hasRead, book.id);
    bookDisplay.appendChild(bookEnd);
  });
}

function updateStatusDisplay() {
  const totalBooks = document.querySelector('.total-books-display');
  const readBooks = document.querySelector('.read-books-display');
  let totalRead = myLibrary.filter(book => book.hasRead === true);
  totalBooks.textContent = `In library: ${myLibrary.length}`;
  readBooks.textContent = `Read: ${totalRead.length}`;
}

function updateDisplay() {
  displayBooks();
  updateStatusDisplay();
}

// Create elements

function createBookEnd(title, author, genre, pages, hasRead, id) {
  const div = document.createElement('div');
  div.classList.add('book-end');
  div.dataset.id = id;

  div.innerHTML = 
    `<h4>${title}</h4>
    <span>${author}</span>
    <span class="hidden hideable">${genre}</span>
    <span class="hidden hideable">${pages} pages</span>
    <label class="cbox-label hidden hideable">
      Read?
      <input type="checkbox" name="has-read-edit" class="has-read has-read-edit" ${(hasRead) ? "checked" : ""}>
    </label>
    <div class="book-open-btns hidden hideable">
      <button type="button" class="btn remove-btn">Remove</button>
    </div>
  `
  return div;
}

// Add book listener and functions

addMenuBtn.forEach(e => {
  let classes = e.classList;
  const titleInput = document.querySelector('#title');
  const authorInput = document.querySelector('#author');
  const genreInput = document.querySelector('#genre');
  const pagesInput = document.querySelector('#pages');
  const hasReadInput = document.querySelector('#has-read');

  e.addEventListener('click', e => {
    if (classes.contains('add-book-submit-btn')) {
      e.preventDefault();
      if (titleInput.value === '' || authorInput.value === '' || pagesInput.value === '') {
        (titleInput.value === '') ? titleInput.nextElementSibling.classList.add('required-show') : titleInput.nextElementSibling.classList.remove('required-show');
        (authorInput.value === '') ? authorInput.nextElementSibling.classList.add('required-show') : authorInput.nextElementSibling.classList.remove('required-show');
        (pagesInput.value === '') ? pagesInput.nextElementSibling.classList.add('required-show') : pagesInput.nextElementSibling.classList.remove('required-show');
        return;
        }
      
      createBook(titleInput.value, authorInput.value, genreInput.value, pagesInput.value, hasReadInput.checked);
      updateDisplay();
    }

    titleInput.nextElementSibling.classList.remove('required-show');
    authorInput.nextElementSibling.classList.remove('required-show');
    pagesInput.nextElementSibling.classList.remove('required-show');

    formContainer.classList.toggle('modal-open');
    addBookForm.reset();
  });
});

function createBook(title, author, genre, pages, hasRead) {
  let bookArgs = [
    title,
    author,
    genre,
    pages,
    hasRead,
    assignBookId()
  ];
  let book = new Book(...bookArgs);
  myLibrary.push(book);
}

function assignBookId() {
  let newId = parseInt(bookIdNumbers.slice(-1)) + 1;
  bookIdNumbers.push(newId);
  return newId;
}



//Dummy books

let book = new Book('The Blade Itself','Joe Abercrombie','Fiction','515',true, 0);
let book2 = new Book('Before They Are Hanged','Joe Abercrombie','Fiction','441',true, 1);
let book3 = new Book('Last Argument of Kings','Joe Abercrombie','Fiction', '347', true, 2);
let book4 = new Book('Half A King','Joe Abercrombie','Fiction','416',false, 3);
let book5 = new Book('Good Omens', 'Terry Pratchett & Neil Gaiman', 'Fiction', '415', true, 4);
let book6 = new Book('Animal Farm', 'George Orwell', 'Fiction', '122', true, 5);
let book7 = new Book('Reamde','Neil Stephenson', 'Fiction', '1044', true, 6);
myLibrary.push(book, book2, book3, book4, book5, book6, book7);

updateDisplay();