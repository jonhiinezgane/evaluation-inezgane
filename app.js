const departments=["كتابة الضبط","التنفيذ المدني","التنفيذ الزجري","التبليغ","الأرشيف","الصندوق","الشعبة المدنية","الشعبة الزجرية"];
const quality=[["1","😡","غير راضٍ جدًا"],["2","🙁","غير راضٍ"],["3","😐","متوسط"],["4","🙂","راضٍ"],["5","😍","راضٍ جدًا"]];
const criteria=["حسن الاستقبال","وضوح المعلومات","سرعة معالجة الطلب","جودة الخدمة"];
const speeds=["سريعة جدًا","سريعة","مقبولة","طويلة","طويلة جدًا"], resolved=["نعم","جزئيًا","لا"];
const state={department:"",quality:"",speed:"",resolved:""};
function buttons(id,arr,key,emoji=false){document.getElementById(id).innerHTML=arr.map(x=>{let v=Array.isArray(x)?x[0]:x;let label=Array.isArray(x)?(emoji?`<span>${x[1]}</span><small>${x[2]}</small>`:x[2]):x;return `<button type="button" data-value="${v}">${label}</button>`}).join("");document.querySelectorAll("#"+id+" button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#"+id+" button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state[key]=b.dataset.value})}
buttons("departments",departments,"department");buttons("quality",quality,"quality",true);buttons("speed",speeds,"speed");buttons("resolved",resolved,"resolved");
document.getElementById("criteria").innerHTML=criteria.map((x,i)=>`<div class="rating-row"><label>${x}</label><select data-criterion="${i}"><option value="">اختر</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>`).join("");
async function submitResponse(row){
 if(!window.supabaseClient) throw new Error("لم يتم إعداد Supabase بعد.");
 const {error}=await window.supabaseClient.from("survey_responses").insert(row); if(error) throw error;
}
document.getElementById("survey").onsubmit=async e=>{e.preventDefault();const scores=[...document.querySelectorAll("[data-criterion]")].map(x=>x.value);if(!state.department||!state.quality||!state.speed||!state.resolved||scores.some(x=>!x)){alert("يرجى استكمال جميع عناصر التقييم.");return}
 const row={department:state.department,quality:Number(state.quality),reception:Number(scores[0]),information:Number(scores[1]),processing_speed:Number(scores[2]),service_quality:Number(scores[3]),response_time:state.speed,resolved:state.resolved,comment:document.getElementById("comment").value.trim()};
 const btn=document.querySelector(".submit");btn.disabled=true;btn.textContent="جارٍ الإرسال...";
 try{await submitResponse(row);document.getElementById("survey").classList.add("hidden");document.querySelector(".hero").classList.add("hidden");document.getElementById("success").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}catch(err){alert("تعذر إرسال التقييم. تأكد من إعداد قاعدة البيانات والاتصال بالإنترنت.");console.error(err)}finally{btn.disabled=false;btn.textContent="إرسال التقييم ✓"}};
