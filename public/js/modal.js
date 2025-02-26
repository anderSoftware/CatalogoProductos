
function openModal(productId) {
    const userLoggedIn = document.querySelector('.user-name') !== null;
    
    if (userLoggedIn) {
        downloadPdf(productId);
    } else {
        document.getElementById('productIdInput').value = productId;
        document.getElementById('emailModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('emailModal').style.display = 'none';
    document.getElementById('email').value = '';
}

function downloadPdf(productId) {
    window.location.href = `/download-pdf/${productId}`;
}

document.getElementById('emailModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const productId = document.getElementById('productIdInput').value;

    const data = {
        email: email,
        productId: productId
    };
    
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al enviar el correo');
        }
    })
    .then(data => {
        closeModal();
        downloadPdf(productId);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.');
    });
});