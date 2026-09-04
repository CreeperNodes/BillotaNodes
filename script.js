
const $=(s,p=document)=>p.querySelector(s); const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const toast=$('#toast');
const showToast=(m)=>{if(!toast)return;toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2300)};
$('#year') && ($('#year').textContent=new Date().getFullYear());

// Basic public website interactions
$('.menu-toggle')?.addEventListener('click',()=>$('.navbar')?.classList.toggle('menu-open'));
$('.offer-close')?.addEventListener('click',()=>$('.offer-bar').style.display='none');
$('[data-copy]')?.addEventListener('click',async e=>{const code=e.currentTarget.dataset.copy;try{await navigator.clipboard.writeText(code);showToast(code+' copied!')}catch{showToast('Code: '+code)}});
$$('.faq-item button').forEach(b=>b.addEventListener('click',()=>b.closest('.faq-item').classList.toggle('open')));
const faqItems=$$('.faq-item');$$('.faq-filter').forEach(f=>f.addEventListener('click',()=>{$$('.faq-filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');const c=f.dataset.filter;faqItems.forEach(i=>i.style.display=(c==='all'||i.dataset.category===c)?'':'none')}));
$('#faqSearch')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();faqItems.forEach(i=>i.style.display=i.textContent.toLowerCase().includes(q)?'':'none')});
$('#pingButton')?.addEventListener('click',async e=>{e.currentTarget.disabled=true;e.currentTarget.textContent='Testing...';await new Promise(r=>setTimeout(r,700));const r={Mumbai:[18,42],Singapore:[45,78],Frankfurt:[110,180],Dubai:[55,100]};$$('[data-ping]').forEach(x=>{const[a,b]=r[x.dataset.ping];x.textContent=Math.floor(Math.random()*(b-a+1)+a)+' ms'});e.currentTarget.disabled=false;e.currentTarget.textContent='Test Again ⚡'});
$('#dismissOffer')?.addEventListener('click',()=>$('.cta-section').style.display='none');
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>$('.navbar')?.classList.remove('menu-open')));

// Browser-only demo account state. Replace with a real backend before production.
const getUser=()=>{try{return JSON.parse(localStorage.getItem('creepernodes_user'))}catch{return null}};
const setUser=u=>localStorage.setItem('creepernodes_user',JSON.stringify(u));
const auth=$('#authModal'); let pendingAction=null; let selectedPlan=null;
const openAuth=(action)=>{pendingAction=action;auth?.classList.add('open');auth?.setAttribute('aria-hidden','false');setTimeout(()=>$('#signInEmail')?.focus(),50)};
const closeAuth=()=>{auth?.classList.remove('open');auth?.setAttribute('aria-hidden','true')};
$$('[data-auth-close]').forEach(b=>b.addEventListener('click',closeAuth));
$$('.auth-tab').forEach(t=>t.addEventListener('click',()=>{const sign=t.dataset.authTab==='signin';$$('.auth-tab').forEach(x=>x.classList.toggle('active',x===t));$('#signInForm')?.classList.toggle('active',sign);$('#signUpForm')?.classList.toggle('active',!sign);$('#authTitle').textContent=sign?'Sign in to continue':'Create your account'}));
const validEmail=e=>/^\S+@\S+\.\S+$/.test(e);
$('#signInForm')?.addEventListener('submit',e=>{e.preventDefault();const email=$('#signInEmail').value.trim(),pass=$('#signInPassword').value;if(!validEmail(email)||!pass)return showToast('Enter a valid email and password.');setUser({email,name:email.split('@')[0]});afterAuth()});
$('#signUpForm')?.addEventListener('submit',e=>{e.preventDefault();const name=$('#signUpName').value.trim(),email=$('#signUpEmail').value.trim(),pass=$('#signUpPassword').value;if(!name||!validEmail(email)||pass.length<6)return showToast('Use your name, valid email and a password of at least 6 characters.');setUser({name,email});afterAuth()});

function afterAuth(){const action=pendingAction;pendingAction=null;closeAuth();if(action==='checkout')openCheckout();else openClient();}
$$('.auth-required').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();if(getUser())openClient();else openAuth('client')}));

// Learn more
const about=$('#aboutModal');$('#learnMoreBtn')?.addEventListener('click',()=>{about.classList.add('open');about.setAttribute('aria-hidden','false')});$$('[data-close-about]').forEach(b=>b.addEventListener('click',()=>about?.classList.remove('open')));

// Plans and checkout
$$('.plan-select').forEach(btn=>btn.addEventListener('click',()=>{selectedPlan={name:btn.dataset.plan,price:Number(btn.dataset.price),ram:btn.dataset.ram,cpu:btn.dataset.cpu,disk:btn.dataset.disk};getUser()?openCheckout():openAuth('checkout')}));
const checkout=$('#checkoutModal');
function openCheckout(){if(!selectedPlan){selectedPlan={name:'Iron',price:99,ram:'4 GB',cpu:'2 vCPU',disk:'30 GB NVMe'}};const p=selectedPlan;$('#checkoutPlan').innerHTML=`<h3>${p.name} Plan <span style="float:right;color:#85f6b0">₹${p.price}/mo</span></h3><div class="plan-specs"><span>${p.ram} RAM</span><span>${p.cpu}</span><span>${p.disk}</span><span>DDoS Protection</span></div>`;$('#orderSummary').innerHTML=`<div class="summary-row"><span>${p.name} server</span><b>₹${p.price}</b></div><div class="summary-row"><span>Billing cycle</span><b>Monthly</b></div><div class="summary-row"><span>Provisioning</span><b>After verification</b></div>`;$('#upiAmount').textContent='₹'+p.price;$('#summaryTotal').textContent='₹'+p.price;checkout.classList.add('open');checkout.setAttribute('aria-hidden','false')}
$$('[data-close-checkout]').forEach(b=>b.addEventListener('click',()=>checkout?.classList.remove('open')));
$$('.checkout-method').forEach(b=>b.addEventListener('click',()=>{$$('.checkout-methods .active')?.classList.remove('active');b.classList.add('active');const upi=b.dataset.method==='upi';$('#upiPayment').classList.toggle('active',upi);$('#paypalPayment').classList.toggle('active',!upi)}));
$('#submitPaymentProof')?.addEventListener('click',()=>{const ref=$('#paymentReference').value.trim();if(!ref)return showToast('Enter your UPI transaction reference after payment.');const orders=JSON.parse(localStorage.getItem('creepernodes_orders')||'[]');orders.unshift({id:'CN-'+Date.now().toString().slice(-6),plan:selectedPlan?.name||'Plan',amount:selectedPlan?.price||0,status:'Awaiting verification',reference:ref,created:new Date().toLocaleString()});localStorage.setItem('creepernodes_orders',JSON.stringify(orders));checkout.classList.remove('open');showToast('Payment reference submitted for verification.');openClient('orders')});
$('#paypalInfoBtn')?.addEventListener('click',()=>showToast('Connect your real PayPal checkout before accepting PayPal payments.'));

// Separate client dashboard
const client=$('#clientAreaView');
function demoServers(){return [{id:'srv-1',name:'My Minecraft Server',address:'your-server.example:25565',plan:'Iron',status:'Online',cpu:'2.7%',ram:'2.84 GiB / 4 GiB',disk:'1.07 GiB / 30 GiB',cpuBar:27,ramBar:71,diskBar:4,expires:'15 Sep 2026'}]}
function renderUser(){const u=getUser()||{name:'Client',email:'client@example.com'};$('#clientUserName').textContent=u.name||u.email.split('@')[0];$('#clientUserEmail').textContent=u.email;$('#clientUserInitial').textContent=(u.name||u.email||'CN').slice(0,2).toUpperCase()}
function getOrders(){try{return JSON.parse(localStorage.getItem('creepernodes_orders')||'[]')}catch{return[]}}
function renderDashboard(){const servers=demoServers(),orders=getOrders();$('#activeServerCount').textContent=servers.length;$('#expiringCount').textContent=servers.filter(s=>s.expires).length;$('#openOrderCount').textContent=orders.filter(o=>o.status==='Awaiting verification').length;$('#dashboardServerCards').innerHTML=servers.map(s=>`<article class="server-card" data-open-server="${s.id}"><div class="server-card-top"><div><h3>${s.name}</h3><p class="server-address">${s.address}</p></div><span class="status-pill">● ${s.status}</span></div><div class="server-mini-stats"><div><span>CPU</span><b>${s.cpu}</b></div><div><span>RAM</span><b>${s.ram.split(' / ')[0]}</b></div><div><span>Disk</span><b>${s.disk.split(' / ')[0]}</b></div></div><p class="server-expiry">⚠ Expires: ${s.expires}</p></article>`).join('');$('#serversList').innerHTML=servers.map(s=>`<article class="server-list-item"><div><h3>${s.name}</h3><p>${s.address} · ${s.plan} Plan · Expires ${s.expires}</p></div><button class="button primary open-server" data-open-server="${s.id}">Manage →</button></article>`).join('');$('#ordersList').innerHTML=orders.length?orders.map(o=>`<article class="order-row"><div><h3>${o.id} · ${o.plan}</h3><small>${o.created} · Ref: ${o.reference}</small></div><div><b>₹${o.amount}</b><span class="order-status">${o.status}</span></div></article>`).join(''):'<div class="billing-card"><h3>No orders yet</h3><p>Choose a plan from the website to start an order.</p></div>';$('#billingExpiry').textContent=servers[0]?`${servers[0].name} expires on ${servers[0].expires}.`: 'No active expiry information yet.';$$('[data-open-server]').forEach(b=>b.addEventListener('click',()=>openServer(b.dataset.openServer)))}
function showClientPage(name){$$('.client-page').forEach(p=>p.classList.toggle('active',p.dataset.clientPage===name));$$('.client-nav').forEach(n=>n.classList.toggle('active',n.dataset.clientView===name));}
function openClient(page='overview'){renderUser();renderDashboard();document.body.style.overflow='hidden';client.classList.add('open');client.setAttribute('aria-hidden','false');showClientPage(page)}
function closeClient(){client.classList.remove('open');client.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function openServer(id){const s=demoServers().find(x=>x.id===id);if(!s)return;showClientPage('server-detail');$('#serverDetailContent').innerHTML=`<div class="server-detail-head"><div><p class="client-kicker">${s.plan.toUpperCase()} SERVER</p><h1>${s.name}</h1><p>${s.address} · <span style="color:#85f6b0">● ${s.status}</span> · Expires ${s.expires}</p></div><button class="button ghost">Server actions ▾</button></div><div class="server-resource-grid"><article class="resource-card"><span>CPU Load</span><strong>${s.cpu}</strong><small>of allocated CPU</small><div class="resource-bar"><i style="width:${s.cpuBar}%"></i></div></article><article class="resource-card"><span>Memory</span><strong>${s.ram}</strong><small>allocated memory</small><div class="resource-bar"><i style="width:${s.ramBar}%"></i></div></article><article class="resource-card"><span>Disk</span><strong>${s.disk}</strong><small>NVMe storage</small><div class="resource-bar"><i style="width:${s.diskBar}%"></i></div></article><article class="resource-card"><span>Expiry</span><strong>${s.expires}</strong><small>renew before expiry</small><div class="resource-bar"><i style="width:62%"></i></div></article></div><div class="server-detail-grid"><article class="server-console"><h3>Server Console</h3><div class="console-box"><span class="ok">[INFO]</span> Starting Minecraft server...<br><span class="ok">[INFO]</span> Loading world: survival<br><span class="ok">[INFO]</span> Done! Server ready in 1.82s<br><br><span class="ok">● ONLINE</span> 0/20 players<br><span class="warn">[NOTICE]</span> This frontend demo does not control a real server yet.</div></article><div class="server-side-stack"><article><h3>Connection</h3><div class="detail-list"><div><span>Address</span><b>${s.address}</b></div><div><span>Status</span><b>${s.status}</b></div><div><span>Plan</span><b>${s.plan}</b></div></div></article><article><h3>Server expiry</h3><div class="detail-list"><div><span>Expiry date</span><b>${s.expires}</b></div><div><span>Action</span><b>Renew from Billing</b></div></div></article></div></div>`}
$$('.client-nav').forEach(b=>b.addEventListener('click',()=>{if(b.id==='clientSignOut')return;showClientPage(b.dataset.clientView)}));
$$('.client-nav-link').forEach(b=>b.addEventListener('click',()=>showClientPage(b.dataset.target)));
$('#backToServers')?.addEventListener('click',()=>showClientPage('servers'));
$('#exitClient')?.addEventListener('click',closeClient);
$('#clientSignOut')?.addEventListener('click',()=>{localStorage.removeItem('creepernodes_user');closeClient();showToast('Signed out.');});
$('#browsePlansBtn')?.addEventListener('click',()=>{closeClient();document.querySelector('#plans')?.scrollIntoView({behavior:'smooth'})});
$('#buyFromServers')?.addEventListener('click',()=>{closeClient();document.querySelector('#plans')?.scrollIntoView({behavior:'smooth'})});
$('#renewServerBtn')?.addEventListener('click',()=>{selectedPlan={name:'Iron Renewal',price:99,ram:'4 GB',cpu:'2 vCPU',disk:'30 GB NVMe'};openCheckout()});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAuth();about?.classList.remove('open');checkout?.classList.remove('open')}});
