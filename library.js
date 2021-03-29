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


let myLibrary = loadLocalStorage();

//makes sure each newly generated book has event listener attached.
bookshelf.addEventListener("click", function(e) {
  let library = lib(myLibrary);

  let id = e.target.id;
  //delete button
  if (e.target && ID.name(id) == "delete" ) {
    library.remove(ID.index(id));
    
  } 
  //read button
  else if (e.target && ID.name(id) == "read" ) {
    library.read(ID.index(id));
  }
  saveLocalStorage();
  drawBookshelf(myLibrary);
})

//Event listener to add book to library
submit.addEventListener("click", function () {
  //there will be new values every time, hence need to be set in this func
  //lib needs to be given new copy of myLibrary each time.
  let library = lib(myLibrary);

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let hasread = (document.getElementById("has-read").checked)? "yes" : "no";

  //checks if form variables are blank (if not, create new book)
  if (![title, author, pages].includes("") && pages > 0) {
    let latestBook = new Book(title, author, pages, hasread);
    library.add(latestBook);
    form.reset();
    form.close();
    saveLocalStorage();
  }
  drawBookshelf(myLibrary);
})

//Methods (ID/Library/Bookshelf)

//module to parse id (html id format = "name-index")
const ID = (() => {
  const name = (string) => string.split("-")[0];
  const index = (string) => string.split("-")[1];
  return {name, index};
})();

//Modify books in library
const lib = library => {
  const remove = (index) => library.splice(index, 1);
  const add = (book) => library.push(book);
  const read = (index) => {library[index].read();};
  return {remove, add, read}
}

//Drawing functions
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

//Will auto save if you: create a book, delete a book or read a book.
function saveLocalStorage(lib = myLibrary) {
  localStorage.setItem("library", JSON.stringify(lib));
}

function loadLocalStorage() {
  //when page first loaded, check if local storage exists. if not, create local storage, and populate with default values.
  let library = [];

  if (localStorage.getItem("library")) {
    let db = JSON.parse(localStorage.getItem("library"));
    for (let i=0; i < db.length; i++) {
      library.push(new Book(db[i]["title"], db[i]["author"], db[i]["pages"], db[i]["hasread"]));
    }
  } else {
    //will run when website first initialized, to setup localstorage, or if library is reset (local storage as a whole will be deleted)
    library = default_library;
    saveLocalStorage(library);
  }
  return library;
}

//Form Event listeners

document.getElementById("open-form").addEventListener("click", function(){
  form.open();
})

document.getElementById("mask").addEventListener("click", function() {
  form.close();
})

document.getElementById("reset-db").addEventListener("click", function() {
  myLibrary = [];
  localStorage.clear();
  drawBookshelf(myLibrary);
})

//Form methods
const form = (() => {
  const toggle = (type) => {
    document.getElementById("form").style.display = type;
    document.getElementById("mask").style.display = type;
  }
  const open = () => toggle("block");
  const close = () => toggle("none");

  const reset = () => {
    let input_defaults = ["title", "author", "pages"];
    for (let i=0; i < input_defaults.length; i++) {
      document.getElementById(input_defaults[i]).value = "";
    }
    document.getElementById("has-read").checked = false;
  };
  return {open, close, reset};
})(); 

//Draw bookshelf upon initial loading of page

drawBookshelf(myLibrary);


