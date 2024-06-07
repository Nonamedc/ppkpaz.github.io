// Récupérer les éléments du DOM
const fileInput = document.getElementById('fileInput');
const imageContainer = document.getElementById('imageContainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentImageIndex = 0;
let images = [];

// Fonction pour afficher l'image actuelle
function displayImage() {
    const imageUrl = images[currentImageIndex];
    imageContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageUrl;
    imageContainer.appendChild(img);
}

// Fonction pour afficher l'image suivante
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    displayImage();
}

// Fonction pour afficher l'image précédente
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    displayImage();
}

// Écouter les changements dans l'input de fichier
fileInput.addEventListener('change', function(event) {
    const files = event.target.files;
    images = [];
    currentImageIndex = 0;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            images.push(e.target.result);
            if (images.length === files.length) {
                displayImage();
            }
        };
        reader.readAsDataURL(file);
    }
});

// Écouter les clics sur les boutons "Précédent" et "Suivant"
prevButton.addEventListener('click', prevImage);
nextButton.addEventListener('click', nextImage);
