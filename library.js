//default library values
let myLibrary = [
  new Book("Crime and Punishment", "Dostoeyvsky", 400, "yes"),
  new Book("Anna Karenina", "Leo Tolstoy", 800, "yes"),
  new Book("War and Peace", "Leo Tolstoy", 1440, "no"),
  new Book("1984", "George Orwell", 300, "yes"),
  new Book("Pastoralia", "George Saunders", 150, "yes")
];

function Book(title, author, pages, hasread) {
    this.title = title;
    this.author = author; 
    this.pages = pages;
    this.hasread = hasread;
}

Book.prototype.read = function () {
  this.hasread = (this.hasread === "yes")? "no" : "yes";
}

//Setting initial constants
const bookshelf = document.getElementById("bookshelf");
const submit = document.getElementById("submit");

//if storage is local storage/firebase etc.
let storage = "";


//makes sure each newly generated book has event listener attached.
bookshelf.addEventListener("click", function(e) {

  //delete button
  if (e.target && getButtonName(e.target.id) == "delete" ) {
    console.log("button of bookshelf clicked!");
    index = grabIndex(e.target.id);
    deleteBook(index);
  } 
  //read button
  else if (e.target && getButtonName(e.target.id) == "read" ) {
      console.log("button of bookshelf clicked! 2");
      index = grabIndex(e.target.id);
      readBook(index);
  }
  drawBookshelf(myLibrary);
})

//draw library when webpage first loaded
drawBookshelf(myLibrary);
console.log(myLibrary);

//Event listener to add book to library
submit.addEventListener("click", function () {
  //there will be new values every time, hence need to be set in this func
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let hasread = (document.getElementById("has-read").checked)? "yes" : "no";

  //check if form variables are blank
  if (![title, author, pages].includes("")) {
    let latestBook = new Book(title, author, pages, hasread);
    resetForm();
    addBook(latestBook);
  }
  console.log(myLibrary);
  drawBookshelf(myLibrary);
})

//helper methods

function grabIndex(string) {
  return string.split("-")[1];
}

function getButtonName (string) {
  return string.split("-")[0];
}

//action methods

function resetForm() {
  //reset form after every successfully created book
  let input_defaults = {"title": "", "author": "", "pages": ""}
  for (let key in input_defaults) {
    document.getElementById(key).value = input_defaults[key];
  }
  document.getElementById("has-read").checked = false;
}

function deleteBook(index) {
  myLibrary.splice(index, 1);  
}

function addBook(book) {
  myLibrary.push(book);
}

// might need to be function
function readBook(index) {
  myLibrary[index].read();
}

function clearBookshelf(bookshelf) {
  while (bookshelf.firstChild) {
    bookshelf.removeChild(bookshelf.firstChild);
  }
}

function drawBookshelf(library) {
  if (library) {
    clearBookshelf(bookshelf);
    console.log(library);
    for (let i=0; i < library.length; i++) {
      //the indexes (id) of books will change with every book added and deleted, to correspond correctly with the index of the list (myLibrary)
      let book = document.createElement("article");
      book.insertAdjacentHTML("afterbegin", `
      <p class='title'>${library[i].title}</p>
      <p class='author'>By: ${library[i].author}</p>
      <p class='pages'>No. of pages: ${library[i].pages}</p>
      <p class='hasread'>Read?: ${library[i].hasread}</p>
      <button id="delete-${i}" class="delete" type="button">Delete</button>
      <button id="read-${i}" class="read" type="button">Read</button>
      `);
      bookshelf.appendChild(book);
    }
  }
}


//Saving to Local Storage
