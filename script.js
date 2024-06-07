// Récupérer les éléments du DOM
const fileInput = document.getElementById('fileInput');
const viewer = document.getElementById('viewer');

// Fonction pour afficher une image en plein écran
function displayFullScreen(imageUrl) {
    const fullScreenDiv = document.createElement('div');
    fullScreenDiv.classList.add('fullscreen');
    const fullScreenImg = document.createElement('img');
    fullScreenImg.src = imageUrl;
    fullScreenDiv.appendChild(fullScreenImg);
    document.body.appendChild(fullScreenDiv);

    // Ajouter un événement pour fermer l'image en plein écran au clic
    fullScreenDiv.addEventListener('click', () => {
        document.body.removeChild(fullScreenDiv);
    });
}

// Fonction pour afficher les images
function displayImages(imageUrls) {
    viewer.innerHTML = '';
    imageUrls.forEach(imageUrl => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.addEventListener('click', () => displayFullScreen(imageUrl));
        const pageDiv = document.createElement('div');
        pageDiv.classList.add('page');
        pageDiv.appendChild(img);
        viewer.appendChild(pageDiv);
    });
}

// Fonction pour charger les fichiers à partir des archives
async function loadFilesFromArchive(file) {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(file);
    const imageFiles = [];

    // Parcourir tous les fichiers de l'archive
    zip.forEach((relativePath, zipEntry) => {
        // Vérifier si le fichier est une image
        if (!zipEntry.dir && /\.(jpg|jpeg|png)$/i.test(zipEntry.name)) {
            // Extraire le contenu de l'image
            const filePromise = zipFile.file(zipEntry.name).async('blob');
            imageFiles.push(filePromise);
        }
    });

    // Attendre que tous les fichiers soient extraits
    const blobs = await Promise.all(imageFiles);

    // Convertir les blobs en URL d'objet
    return blobs.map(blob => URL.createObjectURL(blob));
}

// Écouter les changements dans l'input de fichier
fileInput.addEventListener('change', async function(event) {
    const files = event.target.files;
    const images = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let imageUrls = [];
        if (/\.(cbr|cbz|zip|rar)$/i.test(file.name)) {
            // Charger les images à partir de l'archive
            imageUrls = await loadFilesFromArchive(file);
        } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
            // Charger une image individuelle
            imageUrls.push(URL.createObjectURL(file));
        }
        images.push(...imageUrls);
    }
    if (images.length > 0) {
        displayImages(images);
    }
});
