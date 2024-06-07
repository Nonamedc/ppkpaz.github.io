// Fonction pour scanner un dossier et charger toutes les images
async function scanAndLoadFolder() {
  try {
    const dirHandle = await window.showDirectoryPicker();
    const imageFiles = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.match(/\.(jpg|jpeg|png)$/i)) {
        imageFiles.push(URL.createObjectURL(await entry.getFile()));
      }
    }
    if (imageFiles.length > 0) {
      displayImages(imageFiles);
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
  const osdDiv = document.createElement('div');
  osdDiv.id = 'osd-viewer';
  viewer.appendChild(osdDiv);
  const thumbsDiv = document.createElement('div');
  thumbsDiv.id = 'thumbs';
  viewer.appendChild(thumbsDiv);
  const osdViewer = OpenSeadragon({
    id: 'osd-viewer',
    tileSources: imageUrls[0],
    prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
    showNavigator: true,
    navigatorPosition: 'BOTTOM_RIGHT',
    navigatorSizeRatio: 0.15,
    gestureSettingsMouse: { scrollToZoom: true },
    gestureSettingsTouch: { scrollToZoom: true }
  });
  imageUrls.forEach(url => {
    const thumbImg = document.createElement('img');
    thumbImg.src = url;
    thumbImg.addEventListener('click', () => osdViewer.open(url));
    thumbsDiv.appendChild(thumbImg);
  });
}
