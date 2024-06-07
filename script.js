document.getElementById('add-book-btn').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

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

function isImage(mimeType) {
    return mimeType.startsWith('image/');
}

function isArchive(mimeType) {
    return mimeType === 'application/zip' || mimeType === 'application/x-rar-compressed';
}

function displayImage(content) {
    const viewer = document.getElementById('book-viewer');
    viewer.innerHTML = `<img src="${URL.createObjectURL(new Blob([content], { type: 'image/jpeg' }))}" alt="Book Cover" />`;
}

function displayArchive(content) {
    console.log('Affichage du contenu de l\'archive...');
}

function displayEPUB(content) {
    const viewer = document.getElementById('book-viewer');
    viewer.innerHTML = `<iframe src="${URL.createObjectURL(new Blob([content], { type: 'application/epub+zip' }))}" width="100%" height="100%" frameborder="0"></iframe>`;
}
