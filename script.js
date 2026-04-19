const el = {
  input: {
    titleInput: document.querySelector('input[name="title"]'),
    authorInput: document.querySelector('input[name="author"]'),
    pageCountInput: document.querySelector('input[name="page-count"]'),
    genreInput: document.querySelector('input[name="genre"]'),
    isReadButton: document.getElementById("read"),
    readBtnForm: document.getElementById("read-checkbox"),
  },
  button: {
    addBtn: document.getElementById("add-btn"),
    addBookBtn: document.getElementById("add-book"),
    closeBtn: document.getElementById("close"),
    
  },
  bookCard: document.querySelector(".card-container"),
  form: document.getElementById("form"),
  dialog: document.querySelector(".container"),
  confirmDialog: document.querySelector(".close-confirm"),
}


let libraryArray = [];

function Book ({title = "", author= "", pageCount = "", genre = "", isRead = false} = {}) {
  if(!new.target) throw Error("Please make use of 'new' operator");
  this.title = title;
  this.author = author;
  this.pageCount = pageCount;
  this.genre = genre;
  this.isRead = isRead;
  this.uniqueID = crypto.randomUUID();


}



const addBookToLibrary = ({title, author, pageCount, genre, isRead}= {}) => {
  const newBook = new Book(getFormValues());
  libraryArray.push(newBook);
  displayBookCards();
}

const displayBookCards = () => {
  el.bookCard.innerHTML = libraryArray.map(({title, author, pageCount, genre, isRead, uniqueID}) => 
     `
    <div class="book-card" id="${uniqueID}">
      <h4>Title: ${title}</h4>
      <p>Author: ${author}</p>
      <p>Pages: ${pageCount}</p>
      <p>Genre: ${genre}</p>
      <button type="button" value="read">${isRead? "Marked As Read" : "Not Read Yet"}</button>
      <button type="button" value="remove">Remove Book</button>
    </div>
    `
  ).join("");
  el.bookCard.classList.remove("hidden");
}
const updateLibrary = (id) => {
  libraryArray =  libraryArray.filter(({uniqueID}) => uniqueID !== id);
  return libraryArray;

}
const updateReadButton = (e, id, bool) => {
  const targetBook = libraryArray.find(key => key.uniqueID === id);
  
  targetBook.isRead = bool;
  targetBook.isRead? e.target.classList.remove("btn-background-notRead"): e.target.classList.add("btn-background-notRead");
  displayBookCards();
}

const clearForm = () => {
  el.input.titleInput.value = "";
  el.input.authorInput.value = "";
  el.input.pageCountInput.value = "";
  el.input.genreInput.value = "";
}

const getFormValues = () => ({
  title : el.input.titleInput.value.trim(),
  author : el.input.authorInput.value.trim(),
  pageCount: el.input.pageCountInput.value.trim(),
  genre : el.input.genreInput.value.trim(),
  isRead : el.input.readBtnForm.checked,
});


el.button.addBtn.addEventListener("click", (e) => {
  if(!el.form.checkValidity()) return;
  if([...Object.values(getFormValues())].some(item => item === "")) {
    e.preventDefault();
    alert("Please fill out all required fields before submitting.");
    return;
  }
  e.preventDefault();
  
   
  addBookToLibrary();
  clearForm();
  el.dialog.close();
});

const renderConfirmDialog = e => {
  if (e.target.tagName === "BUTTON") {
   // el.confirmDialog.showModal();
    //const box = e.target.closest(".close-confirm");
     
    if(e.target.value === "save"){
      el.confirmDialog.close();
      el.dialog.close();
    }
    if(e.target.value === "discard"){
      clearForm();
      el.confirmDialog.close();
      el.dialog.close();
      //console.log("ggs");
    }
    if(e.target.value === "cancel"){
      el.confirmDialog.close();
      //el.dialog.close();
      //console.log("ZAZA");
    }
  } 
}

el.bookCard.addEventListener("click", (e) => {

  if(e.target.tagName === "BUTTON") {
    const card = e.target.closest(".book-card");
    if(e.target.value === "remove"){
      updateLibrary(card.id);
      card.classList.add("hidden");
      displayBookCards();
      el.bookCard.classList.add("hidden");
    }
    else if(e.target.value === "read"){
      if(e.target.textContent === "Marked As Read"){
        updateReadButton(e, card.id, false);
        
        //e.target.classList.add("btn-background-notRead");
        //console.log("ggs");
      }
      else{
        updateReadButton(e, card.id, true)
      //e.target.textContent = "Read"
      //e.target.classList.remove("btn-background-notRead");
      //console.log("haha");
      }
      displayBookCards();
    }
  }
});

el.button.addBookBtn.addEventListener("click", (e) => {
  el.dialog.showModal();
  e.stopPropagation();
  //stopPropforConfirmDialog()
})

document.addEventListener("click", () => {
  if(el.dialog.open) [...Object.values(getFormValues())].some(item => !!item)? el.confirmDialog.showModal() : el.dialog.close();
});

el.form.addEventListener("click", (e) => e.stopPropagation());

el.button.closeBtn.addEventListener("click", () => {
  [...Object.values(getFormValues())].some(item => !!item)? el.confirmDialog.showModal() : el.dialog.close();

});

el.confirmDialog.addEventListener("click", (e) => {
  e.stopPropagation();
  renderConfirmDialog(e);
});