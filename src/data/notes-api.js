const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const NotesAPI = {
  async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();
      
      if (responseJson.status !== 'success') {
        return { error: true, data: [] };
      }
      
      return { error: false, data: responseJson.data };
    } catch (error) {
      console.error('Error fetching notes:', error);
      return { error: true, data: [] };
    }
  },
  
  async addNote(note) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      
      const responseJson = await response.json();
      
      if (responseJson.status !== 'success') {
        return { error: true };
      }
      
      return { error: false };
    } catch (error) {
      console.error('Error adding note:', error);
      return { error: true };
    }
  },
  
  async deleteNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      
      const responseJson = await response.json();
      
      if (responseJson.status !== 'success') {
        return { error: true };
      }
      
      return { error: false };
    } catch (error) {
      console.error('Error deleting note:', error);
      return { error: true };
    }
  }
};

export default NotesAPI;