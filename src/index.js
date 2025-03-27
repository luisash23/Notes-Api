import './styles/style.css';
import { AppBar, NoteInput, NoteItem, LoadingIndicator } from './components/app-components';
import NotesAPI from './data/notes-api';

// Initialize the app
const app = {
  init() {
    this.mainLoader = document.getElementById('mainLoader');
    this.notesContainer = document.getElementById('notesContainer');
    
    // Render initial notes
    this.renderNotes();
    
    // Setup event listener for notes changes
    document.addEventListener('notes-changed', () => {
      this.renderNotes();
    });
  },
  
  async renderNotes() {
    // Show loading
    this.mainLoader.show();
    this.notesContainer.innerHTML = '';
    
    try {
      const { error, data } = await NotesAPI.getAllNotes();
      
      if (error) {
        this.notesContainer.innerHTML = '<p>Gagal memuat data. Silakan coba lagi.</p>';
        return;
      }
      
      if (data.length === 0) {
        this.notesContainer.innerHTML = '<p>Tidak ada catatan. Silakan tambahkan catatan baru.</p>';
        return;
      }
      
      // Render each note
      data.forEach(note => {
        const noteElement = document.createElement('note-item');
        noteElement.note = note;
        this.notesContainer.appendChild(noteElement);
      });
    } catch (error) {
      console.error('Error rendering notes:', error);
      this.notesContainer.innerHTML = '<p>Terjadi kesalahan. Silakan muat ulang halaman.</p>';
    } finally {
      // Hide loading
      this.mainLoader.hide();
    }
  }
};

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});