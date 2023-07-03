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
      (clickedElement.classList.contains('edit-btn')) ? 'edit-btn' :
      (clickedElement.classList.contains('confirm-edit-btn')) ? 'confirm-edit-btn' :
      (clickedElement.classList.contains('cancel-edit-btn')) ? 'cancel-edit-btn' :
      (clickedElement.classList.contains('has-read-edit')) ? 'has-read-edit' :
      (clickedElement.classList.contains('cbox-label')) ? 'cbox-label' :
      (clickedElement.classList.contains('book-end')) ? 'book-end' :
      (clickedElement.classList.contains('book-open')) ? 'book-open' :
      '';
  };

  if (selected() === 'book-display') return;
  if (clickedElement.type === 'button' || clickedElement.type === 'checkbox' || clickedElement.type === 'text') {
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
  } else if (selected === 'confirm-edit-btn') {
    selectedId = parseInt(parent.parentNode.dataset.id);
    const requiredInputs = getRequiredElements(selectedId);
    if (!isValidForm(requiredInputs)) return;
    updateBookDetails(selectedId);
    updateBookDisplay(selectedId, parent.parentNode);
  } else if (selected === 'edit-btn') {
    parent.classList.add('editing');
    parent.innerHTML = '';
    showBookEditForm(selectedId, parent);
  } else if (selected === 'cancel-edit-btn') {
    selectedId = parseInt(parent.parentNode.dataset.id);
    parent.classList.remove('editing');
    parent.innerHTML = '';
    updateBookDisplay(selectedId, parent.parentNode);
  } else if (selected === 'remove-btn') {
    showRemoveConfirmBtn(clickedElement);
  } else if (selected === 'has-read-edit') {
    changeReadStatus(selectedId);
  }
}

function getRequiredElements(id) {
  const title = document.querySelector(`#title-edit-${id}`);
  const author = document.querySelector(`#author-edit-${id}`);
  const pages = document.querySelector(`#pages-edit-${id}`);
  return [title, author, pages];
}

function updateBookDisplay(id, parent) {
  const updatedBookEnd = createBookEnd(...Object.values(getBookById(id)));
  updatedBookEnd.classList.add('book-open');
  Array.from(updatedBookEnd.children).forEach(child => child.classList.remove('hidden'));
  bookDisplay.replaceChild(updatedBookEnd, parent);
}

function getEditFormValues(id) {
  const title = document.querySelector(`#title-edit-${id}`);
  const author = document.querySelector(`#author-edit-${id}`);
  const genre = document.querySelector(`#genre-edit-${id}`);
  const pages = document.querySelector(`#pages-edit-${id}`);

  const updatedDetails = {
    title: title.value,
    author: author.value,
    genre: genre.value,
    pages: pages.value
  }

  return updatedDetails;
}

function updateBookDetails(id) {
  const book = getBookById(id);
  const updatedBook = getEditFormValues(id);
  book.title = updatedBook.title;
  book.author = updatedBook.author;
  book.genre = updatedBook.genre;
  book.pages = updatedBook.pages;
}

function getBookById(id) {
  return myLibrary.find(book => book.id === id);
}

function showBookEditForm(selectedId, parent) {
  const book = getBookById(selectedId);
  const form = createEditForm(book);
  parent.appendChild(form);
}

function createEditForm(book) {
  const form = createDOMElement('form', {
    'class': ['book-edit-form']
  });
  const legend = createDOMElement('legend', {
    'textContent': 'Edit Book'
  });
  const btnContainer = createDOMElement('div', {
    'class': ['edit-btn-container', 'book-open-btns']
  });
  const cancelBtn = createDOMElement('button', {
    'class': ['cancel-edit-btn', 'btn'],
    'type': 'button',
    'textContent': 'Cancel'
  });
  const confirmBtn = createDOMElement('button', {
    'class': ['confirm-edit-btn', 'btn'],
    'type': 'button',
    'textContent': 'Confirm'
  });
  form.appendChild(legend);
  btnContainer.append(cancelBtn, confirmBtn);

  for (const key in book) {
    if (key !== 'hasRead' && key !== 'id') {
      const label = createDOMElement('label', {
        'for': `${key}-edit-${book.id}`,
        'textContent': `${key.charAt(0).toUpperCase() + key.slice(1)}`
      });
      const input = createDOMElement('input', {
        'type': `${(key === 'pages') ? 'number' : 'text'}`,
        'name': `${key}-edit-${book.id}`,
        'id': `${key}-edit-${book.id}`,
        'value': `${book[key]}`
      });
      if (key === 'pages') input.setAttribute('min', 1);
      if (key !== 'genre') input.setAttribute('required', '');
      form.append(label, input);
    }
  }
  form.appendChild(btnContainer)
  return form;
}

// Book card display functions

function toggleBookModal(selected, clickedElement) {
  const bookEnd = !(selected === 'book-end' || selected === 'book-open') ? clickedElement.parentNode : clickedElement;
  const children = Array.from(bookEnd.children);
  if (bookEnd.classList.contains('book-edit-form') || bookEnd.classList.contains('editing')) return;
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
  const totalBooks = document.querySelector('.current-total');
  const readBooks = document.querySelector('.read-total');
  const unreadBooks = document.querySelector('.unread-total');
  totalBooks.textContent = `${getTotalBooks()}`;
  readBooks.textContent = `${getTotalBooksRead()}`;
  unreadBooks.textContent = `${getTotalBooksUnread()}`;
}

function updateDisplay() {
  displayBooks();
  updateStatusDisplay();
}

// Create element functions

function createBookEnd(title, author, genre, pages, hasRead, id) {
  const div = createDOMElement('div', {
    'class': ["book-end"], 
    'data-id': id
  });
  const checkbox = createDOMElement('input', {
    'class': ["has-read", "has-read-edit"], 
    'type': "checkbox", 
    'name': "has-read-edit", 
    'hasRead': hasRead
  });
  const removeBtn = createDOMElement('button', {
    'class': ["btn", "remove-btn"], 
    'type': 'button', 
    'textContent': 'Remove'
  });
  const editBtn = createDOMElement('button', {
    'class': ["btn", "edit-btn"], 
    'type': 'button', 
    'textContent': 'Edit'
  });

  const elements = [
    ['h4', {
      'textContent': title
    }],
    ['span', {
      'textContent': author
    }],
    ['span', {
      'class': ["hidden", "hideable"], 
      'textContent': genre
    }],
    ['span', {
      'class': ["hidden", "hideable"], 
      'textContent': `${pages} pages`
    }],
    ['label', {
      'class': ["cbox-label", "hidden", "hideable"], 
      'textContent': 'Read?'
    }],
    ['div', {
      'class': ["book-open-btns", "hidden", "hideable"]
    }]
  ];

  elements.forEach(element => {
    const newElement = createDOMElement(...element);
    div.appendChild(newElement);
  });

  div.querySelector('.cbox-label').appendChild(checkbox);
  div.querySelector('.book-open-btns').appendChild(editBtn);
  div.querySelector('.book-open-btns').appendChild(removeBtn);

  return div;
}

function createDOMElement(element, attributes) {
  const newElement = document.createElement(element);

  for (const property in attributes) {
    if (property === 'class') {;
      attributes['class'].forEach(clas => newElement.classList.add(clas)) 
    } else if (property === 'textContent') {
      newElement.textContent = attributes['textContent'];
    } else if (property === 'hasRead') {
      newElement.checked = attributes['hasRead'];
    } else {
      newElement.setAttribute(property, attributes[property]);
    }
  }

  return newElement;
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

function getTotalBooksUnread() {
  return myLibrary.filter(book => book.hasRead === false).length;
}

// Sort functions

let currentSort = 'id';
const dropBtn = document.querySelector('.drop-btn');
const sortMenu = document.querySelector('.sort-menu');
const sortSelectBtns = Array.from(document.querySelectorAll('.sort-select'));

dropBtn.addEventListener('click', e => {
  toggleSortMenuShow();
  toggleDropBtnBorder();
});

sortSelectBtns.forEach(btn => btn.addEventListener('click', e => {
  let sortBy = e.target.id.split('-')[0];
  handleSortBtnClick(sortBy);
  updateDisplay();
  currentSort = sortBy;
}));

function handleSortBtnClick(sortBy) {
  (sortBy === currentSort) ? reverseLibrarySort() : sortLibrary(sortBy);
}

function toggleSortMenuShow() {
  sortMenu.classList.toggle('sort-menu-show');
}

function toggleDropBtnBorder() {
  dropBtn.classList.toggle('drop-menu-open');
}

function reverseLibrarySort() {
  myLibrary.reverse();
}

function sortLibrary(sortBy) {
  (sortBy === 'pages' || sortBy === 'id') ? sortByNumber(sortBy) : sortByString(sortBy);
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