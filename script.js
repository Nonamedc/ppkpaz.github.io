// Fonction pour afficher le contenu du livre dans la boîte modale
function displayBookContent(book) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const bookContent = document.getElementById("book-content");

    modal.style.display = "block";
    modalTitle.textContent = book.title;
    bookContent.innerHTML = `<p>Contenu du livre "${book.title}"... (Remplacer par le contenu réel du livre)</p>`;
}

// Fonction pour fermer la boîte modale
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}
