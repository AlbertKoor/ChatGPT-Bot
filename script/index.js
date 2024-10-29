const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    // Mensagem vazia
    if (message === '') {
        return;
    }
    
    appendMessage('user', message);
    userInput.value = ''; // Limpar entrada

    // Lidar com entrada específica do usuário
    if (message === 'desenvolvedor') {
        setTimeout(() => {
            appendMessage('bot', 'Esse código foi programado por Albert');
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        }, 2000);
        return; // Sair para evitar o envio da requisição
    }

    // Preparar dados para a chamada da API
    const data = JSON.stringify({
        messages: [
            {
                role: 'user',
                content: message
            }
        ],
        model: 'gpt-4-turbo', // Verifique se o modelo está correto
        max_tokens: 100,
        temperature: 0.9
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            if (this.status === 200) {
                const response = JSON.parse(this.responseText);
                // Acessar a resposta correta dependendo da estrutura da API
                const botMessage = response.choices[0].message.content; // Verifique a estrutura exata
                appendMessage('bot', botMessage);
            } else {
                console.error('Erro na API:', this.status, this.statusText);
            }
        }
    });

    xhr.open('POST', 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions');
    xhr.setRequestHeader('x-rapidapi-key', 'ce022ab3e0mshd5f6946007327d6p1a538djsn9e38de7cb944');
    xhr.setRequestHeader('x-rapidapi-host', 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
}

function appendMessage(sender, message) {
    info.style.display = "none";
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Corrigir a rolagem para o fundo
}
