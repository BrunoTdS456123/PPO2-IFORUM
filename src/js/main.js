

// Lógica para criar uma nova postagem
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    //const authorEmail = parseInt(email.value);

    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content}),
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

let isPostLiked = [];
// Lógica para curtir uma postagem
async function likePost(postId) {
    if (isPostLiked[postId] == null || isPostLiked[postId]== undefined){
        isPostLiked[postId] = false; // Inicializa o estado de curtida da postagem
    }
    try {
        const response = await fetch(`/posts/${postId}/like`, {
            method: 'POST',
        });

        const result = await response.json();

        if (response.ok && !isPostLiked[postId]) {
            isPostLiked[postId] = true; // Marca a postagem como curtida
            const likeCountElement = document.getElementById(`like-count-${postId}`);
            likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1; // Atualiza o contador no frontend
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro ao curtir postagem:', error);
    }
}

// Atualizar a lógica de carregar postagens para incluir o botão de like
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
                <p>Likes: <span id="like-count-${post.id}">${post.like}</span></p>
                <button onclick="likePost(${post.id})">👍 Curtir</button>
            `;
            postsDiv.appendChild(postElement);
        });
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
    }
}

// Carrega as postagens ao carregar a página
loadPosts();