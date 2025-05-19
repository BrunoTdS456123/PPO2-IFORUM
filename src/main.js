// Lógica para criar uma nova postagem
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const authorId = parseInt(document.getElementById('authorId').value);

    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, authorId }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            loadPosts(); // Recarrega as postagens
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
    }
});

// Lógica para carregar as postagens
async function loadPosts() {
    try {
        const response = await fetch('/posts');
        const posts = await response.json();

        const postsDiv = document.getElementById('posts');
        postsDiv.innerHTML = '';

        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>Autor: ${post.author.nickname || 'Desconhecido'}</small>
            `;
            postsDiv.appendChild(postElement);
        });
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
    }
}

// Carrega as postagens ao carregar a página
loadPosts();