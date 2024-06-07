// Fonction pour afficher le contenu du livre dans la boîte modale
function displayBookContent(book) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const bookContent = document.getElementById("book-content");

    modal.style.display = "block";
    modalTitle.textContent = book.title;

    // Vérifier le format du livre et extraire son contenu si nécessaire
    if (book.format === "ZIP" || book.format === "CBZ" || book.format === "CBR" || book.format === "RAR") {
        // Charger le fichier et extraire son contenu
        fetch(book.file)
            .then(response => response.blob())
            .then(blob => {
                extractZip(blob, function(content) {
                    bookContent.innerHTML = content;
                });
            });
    } else {
        bookContent.innerHTML = `<p>Contenu du livre "${book.title}"... (Remplacer par le contenu réel du livre)</p>`;
    }
}

// Fonction pour fermer la boîte modale
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Fonction pour extraire le contenu du fichier ZIP
function extractZip(file, callback) {
    JSZip.loadAsync(file)
        .then(function(zip) {
            // Récupérer les noms de tous les fichiers dans le ZIP
            const fileNames = Object.keys(zip.files);
            // Extraire le contenu du premier fichier trouvé
            zip.files[fileNames[0]].async("text").then(callback);
        });
}
