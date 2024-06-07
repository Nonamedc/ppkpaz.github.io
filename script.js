// Fonction pour afficher le contenu du livre dans la boîte modale
function displayBookContent(book) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    modal.style.display = "block";
    modalTitle.textContent = book.title;

    // Vérifier si le livre est une image
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = book.file.split('.').pop().toLowerCase();
    if (imageExtensions.includes(fileExtension)) {
        // Créer un élément image et lui attribuer la source du fichier
        const image = document.createElement("img");
        image.src = book.file;
        image.setAttribute("data-action", "zoom");

        // Ajouter l'image au contenu de la boîte modale
        modalContent.innerHTML = "";
        modalContent.appendChild(image);

        // Activer Viewer.js pour l'image
        const viewer = new Viewer(image);
    } else {
        // Si le livre n'est pas une image, afficher le contenu textuel (ou le contenu extrait du ZIP, etc.)
        modalContent.innerHTML = `<p>Contenu du livre "${book.title}"... (Remplacer par le contenu réel du livre)</p>`;
    }
}

// Fonction pour fermer la boîte modale
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Fonction pour ajouter un livre à la bibliothèque
function addBook(file) {
    // Traitement du fichier et ajout du livre à la bibliothèque
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    // Vérifier si le fichier est un livre pris en charge
    const supportedExtensions = ["pdf", "zip", "cbz", "cbr", "rar"];
    if (supportedExtensions.includes(fileExtension)) {
        // Ajoutez ici le code pour gérer le téléchargement et l'ajout du livre
        console.log("Livre ajouté :", fileName);
        // Vous pouvez ajouter le code pour stocker le fichier sur le serveur, etc.
    } else {
        console.log("Format de fichier non pris en charge :", fileName);
    }
}

// Gestionnaire d'événement pour le soumission du formulaire de téléchargement
document
