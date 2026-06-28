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

 const prompt=`
 Você é um engenheiro especialista.

 Crie um aplicativo completo em HTML.

 Inclua CSS e JavaScript.

 O usuário quer:

 ${userInput}

 Responda SOMENTE código HTML completo.
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
