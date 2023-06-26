let myLibrary = [];

function Book(title, author, genre, pages, hasRead, id) {
  this.title = title
  this.author = author
  this.genre = genre
  this.pages = pages
  this.hasRead = hasRead
  this.id = id
}

function addBookToLibrary() {
  
}

const bookDisplay = document.querySelector('.book-display');



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

// Handle bookend click

bookDisplay.addEventListener('click', (e) => {
  if (e.target.classList.contains('book-display')) return;

  if (e.target.type === 'button' || e.target.type === 'checkbox') { 
    if (e.target.classList.contains('remove-btn')) {
      let parent = e.target.parentNode.parentNode;
      let bookId = parseInt(parent.dataset.id);
      removeBook(bookId);
      parent.remove();
    }
    return;
  }

  const bookEnd = !(e.target.classList.contains('book-end') || e.target.classList.contains('book-open')) ? e.target.parentNode : e.target;
  const children = Array.from(bookEnd.children);

  bookEnd.classList.toggle('book-open');
  if (bookEnd.classList.contains('book-open')) {
    children.forEach(child => child.classList.remove('hidden'));
  } else {
    children.forEach(child => (child.classList.contains('hideable')) ? child.classList.add('hidden') : '');
  }
});


function removeBook(removeId) {
  myLibrary = myLibrary.filter(book => book.id !== removeId);
}



/////////////



function displayBooks() {
  bookDisplay.innerHTML = '';
  myLibrary.forEach(book => {
    const bookEnd = createBookEnd(book.title, book.author, book.genre, book.pages, book.hasRead, book.id);
    bookDisplay.appendChild(bookEnd);
  });
}

function createBookEnd(title, author, genre, pages, hasRead, id) {
  const div = document.createElement('div');
  div.classList.add('book-end');
  div.dataset.id = id;

  div.innerHTML = 
    `<h4>${title}</h4>
    <span>${author}</span>
    <span class="hidden hideable">${genre}</span>
    <span class="hidden hideable">${pages} pages</span>
    <label for="has-read-edit" class="hidden hideable">
      Read?
      <input type="checkbox" name="has-read-edit" class="has-read" ${(hasRead) ? "checked" : ""}>
    </label>
    <div class="book-open-btns hidden hideable">
      <button type="button" class="btn remove-btn">Remove</button>
      <button type="button" class="btn">Close</button>
    </div>
  `
  return div;
}

const addBookForm = document.querySelector('.add-book-form');
let bookIdNumbers = [0,1,2,3,4,5,6]

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let bookArgs = [
    document.querySelector('#title').value,
    document.querySelector('#author').value,
    document.querySelector('#genre').value,
    document.querySelector('#pages').value,
    document.querySelector('#has-read').checked,
    assignBookId()
  ]
  let book = new Book(...bookArgs);
  myLibrary.push(book);
  displayBooks();
  addBookForm.reset();
});

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

displayBooks();