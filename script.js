document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        const fileType = file.type;
        
        if (fileType === 'application/epub+zip') {
            displayEPUB(content);
        } else if (isImage(fileType)) {
            displayImage(content);
        } else if (isArchive(fileType)) {
            displayArchive(content);
        } else {
            console.log('Format de fichier non pris en charge');
        }
    };

    reader.readAsArrayBuffer(file);
});

document.getElementById('add-book-btn').addEventListener('click', function() {
    // Ouvrir la boîte de dialogue de sélection de fichiers lorsqu'on clique sur le bouton "Ajouter un livre"
    document.getElementById('file-input').click();
});

function isImage(mimeType) {
    return mimeType.startsWith('image/');
}

function isArchive(mimeType) {
    return mimeType === 'application/zip' || mimeType === 'application/x-rar-compressed';
}

function displayImage(content) {
    const blob = new Blob([content], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);

    const bookCover = document.getElementById('book-cover');
    bookCover.innerHTML = `<img src="${imageUrl}" alt="Book Cover" />`;

    // Réinitialiser l'index de la page
    currentPageIndex = 0;
}

function displayArchive(content) {
    // Ici vous devez extraire le contenu de l'archive et afficher chaque image
    console.log('Affichage du contenu de l\'archive...');
}

function displayEPUB(content) {
    const viewer = document.getElementById('book-viewer');
    const book = ePub(content);
    bookData = book;
    displayPage(currentPageIndex);

    // Affichage de la première page du livre
    function displayPage(index) {
        book.getBlobUrl(index, function(url) {
            viewer.innerHTML = `<iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>`;
        });
    }
}
