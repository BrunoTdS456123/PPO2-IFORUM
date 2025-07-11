window.addEventListener("DOMContentLoaded", function() {
  document.getElementById('registerForm').addEventListener("submit", async function(e) {
    e.preventDefault(); // before the code
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, nickname, password })
      });
  
      const data =  response.json();
  
      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        // Redirecionar para login, se quiser:
        window.location.href = '../index.html';
      } else {
        alert(data.error || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    }

    console.log('hi');
  })
});

  