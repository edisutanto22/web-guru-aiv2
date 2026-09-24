const $=id=>document.getElementById(id);
const defaultStudents=[
 {nis:"12001",nama:"Ahmad Fajar",kelas:"XII-A",jk:"L"},
 {nis:"12002",nama:"Budi Santoso",kelas:"XII-A",jk:"L"},
 {nis:"12003",nama:"Citra Lestari",kelas:"XII-B",jk:"P"},
 {nis:"12004",nama:"Dimas Pratama",kelas:"XII-B",jk:"L"},
 {nis:"12005",nama:"Eka Putri",kelas:"XII-B",jk:"P"}
];
let students=JSON.parse(localStorage.getItem("wga2_students"))||defaultStudents;
let attendance=JSON.parse(localStorage.getItem("wga2_attendance"))||{};
let scores=JSON.parse(localStorage.getItem("wga2_scores"))||[];
let profile=JSON.parse(localStorage.getItem("wga2_profile"))||{teacher:"",school:"",subject:""};

function save(){localStorage.setItem("wga2_students",JSON.stringify(students));localStorage.setItem("wga2_attendance",JSON.stringify(attendance));localStorage.setItem("wga2_scores",JSON.stringify(scores));localStorage.setItem("wga2_profile",JSON.stringify(profile))}
function dateKey(){return $("attendanceDate").value||new Date().toISOString().slice(0,10)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderStudents(filter=""){
 const q=filter.toLowerCase();
 const list=students.filter(s=>(s.nis+" "+s.nama+" "+s.kelas).toLowerCase().includes(q));
 $("studentCount").textContent=`${list.length} siswa`;
 $("studentTable").innerHTML=list.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.nis)}</td><td>${esc(s.nama)}</td><td>${esc(s.kelas)}</td><td>${esc(s.jk||"-")}</td><td><button class="delete" onclick="deleteStudent('${esc(s.nis)}')">Hapus</button></td></tr>`).join("")||`<tr><td colspan="6">Belum ada data.</td></tr>`;
 $("scoreStudent").innerHTML='<option value="">Pilih siswa</option>'+students.map(s=>`<option value="${esc(s.nis)}">${esc(s.nama)} — ${esc(s.kelas)}</option>`).join("");
}
function deleteStudent(nis){if(!confirm("Hapus data siswa ini beserta nilai terkait?"))return;students=students.filter(s=>s.nis!==nis);scores=scores.filter(x=>x.nis!==nis);Object.keys(attendance).forEach(d=>delete attendance[d][nis]);save();renderAll()}
function renderAttendance(){
 const key=dateKey(), day=attendance[key]||{}, c={Hadir:0,Izin:0,Sakit:0,Alpa:0};
 $("attendanceTable").innerHTML=students.map((s,i)=>{let st=day[s.nis]||"Hadir";c[st]++;return `<tr><td>${i+1}</td><td>${esc(s.nis)}</td><td>${esc(s.nama)}</td><td>${esc(s.kelas)}</td><td><select class="status-select" onchange="setAttendance('${esc(s.nis)}',this.value)">${["Hadir","Izin","Sakit","Alpa"].map(v=>`<option ${v===st?"selected":""}>${v}</option>`).join("")}</select></td></tr>`}).join("")||`<tr><td colspan="5">Tambahkan siswa terlebih dahulu.</td></tr>`;
 $("countHadir").textContent=c.Hadir;$("countIzin").textContent=c.Izin;$("countSakit").textContent=c.Sakit;$("countAlpa").textContent=c.Alpa;$("statHadir").textContent=c.Hadir;
}
function setAttendance(nis,status){const k=dateKey();attendance[k]=attendance[k]||{};attendance[k][nis]=status;save();renderAttendance();renderReports()}
function renderScores(){
 $("scoreTable").innerHTML=scores.map((x,i)=>{let s=students.find(v=>v.nis===x.nis);return `<tr><td>${i+1}</td><td>${esc(s?.nama||"Siswa dihapus")}</td><td>${esc(s?.kelas||"-")}</td><td>${esc(x.assessment)}</td><td><strong>${x.score}</strong></td><td><button class="delete" onclick="deleteScore(${i})">Hapus</button></td></tr>`}).join("")||`<tr><td colspan="6">Belum ada nilai.</td></tr>`;
 $("statNilai").textContent=scores.length;let avg=scores.length?Math.round(scores.reduce((a,b)=>a+Number(b.score),0)/scores.length):0;$("statRata").textContent=avg;
}
function deleteScore(i){scores.splice(i,1);save();renderScores();renderReports()}
function renderDashboard(){
 $("statSiswa").textContent=students.length;
 const byClass={};students.forEach(s=>byClass[s.kelas]=(byClass[s.kelas]||0)+1);
 $("classSummary").innerHTML=Object.entries(byClass).map(([k,v])=>`<div><span>${esc(k)}</span><b>${v} siswa</b></div>`).join("")||"<p>Belum ada data.</p>";
}
function renderReports(){
 $("reportStudents").innerHTML=`<p>Total siswa: <strong>${students.length}</strong></p>`+Object.entries(students.reduce((a,s)=>(a[s.kelas]=(a[s.kelas]||0)+1,a),{})).map(([k,v])=>`<p>${esc(k)}: ${v} siswa</p>`).join("");
 const avg=scores.length?(scores.reduce((a,b)=>a+Number(b.score),0)/scores.length).toFixed(1):0;$("reportScores").innerHTML=`<p>Jumlah nilai: <strong>${scores.length}</strong></p><p>Rata-rata: <strong>${avg}</strong></p>`;
 const d=attendance[dateKey()]||{},c={Hadir:0,Izin:0,Sakit:0,Alpa:0};Object.values(d).forEach(v=>c[v]++);$("reportAttendance").innerHTML=Object.entries(c).map(([k,v])=>`<p>${k}: <strong>${v}</strong></p>`).join("");
}
function renderProfile(){$("teacherName").value=profile.teacher||"";$("schoolName").value=profile.school||"";$("subjectName").value=profile.subject||""}
function renderAll(){renderStudents($("studentSearch").value);renderAttendance();renderScores();renderDashboard();renderReports();renderProfile()}
function openPage(p){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));$(p).classList.add("active");document.querySelector(`.nav-item[data-page="${p}"]`)?.classList.add("active");const t={dashboard:["Dashboard","Pusat administrasi guru digital"],siswa:["Data Siswa","Kelola peserta didik"],absensi:["Absensi","Catat kehadiran"],nilai:["Penilaian","Input dan rekap nilai"],ai:["AI Guru","Alat bantu pembelajaran"],laporan:["Laporan","Ringkasan administrasi"],pengaturan:["Pengaturan","Profil dan data aplikasi"]};$("pageTitle").textContent=t[p][0];$("pageSubtitle").textContent=t[p][1];$("sidebar").classList.remove("open")}
document.querySelectorAll("[data-page]").forEach(e=>e.addEventListener("click",()=>openPage(e.dataset.page)));
$("menuBtn").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("wga2_dark",document.body.classList.contains("dark"));});
if(localStorage.getItem("wga2_dark")==="true")document.body.classList.add("dark");
$("today").textContent=new Intl.DateTimeFormat("id-ID",{dateStyle:"full"}).format(new Date());
$("attendanceDate").value=new Date().toISOString().slice(0,10);
$("attendanceDate").addEventListener("change",()=>{renderAttendance();renderReports()});
$("studentSearch").addEventListener("input",e=>renderStudents(e.target.value));
$("studentForm").addEventListener("submit",e=>{e.preventDefault();let nis=$("nis").value.trim();if(students.some(s=>s.nis===nis)){alert("NIS sudah terdaftar.");return}students.push({nis,nama:$("nama").value.trim(),kelas:$("kelas").value.trim(),jk:$("jk").value.trim().toUpperCase()});save();e.target.reset();renderAll()});
$("scoreForm").addEventListener("submit",e=>{e.preventDefault();scores.push({nis:$("scoreStudent").value,assessment:$("assessment").value.trim(),score:Number($("score").value)});save();e.target.reset();renderScores();renderReports()});
function downloadCSV(name,rows){const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
$("exportStudents").addEventListener("click",()=>downloadCSV("data-siswa.csv",[["NIS","Nama","Kelas","L/P"],...students.map(s=>[s.nis,s.nama,s.kelas,s.jk])]));
$("exportScores").addEventListener("click",()=>downloadCSV("rekap-nilai.csv",[["NIS","Nama","Kelas","Penilaian","Nilai"],...scores.map(x=>{let s=students.find(v=>v.nis===x.nis)||{};return[x.nis,s.nama,s.kelas,x.assessment,x.score]})]));
$("saveProfile").addEventListener("click",()=>{profile={teacher:$("teacherName").value.trim(),school:$("schoolName").value.trim(),subject:$("subjectName").value.trim()};save();alert("Profil berhasil disimpan.")});
$("backupBtn").addEventListener("click",()=>{const data={version:"2.0",exportedAt:new Date().toISOString(),students,attendance,scores,profile};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="backup-web-guru-ai-v2.json";a.click()});
$("restoreFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);students=d.students||[];attendance=d.attendance||{};scores=d.scores||[];profile=d.profile||{};save();renderAll();alert("Backup berhasil dipulihkan.")}catch{alert("File backup tidak valid.")}};r.readAsText(f)});
$("resetBtn").addEventListener("click",()=>{if(!confirm("Hapus SEMUA data aplikasi?"))return;students=[];attendance={};scores=[];profile={teacher:"",school:"",subject:""};save();renderAll()});
function output(el,text){$(el).innerHTML=text}
$("generateQuestions").addEventListener("click",()=>{const t=esc($("qTopic").value||"Informatika"),n=Math.max(1,Math.min(20,Number($("qCount").value)||5)),type=$("qType").value;let out=[];for(let i=1;i<=n;i++)out.push(type==="pg"?`${i}. Manakah pernyataan yang paling tepat berkaitan dengan ${t}?<br>A. Konsep utama<br>B. Contoh penerapan<br>C. Dampak/manfaat<br>D. Tantangan<br>E. Semua jawaban benar`:`${i}. Jelaskan konsep utama ${t} dan berikan contoh penerapannya dalam kehidupan sehari-hari.`);output("questionOutput",out.join("<br><br>"))});
$("generateSummary").addEventListener("click",()=>{const t=esc($("mTopic").value||"materi pembelajaran");output("summaryOutput",`<strong>Rangkuman ${t}</strong><br><br>1. Pengertian dan latar belakang<br>2. Konsep atau karakteristik utama<br>3. Contoh penerapan<br>4. Manfaat dan tujuan<br>5. Tantangan/risiko<br>6. Kesimpulan dan refleksi`)});
$("generateTP").addEventListener("click",()=>{const t=esc($("tpTopic").value||"materi pembelajaran");output("tpOutput",`Peserta didik mampu menjelaskan konsep ${t}, mengidentifikasi unsur pentingnya, menganalisis contoh penerapan, dan menyajikan hasil pemahamannya secara logis.`)});
$("generateAct").addEventListener("click",()=>{const t=esc($("actTopic").value||"materi pembelajaran");output("actOutput",`• Apersepsi: tampilkan masalah nyata terkait ${t}.<br>• Eksplorasi: siswa mencari informasi dan mengidentifikasi konsep.<br>• Praktik: kelompok menyelesaikan studi kasus ${t}.<br>• Presentasi: kelompok memaparkan hasil.<br>• Refleksi: siswa menuliskan hal yang dipahami dan pertanyaan lanjutan.`)});
renderAll();
