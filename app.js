document.addEventListener("DOMContentLoaded", ()=>{

 const savedKey =
 localStorage.getItem("gemini_api_key");

 if(savedKey){
  document.getElementById(
   "api-key-input"
  ).value=savedKey;
 }

 const btn=
 document.getElementById("btn-generate");

 btn.addEventListener(
  "click",
  generateApp
 );

});

async function generateApp(){

 const apiKey=
 document.getElementById(
  "api-key-input"
 ).value.trim();

 const userInput=
 document.getElementById(
  "user-input"
 ).value.trim();

 const errorBox=
 document.getElementById(
  "error-box"
 );

 errorBox.innerText="";

 if(!apiKey){
  errorBox.innerText=
  "Coloque sua API";
  return;
 }

 if(!userInput){
  errorBox.innerText=
  "Digite sua ideia";
  return;
 }

 localStorage.setItem(
  "gemini_api_key",
  apiKey
 );

 const prompt = `
Você é um Engenheiro de Software Sênior, Arquiteto Full Stack, Especialista em UX/UI, Front-end, Back-end, Performance, Segurança, Acessibilidade e Inteligência Artificial.

Sua missão é criar um aplicativo COMPLETO, moderno, profissional e totalmente funcional utilizando APENAS um único arquivo HTML.

O usuário quer:

${userInput}

REGRAS OBRIGATÓRIAS:

• Responda SOMENTE código HTML completo.
• Nunca explique nada.
• Nunca escreva texto antes ou depois do código.
• Nunca utilize Markdown.
• Nunca utilize \`\`\`html.
• Comece obrigatoriamente com <!DOCTYPE html>.
• Termine obrigatoriamente com </html>.

O HTML deve conter obrigatoriamente:

✔ HTML5 completo
✔ CSS dentro de <style>
✔ JavaScript dentro de <script>

Todo o aplicativo deve estar em um único arquivo HTML.

O aplicativo deve parecer um software comercial Premium.

Sempre utilizar:

• Design moderno.
• Interface Premium.
• Glassmorphism quando fizer sentido.
• Neomorphism quando apropriado.
• Bordas suaves.
• Sombras modernas.
• Gradientes profissionais.
• Layout elegante.
• Responsividade completa.
• Mobile First.
• Desktop otimizado.
• Tablet otimizado.
• Grid moderno.
• Flexbox.
• Tipografia Premium.
• Ícones SVG.
• Componentes reutilizáveis.
• Código organizado.

Toda interface deve possuir QUALIDADE PREMIUM.

Sempre entregar:

• Títulos em alta qualidade.
• Textos extremamente legíveis.
• Botões modernos.
• Cards Premium.
• Menus profissionais.
• Barras de navegação elegantes.
• Painéis modernos.
• Formulários profissionais.
• Inputs modernos.
• Tabelas elegantes.
• Dashboards profissionais.
• Modais modernos.
• Toasts elegantes.
• Loaders profissionais.
• Skeleton Loading.
• Feedback visual.
• Estados de carregamento.
• Barras de progresso.
• Indicadores visuais.

Sempre que fizer sentido adicionar:

• Tema Claro.
• Tema Escuro.
• Alternância entre temas.
• localStorage.
• Persistência de configurações.
• Histórico.
• Pesquisa.
• Filtros.
• Ordenação.
• Exportação.
• Importação.
• Impressão.
• Compartilhamento.
• Atalhos de teclado.

Qualidade Visual:

• Imagens em alta qualidade (HD ou superior) quando necessário.
• Ícones vetoriais SVG.
• Excelente tipografia.
• Excelente contraste.
• Excelente espaçamento.
• Excelente alinhamento.
• Excelente experiência do usuário.

Qualidade das animações:

• Fluidas.
• Suaves.
• Naturais.
• Elegantes.
• Profissionais.
• Leves.
• Otimizadas.
• Sem travamentos.
• Compatíveis com desktop e mobile.

Qualidade do áudio (quando existir):

• Alta qualidade.
• Sons limpos.
• Volume equilibrado.
• Controles de reprodução.
• Nunca reproduzir automaticamente sem necessidade.

JavaScript:

• Modular.
• Organizado.
• Escalável.
• Fácil manutenção.
• Sem erros.
• Sem warnings.
• Sem código morto.
• Sem duplicação.
• Sem bibliotecas externas.
• Sem frameworks.
• Código reutilizável.
• Funções organizadas.
• Tratamento de erros.
• Validação completa.
• Eventos bem estruturados.

CSS:

• Limpo.
• Organizado.
• Responsivo.
• Variáveis CSS.
• Código reutilizável.
• Performance otimizada.
• Sem CSS repetido.

Sempre priorizar:

1. Qualidade.
2. Performance.
3. Compatibilidade.
4. Segurança.
5. UX.
6. UI.
7. Organização.
8. Escalabilidade.
9. Manutenção.
10. Acessibilidade.

Sempre otimizar:

• Velocidade.
• Renderização.
• Responsividade.
• SEO básico.
• Acessibilidade.
• Performance.
• Compatibilidade entre navegadores.

Evitar:

• Código repetido.
• Código morto.
• Variáveis inúteis.
• CSS redundante.
• Loops desnecessários.
• Erros no console.
• Layout quebrado.
• Componentes desalinhados.
• Interfaces simples demais.

Sempre utilizar boas práticas modernas de desenvolvimento.

Quando necessário utilizar:

• SVG.
• Canvas.
• CSS moderno.
• Recursos públicos confiáveis.
• Assets gratuitos de alta qualidade.
• Fontes profissionais.
• Ícones vetoriais.

Sempre entregar um aplicativo completo, funcional, bonito, organizado, otimizado e pronto para produção.

Nunca remover funcionalidades importantes.

Nunca entregar código incompleto.

Nunca utilizar placeholders desnecessários.

Sempre implementar todas as funcionalidades solicitadas pelo usuário.

O resultado final deve parecer um aplicativo profissional publicado na App Store, Google Play ou utilizado por grandes empresas, com acabamento visual de altíssimo nível, excelente experiência do usuário, desempenho otimizado e qualidade premium em todos os elementos.

Responda SOMENTE o HTML completo.
`;

 document.getElementById(
  "output-prompt"
 ).value=prompt;

 switchTab("prompt");

 const btn=
 document.getElementById(
  "btn-generate"
 );

 btn.disabled=true;
 btn.innerText="Gerando...";

 try{

  const url=
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response=
  await fetch(url,{
   method:"POST",

   headers:{
    "Content-Type":
    "application/json"
   },

   body:JSON.stringify({

    contents:[
      {
       parts:[
         {
          text:prompt
         }
       ]
      }
    ]

   })

  });

  if(!response.ok){

   const erro=
   await response.json();

   throw new Error(
    erro.error.message
   );

  }

  const data=
  await response.json();

  if(
   !data.candidates
  ){
   throw new Error(
    "Gemini não respondeu"
   );
  }

  let code=
  data.candidates[0]
  .content.parts[0].text;

  code=
  code
  .replace(/```html/gi,"")
  .replace(/```/gi,"")
  .trim();

  document.getElementById(
   "output-code"
  ).value=code;

  const iframe=
  document.getElementById(
   "app-preview"
  );

  iframe.srcdoc=code;

  switchTab("code");

 }

 catch(error){

  errorBox.innerText=
  error.message;

 }

 finally{

  btn.disabled=false;

  btn.innerText=
  "GERAR APP";

 }

}

function switchTab(tab){

 const promptBtn=
 document.getElementById(
 "tab-btn-prompt"
 );

 const codeBtn=
 document.getElementById(
 "tab-btn-code"
 );

 const prompt=
 document.getElementById(
 "tab-content-prompt"
 );

 const code=
 document.getElementById(
 "tab-content-code"
 );

 if(tab==="prompt"){

  promptBtn.classList.add(
   "active"
  );

  codeBtn.classList.remove(
   "active"
  );

  prompt.style.display=
  "block";

  code.style.display=
  "none";

 }else{

  codeBtn.classList.add(
   "active"
  );

  promptBtn.classList.remove(
   "active"
  );

  code.style.display=
  "block";

  prompt.style.display=
  "none";

 }

}

function changeDevice(device){

 const sim=
 document.getElementById(
 "device-simulator"
 );

 sim.className="";

 if(device==="mobile"){
  sim.classList.add(
   "device-mobile"
  );
 }

 if(device==="tablet"){
  sim.classList.add(
   "device-tablet"
  );
 }

 if(device==="desktop"){
  sim.classList.add(
   "device-desktop"
  );
 }

}

function toggleFullscreen(){

 const sim=
 document.getElementById(
 "device-simulator"
 );

 if(!document.fullscreenElement){

   sim.requestFullscreen();

 }else{

   document.exitFullscreen();

 }

}
