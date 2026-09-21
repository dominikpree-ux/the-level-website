const canvas=document.querySelector("#canvas");let selected=null;let elements=JSON.parse(localStorage.getItem("level-builder")||"[]");
const fields={content:document.querySelector("#content"),src:document.querySelector("#src"),color:document.querySelector("#color"),size:document.querySelector("#size")};
function make(type,data={}){return {id:crypto.randomUUID(),type,content:data.content||({heading:"Deine Überschrift",text:"Dein Text hier",button:"Mehr erfahren",image:"",section:"Neuer Bereich"}[type]||""),src:data.src||"",color:data.color||"#ff1493",size:data.size||28};}
function render(){canvas.innerHTML="";elements.forEach(e=>{let el=document.createElement("div");el.className="canvas-element"+(selected===e.id?" selected":"");el.draggable=true;el.dataset.id=e.id;
let child;if(e.type==="heading"){child=document.createElement("h2");child.textContent=e.content}else if(e.type==="text"){child=document.createElement("p");child.textContent=e.content}else if(e.type==="button"){child=document.createElement("button");child.textContent=e.content}else if(e.type==="image"){child=document.createElement("img");child.src=e.src||"assets/logo-white.png";child.alt=e.content||"Bild"}else{child=document.createElement("section");child.textContent=e.content}
child.style.color=e.color;child.style.fontSize=e.size+"px";el.append(child);el.onclick=()=>select(e.id);el.ondragstart=ev=>ev.dataTransfer.setData("move",e.id);el.ondragover=ev=>ev.preventDefault();el.ondrop=ev=>{ev.preventDefault();let id=ev.dataTransfer.getData("move");let from=elements.findIndex(x=>x.id===id),to=elements.findIndex(x=>x.id===e.id);if(from>=0&&to>=0){let [m]=elements.splice(from,1);elements.splice(to,0,m);render();}};canvas.append(el);});}
function select(id){selected=id;let e=elements.find(x=>x.id===id);document.querySelector("#emptyInspector").hidden=!!e;document.querySelector("#fields").hidden=!e;if(!e)return;fields.content.value=e.content;fields.src.value=e.src;fields.color.value=e.color;fields.size.value=e.size;}
Object.entries(fields).forEach(([k,input])=>input.addEventListener("input",()=>{let e=elements.find(x=>x.id===selected);if(!e)return;e[k]=k==="size"?Number(input.value):input.value;render();}));
document.querySelectorAll(".palette-item").forEach(item=>{item.ondragstart=e=>e.dataTransfer.setData("new",item.dataset.type);item.onclick=()=>add(item.dataset.type);});
canvas.ondragover=e=>e.preventDefault();canvas.ondrop=e=>{e.preventDefault();let type=e.dataTransfer.getData("new");if(type)add(type);};
function add(type){elements.push(make(type));selected=elements.at(-1).id;render();select(selected);}
document.querySelector("#deleteBtn").onclick=()=>{elements=elements.filter(e=>e.id!==selected);selected=null;render();select(null)};
document.querySelector("#saveBtn").onclick=()=>{localStorage.setItem("level-builder",JSON.stringify(elements));alert("Gespeichert in diesem Browser.");};
document.querySelector("#clearBtn").onclick=()=>{if(confirm("Arbeitsfläche leeren?")){elements=[];selected=null;render();}};
document.querySelector("#previewBtn").onclick=()=>window.open("index.html","_blank");
render();
/* Real website content editor */
const contentFields = document.querySelector("#contentFields");
const contentStatus = document.querySelector("#contentStatus");
let websiteContent = null;
async function initContentEditor() {
  if (!contentFields) return;
  try {
    const response = await fetch("content.json", { cache: "no-store" });
    websiteContent = await response.json();
    for (const lang of ["en", "de"]) {
      const group = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = lang.toUpperCase();
      group.appendChild(legend);
      Object.entries(websiteContent.translations[lang] || {}).forEach(([key, value]) => {
        const label = document.createElement("label");
        label.className = "content-field";
        label.textContent = key;
        const input = document.createElement("textarea");
        input.value = value;
        input.rows = 2;
        input.addEventListener("input", () => {
          websiteContent.translations[lang][key] = input.value;
          contentStatus.textContent = "Änderungen bereit zum Export.";
        });
        label.appendChild(input);
        group.appendChild(label);
      });
      contentFields.appendChild(group);
    }
  } catch (error) {
    contentStatus.textContent = "content.json konnte nicht geladen werden.";
  }
}
document.querySelector("#exportContentBtn")?.addEventListener("click", () => {
  if (!websiteContent) return;
  const blob = new Blob([JSON.stringify(websiteContent, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "content.json"; link.click();
  URL.revokeObjectURL(url);
  contentStatus.textContent = "Export erstellt. Lade die Datei in GitHub hoch.";
});
initContentEditor();
