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

// Handle book card click

bookDisplay.addEventListener('click', (e) => {
  let clickedElement = e.target;
  let selected = () => {
    return (clickedElement.classList.contains('book-display')) ? 'book-display' :
      (clickedElement.classList.contains('remove-confirm')) ? 'remove-confirm' :
      (clickedElement.classList.contains('remove-btn')) ? 'remove-btn' :
      (clickedElement.classList.contains('has-read-edit')) ? 'has-read-edit' :
      (clickedElement.classList.contains('cbox-label')) ? 'cbox-label' :
      (clickedElement.classList.contains('book-end')) ? 'book-end' :
      (clickedElement.classList.contains('book-open')) ? 'book-open' :
      '';
  };

  if (selected() === 'book-display') return;
  if (clickedElement.type === 'button' || clickedElement.type === 'checkbox') {
    handleInputClick(clickedElement, selected());
    return;
  }
  if (selected() === 'cbox-label') return;
  toggleBookModal(selected(), clickedElement);
});

function handleInputClick(clickedElement, selected) {
  let parent = clickedElement.parentNode.parentNode;
  let selectedId = parseInt(parent.dataset.id);
  if (selected === 'remove-confirm') {
    removeBook(selectedId);
    parent.remove();
  } else if (selected === 'remove-btn') {
    showRemoveConfirmBtn(clickedElement);
  } else if (selected === 'has-read-edit') {
    changeReadStatus(selectedId);
  }
}

// Book card display functions

function toggleBookModal(selected, clickedElement) {
  const bookEnd = !(selected === 'book-end' || selected === 'book-open') ? clickedElement.parentNode : clickedElement;
  const children = Array.from(bookEnd.children);
  toggleBookOpen(bookEnd);
  toggleBookDetailsDisplay(bookEnd, children);
}

function toggleBookOpen(bookEnd) {
  bookEnd.classList.toggle('book-open');
}

function showRemoveConfirmBtn(btn) {
  btn.classList.add('remove-confirm');
  btn.textContent = 'Confirm?';
  setTimeout(() => {
    btn.classList.remove('remove-confirm');
    btn.textContent = 'Remove';
  }, 5000);
}

function toggleBookDetailsDisplay(bookEnd, children) {
  if (bookEnd.classList.contains('book-open')) {
    children.forEach(child => child.classList.remove('hidden'));
  } else {
    children.forEach(child => (child.classList.contains('hideable')) ? child.classList.add('hidden') : '');
  }
}

// Main display functions

function displayBooks() {
  clearBookDisplay()
  myLibrary.forEach(book => {
    const bookEnd = createBookEnd(book.title, book.author, book.genre, book.pages, book.hasRead, book.id);
    bookDisplay.appendChild(bookEnd);
  });
}

function clearBookDisplay() {
  bookDisplay.innerHTML = '';
}

function updateStatusDisplay() {
  const totalBooks = document.querySelector('.total-books-display');
  const readBooks = document.querySelector('.read-books-display');
  totalBooks.textContent = `In library: ${getTotalBooks()}`;
  readBooks.textContent = `Read: ${getTotalBooksRead()}`;
}

function updateDisplay() {
  displayBooks();
  updateStatusDisplay();
}

// Create element functions

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

// Handle Add Book form click

addBookBtn.addEventListener('click', () => toggleFormVisibility());

addMenuBtn.forEach(e => {
  let classes = e.classList;
  const titleInput = document.querySelector('#title');
  const authorInput = document.querySelector('#author');
  const genreInput = document.querySelector('#genre');
  const pagesInput = document.querySelector('#pages');
  const hasReadInput = document.querySelector('#has-read');
  const requiredInputs = [titleInput, authorInput, pagesInput];

  e.addEventListener('click', e => {
    if (classes.contains('add-book-submit-btn')) {
      e.preventDefault();
      if (!isValidForm(requiredInputs)) {
        toggleRequiredMsgs(requiredInputs);
        return;
      }
      let inputValues = [
        titleInput.value, 
        authorInput.value, 
        genreInput.value, 
        pagesInput.value, 
        hasReadInput.checked
      ];
      handleSubmitBtnClick(inputValues);
    }
    clearForm(addBookForm, requiredInputs);
    toggleFormVisibility();
  });
});

function handleSubmitBtnClick(inputValues) {
  let newBook = createBook(...inputValues);
  addBookToLibrary(newBook);
  updateDisplay();
}

// Add book form functions

function clearForm(form, requiredInputs) {
  requiredInputs.forEach(input => hideRequiredMsg(input));
  form.reset();
}

function isValidInput(input) {
  return ((isWhitespace(input.value)) || (input.type === 'number' && input.value <= 0));
}

function isValidForm(inputs) {
  return (inputs.some(input => isValidInput(input))) ? false : true;
}

function toggleRequiredMsgs(inputs) {
  inputs.forEach(input => (isValidInput(input)) ? showRequiredMsg(input) : hideRequiredMsg(input));
}

function showRequiredMsg(input) {
  input.nextElementSibling.classList.add('required-show');
}

function hideRequiredMsg(input) {
  input.nextElementSibling.classList.remove('required-show');
}

function toggleFormVisibility() {
  formContainer.classList.toggle('modal-open');
}

// Book functions

function createBook(title, author, genre, pages, hasRead) {
  return new Book(
    title,
    author,
    genre,
    pages,
    hasRead,
    assignBookId()
  );
}

function assignBookId() {
  let newId = parseInt(bookIdNumbers.slice(-1)) + 1;
  bookIdNumbers.push(newId);
  return newId;
}

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

// Library functions

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function getTotalBooks() {
  return myLibrary.length;
}

function getTotalBooksRead() {
  return myLibrary.filter(book => book.hasRead === true).length;
}

// Sort functions

let currentSort;

function sortLibrary(property) {
  currentSort = property;
  // updateDisplay(); //
}

function sortByString(property) {
  myLibrary.sort((a, b) => a[property].localeCompare(b[property]));
}

function sortByNumber(property) {
  myLibrary.sort((a, b) => parseInt(a[property]) - parseInt(b[property]));
}

// Misc functions

function isWhitespace(str) {
  return (!str || !str.trim());
}

//Dummy books

let book = new Book('The Blade Itself','Joe Abercrombie','Fiction','515',true, 0);
let book2 = new Book('Before They Are Hanged','Joe Abercrombie','Fantasy','441',true, 1);
let book3 = new Book('Last Argument of Kings','Joe Abercrombie','Fiction', '347', true, 2);
let book4 = new Book('Half A King','Joe Abercrombie','Fiction','416',false, 3);
let book5 = new Book('Good Omens', 'Terry Pratchett & Neil Gaiman', 'Fiction', '415', true, 4);
let book6 = new Book('Animal Farm', 'George Orwell', 'Classics', '122', true, 5);
let book7 = new Book('Reamde','Neil Stephenson', 'SciFi', '1044', true, 6);
myLibrary.push(book, book2, book3, book4, book5, book6, book7);

updateDisplay();