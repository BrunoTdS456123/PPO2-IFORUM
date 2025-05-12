const form = document.getElementById('registerForm')

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = document.getElementById('email').value
  const name = document.getElementById('name').value
  const nickname = document.getElementById('nickname').value
  const password = document.getElementById('password').value

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, nickname, password }),
    })

    const data = await response.json()
    if (response.ok) {
      alert(data.message)
    } else {
      alert(`Erro: ${data.error}`)
    }
  } catch (error) {
    alert('Erro ao conectar ao servidor.')
  }
})