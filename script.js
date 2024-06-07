// Fonction pour détecter les gestes de glissement
function detectSwipe(el, callback) {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    el.addEventListener('touchstart', function(event) {
        touchstartX = event.touches[0].screenX;
        touchstartY = event.touches[0].screenY;
    }, false);

    el.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    function handleGesture() {
        if (touchendX < touchstartX) {
            callback('swipeleft');
        }
        if (touchendX > touchstartX) {
            callback('swiperight');
        }
        if (touchendY < touchstartY) {
            callback('swipeup');
        }
        if (touchendY > touchstartY) {
            callback('swipedown');
        }
    }
}

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
    const viewer = document.getElementById('viewer');
    viewer.innerHTML = '';
    const pageCount = Math.ceil(imageUrls.length / 2);
    for (let i = 0; i < pageCount; i++) {
        const pageDiv = document.createElement('div');
        pageDiv.classList.add('page');
        const pageImage1 = document.createElement('img');
        pageImage1.src = imageUrls[i * 2];
        pageImage1.addEventListener('click', () => displayFullScreen(imageUrls[i * 2]));
        pageDiv.appendChild(pageImage1);
        if (i * 2 + 1 < imageUrls.length) {
            const pageImage2 = document.createElement('img');
            pageImage2.src = imageUrls[i * 2 + 1];
            pageImage2.addEventListener('click', () => displayFullScreen(imageUrls[i * 2 + 1]));
            pageDiv.appendChild(pageImage2);
        }
        viewer.appendChild(pageDiv);
    }

    // Ajouter des événements de glissement pour la navigation entre les images
    detectSwipe(viewer, function(direction) {
        if (direction === 'swipeleft') {
            // Navigation vers la gauche (image précédente)
            console.log('Swipe left');
        } else if (direction === 'swiperight') {
            // Navigation vers la droite (image suivante)
            console.log('Swipe right');
        } else if (direction === 'swipeup') {
            // Navigation vers le haut (diaporama vertical)
            console.log('Swipe up');
        } else if (direction === 'swipedown') {
            // Navigation vers le bas (diaporama vertical)
            console.log('Swipe down');
        }
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
    images = [];
    currentImageIndex = 0;
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
        images = images.concat(imageUrls);
    }
    if (images.length > 0) {
        displayImages(images);
    }
});
