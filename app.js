// CLOCK
setInterval(()=>{
  const now=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  document.getElementById('liveClock').textContent=now+' IST';
},1000);

// ALERTS DATA
const alerts=[
  {type:'critical',icon:'fa-wind',title:'Cyclone Alert — Bay of Bengal',desc:'IMD Red Warning: Landfall near Puri, Odisha in 6 hrs. Evacuation underway.',time:'2 mins ago',loc:'Odisha Coast'},
  {type:'warning',icon:'fa-water',title:'Flood Warning — Brahmaputra',desc:'Water level crossed danger mark at Dibrugarh. 12 villages on alert.',time:'18 mins ago',loc:'Assam'},
  {type:'info',icon:'fa-house-crack',title:'Earthquake M4.2 — Delhi NCR',desc:'Epicenter: 12km NE of Gurugram. No casualties reported.',time:'42 mins ago',loc:'Delhi NCR'},
  {type:'warning',icon:'fa-fire',title:'Forest Fire — Uttarakhand',desc:'Fire spread over 80 hectares near Nainital. IAF helicopter deployed.',time:'1 hr ago',loc:'Uttarakhand'},
  {type:'critical',icon:'fa-mountain',title:'Landslide blocks NH-44',desc:'Heavy rain triggers landslide at Ramban, J&K. Traffic diverted.',time:'2 hrs ago',loc:'Jammu & Kashmir'},
  {type:'info',icon:'fa-cloud-bolt',title:'Thunderstorm Alert — Maharashtra',desc:'IMD Yellow alert for Mumbai, Pune. Avoid open areas 3-7 PM.',time:'3 hrs ago',loc:'Maharashtra'},
];

function renderAlerts(list=alerts){
  const el=document.getElementById('alertList');
  el.innerHTML=list.map(a=>`
    <div class="alert-item">
      <div class="alert-icon ${a.type}"><i class="fa-solid ${a.icon}"></i></div>
      <div>
        <h4>${a.title}</h4>
        <p>${a.desc}</p>
        <div class="alert-meta"><span><i class="fa-solid fa-location-dot"></i> ${a.loc}</span><span><i class="fa-regular fa-clock"></i> ${a.time}</span></div>
      </div>
    </div>`).join('');
  document.getElementById('activeAlertsCount').textContent=list.length;
}
renderAlerts();
document.getElementById('refreshAlerts').onclick=()=>{
  alerts.unshift({type:['critical','warning','info'][Math.floor(Math.random()*3)],icon:'fa-triangle-exclamation',title:'New Alert — Auto Generated',desc:'Simulated live feed update for demo purpose.',time:'Just now',loc:'Live Feed'});
  renderAlerts(); toast('Feed refreshed — 1 new alert');
};

// MAP
const map=L.map('map').setView([22.5,79],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);

const points=[
  {lat:19.80,lng:85.82,type:'disaster',icon:'wind',color:'#8b5cf6',title:'Cyclone — Puri',desc:'Red warning, evacuation on'},
  {lat:27.47,lng:94.91,type:'disaster',icon:'water',color:'#0ea5e9',title:'Flood — Dibrugarh',desc:'Danger level crossed'},
  {lat:28.46,lng:77.02,type:'disaster',icon:'house-crack',color:'#f59e0b',title:'Quake M4.2 — Gurugram',desc:'Shallow earthquake'},
  {lat:29.38,lng:79.46,type:'disaster',icon:'fire',color:'#ef4444',title:'Fire — Nainital',desc:'Forest fire, IAF deployed'},
  {lat:33.24,lng:75.24,type:'disaster',icon:'mountain',color:'#78716c',title:'Landslide — Ramban',desc:'NH-44 blocked'},
  {lat:28.61,lng:77.23,type:'shelter',icon:'tent',color:'#22c55e',title:'Relief Camp — Delhi (Yamuna Bank)',desc:'Capacity 800 — Occupancy 62% — Food, water available'},
  {lat:22.57,lng:88.36,type:'shelter',icon:'tent',color:'#22c55e',title:'Shelter — Kolkata Salt Lake',desc:'Capacity 1200 — Occupancy 41%'},
  {lat:19.07,lng:72.87,type:'shelter',icon:'tent',color:'#22c55e',title:'Cyclone Shelter — Mumbai Worli',desc:'Capacity 600 — Open 24/7'},
  {lat:13.08,lng:80.27,type:'hospital',icon:'hospital',color:'#3b82f6',title:'GH — Chennai',desc:'Emergency beds: 12 available'},
  {lat:26.84,lng:80.94,type:'hospital',icon:'truck-medical',color:'#3b82f6',title:'Medical Camp — Lucknow',desc:'Doctors 8, Ambulances 4'},
];

let markers=[];
function addMarkers(filter='all'){
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  points.filter(p=>filter==='all'||p.type===filter).forEach(p=>{
    const html=`<div style="background:${p.color};width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"><i class="fa-solid fa-${p.icon}"></i></div>`;
    const icon=L.divIcon({html,className:'',iconSize:[34,34],iconAnchor:[17,17]});
    const m=L.marker([p.lat,p.lng],{icon}).addTo(map).bindPopup(`<strong>${p.title}</strong><br><span style="font-size:12px">${p.desc}</span>`);
    markers.push(m);
  });
}
addMarkers();
document.querySelectorAll('.filter-btn').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
    addMarkers(b.dataset.filter);
  };
});

// SHELTERS DATA
const shelters=[
  {name:'Yamuna Bank Relief Camp',city:'Delhi',address:'Near ITO Bridge, Delhi — 110002',capacity:800,occupied:496,contact:'011-23456789',status:'Available'},
  {name:'Salt Lake Stadium Shelter',city:'Kolkata',address:'Salt Lake, Sec V, Kolkata',capacity:1200,occupied:492,contact:'033-23456789',status:'Available'},
  {name:'Worli Cyclone Shelter',city:'Mumbai',address:'Worli Sea Face, Mumbai',capacity:600,occupied:210,contact:'022-23456789',status:'Available'},
  {name:'Guwahati Flood Shelter',city:'Guwahati',address:'Brahmaputra Embankment, Guwahati',capacity:500,occupied:480,contact:'0361-234567',status:'Almost Full'},
  {name:'Chennai Corporation Camp',city:'Chennai',address:'T Nagar, Chennai — 600017',capacity:750,occupied:320,contact:'044-23456789',status:'Available'},
  {name:'Patna High Ground Camp',city:'Patna',address:'Gandhi Maidan, Patna',capacity:1000,occupied:650,contact:'0612-234567',status:'Available'},
];
function renderShelters(list=shelters){
  document.getElementById('shelterGrid').innerHTML=list.map(s=>{
    const pct=Math.round(s.occupied/s.capacity*100);
    return `<div class="shelter-card">
      <h4><i class="fa-solid fa-tent" style="color:#22c55e"></i> ${s.name}</h4>
      <p><i class="fa-solid fa-location-dot"></i> ${s.address}</p>
      <div class="shelter-meta">
        <span class="badge-sm badge-green">${s.status}</span>
        <span class="badge-sm badge-blue">${s.city}</span>
        <span class="badge-sm badge-orange">${pct}% Occupied</span>
      </div>
      <div style="background:#e2e8f0;height:6px;border-radius:10px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct>85?'#ef4444':pct>60?'#f59e0b':'#22c55e'}"></div></div>
      <p style="margin-top:6px"><i class="fa-solid fa-people-group"></i> ${s.occupied} / ${s.capacity} &nbsp; <i class="fa-solid fa-phone"></i> ${s.contact}</p>
      <div class="shelter-actions"><button onclick="toast('Directions to ${s.name} opened')"><i class="fa-solid fa-diamond-turn-right"></i> Directions</button><button onclick="toast('Calling ${s.contact}...')"><i class="fa-solid fa-phone"></i> Call</button></div>
    </div>`;
  }).join('');
}
renderShelters();
document.getElementById('shelterSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  renderShelters(shelters.filter(s=>s.name.toLowerCase().includes(q)||s.city.toLowerCase().includes(q)));
});

// GPS
document.getElementById('gpsBtn').onclick=()=>{
  if(!navigator.geolocation) return toast('Geolocation not supported');
  toast('Fetching location...');
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude,longitude}=pos.coords;
    document.getElementById('locationInput').value=`${latitude.toFixed(5)}, ${longitude.toFixed(5)} (GPS)`;
    map.setView([latitude,longitude],13);
    L.marker([latitude,longitude]).addTo(map).bindPopup('Your location').openPopup();
    toast('Location captured');
  },()=>toast('Location permission denied'));
};

// FORM
let reportCount=parseInt(localStorage.getItem('rah_reports')||'0');
function loadMyReports(){
  const data=JSON.parse(localStorage.getItem('rah_myreports')||'[]');
  document.getElementById('myReports').innerHTML=data.length?data.map(r=>`<li><strong>${r.ticket}</strong> — ${r.type} at ${r.loc} <br><small>${r.time} • ${r.status}</small></li>`).join(''):'<li style="color:#94a3b8">No reports yet.</li>';
}
loadMyReports();

document.getElementById('rescueForm').onsubmit=e=>{
  e.preventDefault();
  const type=document.getElementById('disasterType').value;
  const loc=document.getElementById('locationInput').value;
  reportCount++; localStorage.setItem('rah_reports',reportCount);
  const ticket='#RH-'+String(4000+reportCount).padStart(4,'0');
  document.getElementById('ticketId').textContent=ticket;
  document.getElementById('reportSuccess').classList.remove('hidden');
  // save
  const arr=JSON.parse(localStorage.getItem('rah_myreports')||'[]');
  arr.unshift({ticket,type,loc,time:new Date().toLocaleString('en-IN'),status:'Dispatched — Team ETA 12 min'});
  localStorage.setItem('rah_myreports',JSON.stringify(arr));
  loadMyReports();
  toast('Rescue request '+ticket+' sent — Team notified');
  // increment rescued stat
  const el=document.getElementById('statRescued');
  el.textContent=(parseInt(el.textContent.replace(/,/g,''))+parseInt(document.getElementById('peopleCount').value||1)).toLocaleString('en-IN');
  e.target.reset();
};

// SOS MODAL
const sosModal=document.getElementById('sosModal');
document.getElementById('sosBtn').onclick=()=>sosModal.classList.remove('hidden');
document.getElementById('closeSos').onclick=()=>sosModal.classList.add('hidden');
document.getElementById('cancelSos').onclick=()=>sosModal.classList.add('hidden');
sosModal.onclick=e=>{if(e.target===sosModal)sosModal.classList.add('hidden')};
document.getElementById('confirmSos').onclick=()=>{
  sosModal.classList.add('hidden');
  toast('🆘 SOS SENT — Nearest NDRF team alerted! Stay on this page.');
  if(navigator.geolocation) navigator.geolocation.getCurrentPosition(()=>{},{});
};

// TOAST
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'),3000);
}
document.getElementById('notifBtn').onclick=()=>toast('3 unread alerts — check Live Alerts panel');
document.querySelector('.login-btn').onclick=()=>toast('Volunteer login — coming soon');
