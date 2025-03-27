// Custom Element 1: App Bar
class AppBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <style>
          .app-bar {
            background-color:rgb(228, 224, 11);
            padding: 16px;
            color: black;
            margin-bottom: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          h1 {
            margin: 0;
            font-size: 24px;
          }
        </style>
        <div class="app-bar">
          <h1>Notes App</h1>
        </div>
      `;
    }
  }
  customElements.define("app-bar", AppBar);
  
  // Custom Element 2: Note Input
  class NoteInput extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <style>
          .note-input {
            background-color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          input, textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          textarea {
            height: 100px;
            resize: vertical;
          }
          button {
            background-color:rgb(0, 0, 0);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: rgb(228, 224, 17);
          }
          button:disabled {
            background-color: #b0bec5;
            cursor: not-allowed;
          }
          .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-left: 8px;
            vertical-align: middle;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <div class="note-input">
          <input type="text" id="title" placeholder="Judul catatan">
          <textarea id="body" placeholder="Isi catatan"></textarea>
          <button id="submit">Tambah Catatan</button>
          <span id="submitLoader" class="loading" style="display:none;"></span>
        </div>
      `;
  
      this.shadowRoot
        .querySelector("#submit")
        .addEventListener("click", this.handleSubmit.bind(this));
    }
  
    async handleSubmit() {
      const title = this.shadowRoot.querySelector("#title").value;
      const body = this.shadowRoot.querySelector("#body").value;
  
      if (title && body) {
        const newNote = {
          title,
          body,
        };
  
        const submitBtn = this.shadowRoot.querySelector("#submit");
        const loader = this.shadowRoot.querySelector("#submitLoader");
        
        // Tampilkan loading indicator
        submitBtn.disabled = true;
        loader.style.display = "inline-block";
        
        try {
          await fetch("https://notes-api.dicoding.dev/v2/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newNote),
          });
  
          this.shadowRoot.querySelector("#title").value = "";
          this.shadowRoot.querySelector("#body").value = "";
          
          // Dispatch event untuk refresh notes
          document.dispatchEvent(new CustomEvent('notes-changed'));
        } catch (error) {
          console.error("Gagal menambahkan catatan:", error);
          alert("Gagal menambahkan catatan. Silakan coba lagi.");
        } finally {
          // Sembunyikan loading indicator
          submitBtn.disabled = false;
          loader.style.display = "none";
        }
      } else {
        alert("Judul dan isi catatan tidak boleh kosong!");
      }
    }
  }
  customElements.define("note-input", NoteInput);
  
  // Custom Element 3: Note Item
  class NoteItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    set note(note) {
      this._note = note;
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .note-item {
            background-color: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
          }
          .note-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.15);
          }
          h3 {
            margin-top: 0;
            color: #333;
          }
          p {
            color: #666;
          }
          .date {
            font-size: 12px;
            color: #888;
            margin-bottom: 12px;
          }
          button {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #d32f2f;
          }
          button:disabled {
            background-color: #ffcdd2;
            cursor: not-allowed;
          }
          .loading {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-left: 4px;
            vertical-align: middle;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <div class="note-item">
          <h3>${this._note.title}</h3>
          <p>${this._note.body}</p>
          <p class="date">${new Date(this._note.createdAt).toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <button id="delete">Hapus</button>
          <span id="deleteLoader" class="loading" style="display:none;"></span>
        </div>
      `;
  
      this.shadowRoot.querySelector("#delete").addEventListener("click", async () => {
        const deleteBtn = this.shadowRoot.querySelector("#delete");
        const loader = this.shadowRoot.querySelector("#deleteLoader");
        
        // Tampilkan loading indicator
        deleteBtn.disabled = true;
        loader.style.display = "inline-block";
        
        try {
          await fetch(`https://notes-api.dicoding.dev/v2/notes/${this._note.id}`, {
            method: "DELETE",
          });
          // Dispatch event untuk refresh notes
          document.dispatchEvent(new CustomEvent('notes-changed'));
        } catch (error) {
          console.error("Gagal menghapus catatan:", error);
          alert("Gagal menghapus catatan. Silakan coba lagi.");
          
          // Sembunyikan loading indicator dalam kasus error
          deleteBtn.disabled = false;
          loader.style.display = "none";
        }
      });
    }
  }
  customElements.define("note-item", NoteItem);
  
  // Custom Element 4: Loading Indicator
  class LoadingIndicator extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render(show = false) {
      this.shadowRoot.innerHTML = `
        <style>
          .loading-container {
            display: ${show ? 'flex' : 'none'};
            justify-content: center;
            padding: 20px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(33, 150, 243, 0.3);
            border-radius: 50%;
            border-top-color: #2196f3;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      `;
    }
  
    show() {
      this.render(true);
    }
  
    hide() {
      this.render(false);
    }
  }
  customElements.define("loading-indicator", LoadingIndicator);
  
  export { AppBar, NoteInput, NoteItem, LoadingIndicator };