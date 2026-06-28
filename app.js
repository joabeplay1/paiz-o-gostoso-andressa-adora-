const GEMINI_API_KEY = "SUA_CHAVE_API_AQUI"; // Insira sua chave da Google AI Studio aqui
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

document.getElementById('btn-generate').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return alert("Por favor, descreva o app primeiro!");

    // Etapa 1: Criar o prompt otimizado (Melhoria automática)
    const promptAprimorado = `Crie um aplicativo web único (single file) baseado na seguinte descrição do usuário: "${userInput}". O retorno deve ser exclusivamente um código HTML completo e funcional com CSS (pode usar Tailwind via CDN se preferir) e JavaScript inclusos. Não escreva nenhuma explicação antes ou depois, apenas o código puro dentro de blocos de código HTML.`;
    document.getElementById('output-prompt').value = promptAprimorado;

    // Alterar para a aba do prompt para o usuário ver o processo
    switchTab('prompt');

    try {
        // Etapa 2: Chamar a API do Gemini 2.5 Flash
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptAprimorado }] }]
            })
        });

        const data = await response.json();
        let codigoGerado = data.candidates[0].content.parts[0].text;

        // Limpar as tags de marcação (```html ... ```) que o Gemini costuma enviar
        codigoGerado = codigoGerado.replace(/```html/g, "").replace(/```/g, "").trim();

        // Etapa 3: Exibir o código gerado na tela lateral
        document.getElementById('output-code').value = codigoGerado;

        // Etapa 4: Injetar o código gerado no Iframe de visualização
        const iframe = document.getElementById('app-preview');
        iframe.srcdoc = codigoGerado;

        // Trocar visualização para a aba de código automaticamente
        switchTab('code');

    } catch (error) {
        console.error("Erro ao gerar app:", error);
        alert("Ocorreu um erro ao conectar com o Gemini.");
    }
});

// Funções de controle de tela (Dispositivos)
function changeDevice(device) {
    const simulator = document.getElementById('device-simulator');
    simulator.className = ''; // Limpa as classes anteriores
    
    if (device === 'mobile') simulator.classList.add('device-mobile');
    if (device === 'tablet') simulator.classList.add('device-tablet');
    if (device === 'desktop') simulator.classList.add('device-desktop');
}

function toggleFullscreen() {
    const simulator = document.getElementById('device-simulator');
    simulator.classList.toggle('device-fullscreen');
}

// Alternar entre as abas de texto (Prompt / Código)
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('tab-content-prompt').style.display = 'none';
    document.getElementById('tab-content-code').style.display = 'none';

    if (tab === 'prompt') {
        document.getElementById('tab-content-prompt').style.display = 'block';
        tabs[0].classList.add('active');
    } else {
        document.getElementById('tab-content-code').style.display = 'block';
        tabs[1].classList.add('active');
    }
}
