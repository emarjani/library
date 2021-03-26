let myLibrary = [];

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

const default_library = [
  new Book("Crime and Punishment", "Fyodor Dostoevsky", 481, "yes"),
  new Book("1984", "George Orwell", 328, "yes"),
  new Book("War and Peace", "Leo Tolstoy", 1225, "no"),
  new Book("Pastoralia", "George Saunders", 208, "yes"),
  new Book("The Three Musketeers", "Alexandre Dumas", 539, "yes"),
  new Book("CivilWarLand In Bad Decline", "George Saunders", 192, "yes"),
  new Book("The Brothers Karamazov", "Fyodor Dostoevsky", 840, "no"),
  new Book("A Streetcar Named Desire", "Tennessee Williams", 111, "no"),
  new Book("Anna Karenina", "Leo Tolstoy", 864, "yes"),
  new Book("The Great Gatsby", "F. Scott Fitzgerald", 288, "no")
];

//makes sure each newly generated book has event listener attached.
bookshelf.addEventListener("click", function(e) {

  //delete button
  if (e.target && getButtonName(e.target.id) == "delete" ) {
    index = grabIndex(e.target.id);
    deleteBook(index);
  } 
  //read button
  else if (e.target && getButtonName(e.target.id) == "read" ) {
      index = grabIndex(e.target.id);
      readBook(index);
  }
  saveLocalStorage();
  drawBookshelf(myLibrary);
})

//Event listener to add book to library
submit.addEventListener("click", function () {
  //there will be new values every time, hence need to be set in this func
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let hasread = (document.getElementById("has-read").checked)? "yes" : "no";

  //checks if form variables are blank (if not, create new book)
  if (![title, author, pages].includes("") && pages > 0) {
    let latestBook = new Book(title, author, pages, hasread);
    addBook(latestBook);
    resetForm();
    closeForm();
    saveLocalStorage();
  }
  drawBookshelf(myLibrary);
})

//Methods (Book/Bookshelf)

function grabIndex(string) {
  return string.split("-")[1];
}

function getButtonName (string) {
  return string.split("-")[0];
}

function deleteBook(index) {
  myLibrary.splice(index, 1);  
}

function addBook(book) {
  myLibrary.push(book);
}

function readBook(index) {
  myLibrary[index].read();
}

function clearBookshelf(bookshelf) {
  bookshelf.innerHTML = "";
}

function drawBookshelf(library = myLibrary) {
  if (library) {
    clearBookshelf(bookshelf);
    for (let i=0; i < library.length; i++) {
      //the indexes (id) of books will change with every book added and deleted, to correspond correctly with the index of the list (myLibrary)
      let book = document.createElement("article");
      book.insertAdjacentHTML("afterbegin", `
      <a class='title' target='_blank' href='http://www.google.com/search?q=${library[i].title}+by+${library[i].author}+book'>${library[i].title}</a>
      <p class='author'>By: ${library[i].author}</p>
      <p class='pages'>No. of pages: ${library[i].pages}</p>
      <p class='hasread'>Read?: ${library[i].hasread}</p>

      <div class="buttons">
        <button id="delete-${i}" class="delete" type="button">X</button>
        <button id="read-${i}" class="read" type="button">Read</button>
      </div>
      `);
      bookshelf.appendChild(book);
    }
  }
}


//Saving to Local Storage

document.getElementById("reset-db").addEventListener("click", function() {
  localStorage.clear();
  myLibrary = [];
  drawBookshelf(myLibrary);
})


function saveLocalStorage() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

function loadLocalStorage() {
  let library = [];
  let db = JSON.parse(localStorage.getItem("library"));
  //recreate array of book objects from JSON string in localStorage
  if (db) {
    for (let i=0; i < db.length; i++) {
      library.push(new Book(db[i]["title"], db[i]["author"], db[i]["pages"], db[i]["hasread"]));
    }
  } else {
    library = default_library;
  }
  return library;
}

//Form

document.getElementById("open-form").addEventListener("click", function(){
  openForm();
})

document.getElementById("mask").addEventListener("click", function() {
  closeForm();
})

function resetForm() {
  let input_defaults = ["title", "author", "pages"];
  for (let i=0; i < input_defaults.length; i++) {
    document.getElementById(input_defaults[i]).value = "";
  }
  document.getElementById("has-read").checked = false;
}


function openForm() {
  document.getElementById("form").style.display = "block";
  document.getElementById("mask").style.display = "block";
}

function closeForm() {
  document.getElementById("form").style.display = "none";
  document.getElementById("mask").style.display = "none";
}


//setup and draw library when webpage is first loaded

myLibrary = loadLocalStorage();
drawBookshelf(myLibrary);


