const KEY="dailyHabitTracker_v1";const MAX=30;
let habits=JSON.parse(localStorage.getItem(KEY)||"[]");
const list=document.getElementById("list"),empty=document.getElementById("empty"),form=document.getElementById("form"),input=document.getElementById("input"),percent=document.getElementById("percent"),summary=document.getElementById("summary"),bar=document.getElementById("bar"),message=document.getElementById("message");
function key(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function offset(n){let d=new Date();d.setDate(d.getDate()+n);return key(d)}
function done(h,k=key()){return Array.isArray(h.done)&&h.done.includes(k)}
function streak(h){let n=0,d=new Date();if(!done(h))d.setDate(d.getDate()-1);while(done(h,key(d))){n++;d.setDate(d.getDate()-1)}return n}
function esc(s){let d=document.createElement("div");d.textContent=s;return d.innerHTML}
function save(){localStorage.setItem(KEY,JSON.stringify(habits))}
function msg(t){message.textContent=t;clearTimeout(msg.t);msg.t=setTimeout(()=>message.textContent="",1600)}
function toggle(id){let h=habits.find(x=>x.id===id);if(!h)return;h.done=h.done||[];let k=key(),i=h.done.indexOf(k);if(i>=0){h.done.splice(i,1);msg("Unmarked for today.")}else{h.done.push(k);msg("Done. 🌱")}save();render()}
function remove(id){let h=habits.find(x=>x.id===id);if(h&&confirm(`Delete "${h.name}"?`)){habits=habits.filter(x=>x.id!==id);save();render()}}
function render(){
 list.innerHTML="";empty.style.display=habits.length?"none":"block";
 let total=habits.length,complete=habits.filter(h=>done(h)).length,pct=total?Math.round(complete/total*100):0;
 percent.textContent=pct+"%";summary.textContent=`${complete} of ${total} complete`;bar.style.width=pct+"%";
 habits.forEach(h=>{
  let card=document.createElement("article");card.className="habit";let today=done(h),days=[];
  for(let i=-6;i<=0;i++){let d=new Date();d.setDate(d.getDate()+i);let k=key(d),yes=done(h,k),lab=d.toLocaleDateString(undefined,{weekday:"narrow"});days.push(`<span class="day ${yes?"done":""}" title="${k}">${yes?"✓":lab}</span>`)}
  card.innerHTML=`<div class="main"><button type="button" class="check ${today?"done":""}" aria-label="${today?"Unmark":"Mark"} ${esc(h.name)} for today">${today?"✓":"○"}</button><div class="content"><div class="top"><div><h2 class="name">${esc(h.name)}</h2><p class="streak">🔥 ${streak(h)} day streak</p></div><button type="button" class="delete">Delete</button></div><div class="week">${days.join("")}</div></div></div>`;
  card.querySelector(".check").addEventListener("click",()=>toggle(h.id));card.querySelector(".delete").addEventListener("click",()=>remove(h.id));list.appendChild(card)
 })
}
form.addEventListener("submit",e=>{e.preventDefault();let name=input.value.trim();if(!name)return;if(habits.length>=MAX){msg(`Keep it focused: ${MAX} habits max.`);return}habits.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,done:[]});input.value="";save();render();input.focus();msg("Habit added. 🌱")});
render();
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
let deferredPrompt;
const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installButton) {
    installButton.style.display = "inline-flex";
  }
});

if (installButton) {
  installButton.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      installButton.style.display = "none";
    }

    deferredPrompt = null;
  });
}

window.addEventListener("appinstalled", () => {
  if (installButton) {
    installButton.style.display = "none";
  }
});
// PWA Install
let deferredPrompt;
const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = "block";
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    installButton.style.display = "none";
  }

  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  installButton.style.display = "none";
});
