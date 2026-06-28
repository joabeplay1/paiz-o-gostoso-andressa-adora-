// Monitora quando a página carrega para resgatar a chave salvada no navegador
document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
    }
});

document.getElementById('btn-generate').addEventListener('click', async () => {
    const geminiKey = document.getElementById('api-key-input').value.trim();
    const userInput = document.getElementById('user-input').value.trim();

    // Validações iniciais
    if (!geminiKey) {
        alert("Por favor, cole sua chave da API do Gemini no campo localizado no topo!");
        return;
    }
    if (!userInput) {
        alert("Descreva o aplicativo que você deseja criar antes de prosseguir.");
        return;
    }

    // Salva a chave no cache local para não ter que colar de novo na próxima vez
    localStorage.setItem('gemini_api_key', geminiKey);

    // Endereço oficial da API usando a arquitetura estável do Gemini 2.5 Flash
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

    // Etapa 1: Construção dinâmica do prompt estrutural
    const promptOtimizado = `Você é um engenheiro de software especialista. Crie um aplicativo web de arquivo único (HTML) completo, moderno, responsivo e totalmente funcional com base nesta requisição do usuário: "${userInput}". O retorno deve conter obrigatoriamente as tags <style> e <script> embutidas com todas as funcionalidades operacionais e interativas pedidas. Não envie textos explicativos, nem saudações, nem notas. Retorne única e estritamente o código limpo envolvido por blocos de código markdown \`\`\`html.`;
    
    // Alimenta o visor da aba de Prompt e muda o foco para ela
    document.getElementById('output-prompt').value = promptOtimizado;
    switchTab('prompt');

    // Altera temporariamente o estado do botão
    const btn = document.getElementById('btn-generate');
    const originalText = btn.innerText;
    btn.innerText = "Construindo Código... ⏳";
    btn.disabled = true;

    try {
        // Etapa 2: Requisição HTTP para a API do Gemini
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptOtimizado }] }]
            })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error?.message || "Falha na comunicação com a API.");
        }

        const data = await response.json();
        let codigoCru = data.candidates[0].content.parts[0].text;

        // Limpeza de blocos de formatação markdown que o Gemini retorna por padrão
        codigoCru = codigoCru.replace(/```html/gi, "").replace(/```/gi, "").trim();

        // Etapa 3: Entrega do código na aba correspondente
        document.getElementById('output-code').value = codigoCru;

        // Etapa 4: Injeção do código gerado no interpretador (iframe)
        const iframe = document.getElementById('app-preview');
        iframe.srcdoc = codigoCru;

        // Alterna automaticamente para visualização da aba de Código Fonte
        switchTab('code');

    } catch (erro) {
        console.error(erro);
        alert(`Erro de execução: ${erro.message}. Verifique sua conexão e se a chave de API é válida.`);
    } finally {
        // Restaura o estado normal do botão
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// Funções de Gerenciamento das Telas de Simulação
function changeDevice(device) {
    const simulator = document.getElementById('device-simulator');
    // Remove qualquer classe de dimensionamento prévia
    simulator.className = ''; 

    if (device === 'mobile') simulator.classList.add('device-mobile');
    if (device === 'tablet') simulator.classList.add('device-tablet');
    if (device === 'desktop') simulator.classList.add('device-desktop');
}

function toggleFullscreen() {
    const simulator = document.getElementById('device-simulator');
    
    // Verifica se já está em tela cheia para remover o botão extra de fechamento se houver
    const oldBtn = document.querySelector('.close-fs-btn');
    if (oldBtn) oldBtn.remove();

    simulator.classList.toggle('device-fullscreen');

    // Se entrou em tela cheia, adiciona um botão flutuante para conseguir sair dela facilmente
    if (simulator.classList.contains('device-fullscreen')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerText = "❌ Sair da Tela Cheia";
        closeBtn.className = 'close-fs-btn';
        closeBtn.onclick = () => {
            simulator.classList.remove('device-fullscreen');
            closeBtn.remove();
        };
        document.body.appendChild(closeBtn);
    }
}

// Funções de chaveamento das abas laterais (Prompt / Código)
function switchTab(tabAlvo) {
    const btnPrompt = document.getElementById('tab-btn-prompt');
    const btnCode = document.getElementById('tab-btn-code');
    const contentPrompt = document.getElementById('tab-content-prompt');
    const contentCode = document.getElementById('tab-content-code');

    if (tabAlvo === 'prompt') {
        btnPrompt.classList.add('active');
        btnCode.classList.remove('active');
        contentPrompt.style.display = 'block';
        contentCode.style.display = 'none';
    } else {
        btnCode.classList.add('active');
        btnPrompt.classList.remove('active');
        contentCode.style.display = 'block';
        contentPrompt.style.display = 'none';
    }
}
