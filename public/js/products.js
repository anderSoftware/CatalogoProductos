
document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('productId').value.trim();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stock', document.getElementById('stock').value);
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const url = id ? `/edit-products/${id}` : '/create-products';

    try {
        const response = await fetch(url, { 
            method: 'POST',
            body: formData 
        });
        
        if (!response.ok) throw new Error('Error en la operación');
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Hubo un error. Inténtalo de nuevo.');
    }
});

function editProduct(id, name, description, price, stock) {
    document.getElementById('productId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('description').value = description;
    document.getElementById('price').value = price;
    document.getElementById('stock').value = stock;
}

async function deleteProduct(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        try {
            const response = await fetch(`/delete-products/${id}`, { 
                method: 'PUT'
            });
            if (!response.ok) throw new Error('Error al eliminar el producto');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el producto.');
        }
    }
}

document.getElementById('clearForm').addEventListener('click', function() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = ''; 
});

function downloadPdf(productId) {
    window.location.href = `/download-pdf/${productId}`;
}