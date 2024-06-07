// Fonction pour scanner un dossier et charger toutes les images
async function scanAndLoadFolder() {
  try {
    const dirHandle = await window.showDirectoryPicker();
    const imageFiles = [];
    const imageFileNames = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.match(/\.(jpg|jpeg|png)$/i)) {
        imageFileNames.push(entry.name);
        imageFiles.push(URL.createObjectURL(await entry.getFile()));
      }
    }
    // Trie les noms de fichiers pour conserver le même ordre que les images
    const sortedImageFiles = imageFileNames.map(name => {
      const index = imageFileNames.indexOf(name);
      return imageFiles[index];
    });
    if (sortedImageFiles.length > 0) {
      displayImages(sortedImageFiles);
    } else {
      alert('Aucune image trouvée dans le dossier.');
    }
  } catch (error) {
    console.error('Erreur lors du scan du dossier :', error);
  }
}

// Charger le fichier lorsque l'utilisateur le sélectionne
document.getElementById('fileInput').addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if (file) {
    const imageFiles = [];
    if (/\.(cbr|cbz|zip|rar)$/i.test(file.name)) {
      const zip = new JSZip();
      await zip.loadAsync(file);
      await Promise.all(Object.values(zip.files).map(async zipEntry => {
        if (!zipEntry.dir && /\.(jpg|jpeg|png)$/i.test(zipEntry.name)) {
          const blob = await zipEntry.async('blob');
          imageFiles.push(URL.createObjectURL(blob));
        }
      }));
    } else if (/\.(jpg|jpeg)$/i.test(file.name)) {
      imageFiles.push(URL.createObjectURL(file));
    }
    if (imageFiles.length > 0) {
      displayImages(imageFiles);
    } else {
      alert('Format de fichier non pris en charge.');
    }
  }
});

// Fonction pour afficher les images
function displayImages(imageUrls) {
  const viewer = document.getElementById('viewer');
  viewer.innerHTML = '';
  const pageCount = Math.ceil(imageUrls.length / 2);
  for (let i = 0; i < pageCount; i++) {
    const pageDiv = document.createElement('div');
    pageDiv.classList.add('page');
    const pageImage1 = document.createElement('img');
    pageImage1.src = imageUrls[i * 2];
    pageDiv.appendChild(pageImage1);
    if (i * 2 + 1 < imageUrls.length) {
      const pageImage2 = document.createElement('img');
      pageImage2.src = imageUrls[i * 2 + 1];
      pageDiv.appendChild(pageImage2);
    }
    viewer.appendChild(pageDiv);
  }
}
