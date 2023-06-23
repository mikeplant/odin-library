let myLibrary = [];

function Book(title, author, genre, pages, hasRead) {
  this.title = title
  this.author = author
  this.genre = genre
  this.pages = pages
  this.hasRead = hasRead
}

function addBookToLibrary() {
  
}

// Loop through books
// Create elements with book info
// display on page




// Add button form handlers

const addBookBtn = document.querySelector('.add-book-menu-btn');
const formContainer = document.querySelector('.form-container');
const addMenuBtn = document.querySelectorAll('.add-menu-btn');

// Open form on add button click

addBookBtn.addEventListener('click', () => formContainer.classList.toggle('modal-open'));

// Handle add form 

addMenuBtn.forEach(e => {
  let classes = e.classList;
  e.addEventListener('click', e => {
    if (classes.contains('add-book-submit-btn')) {
    //code...
    }
    formContainer.classList.toggle('modal-open');
  });
});

//Dummy books

let book = new Book('The Blade Itself','Joe Abercrombie','Fiction','515',true);
let book2 = new Book('Before They Are Hanged','Joe Abercrombie','Fiction','441',true);
let book3 = new Book('Last Argument of Kings','Joe Abercrombie','Fiction',true);
let book4 = new Book('Half A King','Joe Abercrombie','Fiction','416',false);
let book5 = new Book('Good Omens', 'Terry Pratchett & Neil Gaiman', 'Fiction', '415', true);
let book6 = new Book('Animal Farm', 'George Orwell', 'Fiction', '122', true);
let book7 = new Book('Reamde','Neil Stephenson', 'Fiction', '1044', true);
myLibrary.push(book, book2, book3, book4, book5, book6, book7);

/////////////

const bookDisplay = document.querySelector('.book-display');

myLibrary.forEach(book => {
  
  const bookEnd = createBookEnd(book.title, book.author);
  bookDisplay.appendChild(bookEnd);
});

function createBookEnd(title, author) {
  const div = document.createElement('div');
  div.classList.add('book-end');

  const titleH4 = document.createElement('h4');
  titleH4.textContent = title;

  const authorSpan = document.createElement('span');
  authorSpan.textContent = author;

  div.appendChild(titleH4);
  div.appendChild(authorSpan);
  return div;
}