document.addEventListener('DOMContentLoaded', async () => {
    // Load the Google Sign-In API
    gapi.load('auth2', function() {
      // Initialize the Google Sign-In API with your Client ID
      gapi.auth2.init({
        client_id: '639123025996-oeer17ld2d7pu5ad0es99e1d6lmc3vh9.apps.googleusercontent.com',

      }).then(() => {
        // The Google Sign-In API has been initialized
        console.log('Google Sign-In API initialized');
      }).catch((error) => {
        console.error('Error initializing Google Sign-In API:', error);
      });
    });
  
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(uploadForm);
  
      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          alert('Image uploaded successfully.');
          // Instead of using a hardcoded Google ID, get it from the signed-in user
          const signedInUser = gapi.auth2.getAuthInstance().currentUser.get();
          const googleId = signedInUser.getId();
          displayImages(googleId);
        } else {
          alert('Image upload failed.');
        }
      } catch (error) {
        console.error(error);
        alert('Internal Server Error');
      }
    });
  
    // Instead of using a hardcoded Google ID, get it from the signed-in user
    const signedInUser = gapi.auth2.getAuthInstance().currentUser.get();
    const googleId = signedInUser.getId();
    displayImages(googleId);
  });
  
  async function displayImages(userId) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
  
    try {
      const response = await fetch(`/images/${userId}`);
      const images = await response.json();
  
      images.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = `/${image.path}`;
        imgElement.alt = image.filename;
        imgElement.classList.add('img-thumbnail', 'm-2');
        gallery.appendChild(imgElement);
      });
    } catch (error) {
      console.error(error);
      alert('Failed to fetch images.');
    }
  }
  