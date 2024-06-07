// Récupérer les éléments du DOM
const fileInput = document.getElementById('fileInput');
const viewer = document.getElementById('viewer');

// Fonction pour afficher une image en plein écran
function displayFullScreen(imageUrls) {
    const fullScreenDiv = document.createElement('div');
    fullScreenDiv.classList.add('fullscreen');

    imageUrls.forEach((url) => {
        const fullScreenImg = document.createElement('img');
        fullScreenImg.src = url;
        fullScreenDiv.appendChild(fullScreenImg);
    });

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => document.body.removeChild(fullScreenDiv));
    fullScreenDiv.appendChild(closeBtn);

    document.body.appendChild(fullScreenDiv);
}

// Fonction pour afficher la jaquette
function displayCover(imageUrl, imageUrls) {
    const coverDiv = document.createElement('div');
    coverDiv.classList.add('cover');

    const coverImg = document.createElement('img');
    coverImg.src = imageUrl;
    coverDiv.appendChild(coverImg);

    coverDiv.addEventListener('click', () => displayFullScreen(imageUrls));
    viewer.appendChild(coverDiv);
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
        if (imageUrls.length > 0) {
            displayCover(imageUrls[0], imageUrls);
        }
    }
});
