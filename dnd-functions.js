// ═══════════════════════════════════════════════════
// DONNÉES — Remplace par tes vraies données
// ═══════════════════════════════════════════════════
const DATA = {
  sessions:[
    {id:'s1',nom:"Session 4 — L'éveil du Temple du Feu",statut:'En cours',quetes:['q1','q2']},
    {id:'s2',nom:'Session 5 — Les Mines Goron',statut:'Non commencée',quetes:['q3']},
    {id:'s3',nom:'Session 6 — Le Retour à Kakariko',statut:'Non commencée',quetes:['q4','q5']}
  ],
  quetes:{
    q1:{id:'q1',nom:"L'éveil du Temple du Feu",type:'Principale',statut:'En cours',
      donneur:'Daruk, chef des Gorons',lieu:'Mont Couronnement — Temple du Feu',
      recompense:'200 rubis + Amulette du Feu',
      scenario:"Les héros infiltrent le Temple du Feu pour briser le sceau retenant un Goron prisonnier. Ils évitent les gardes Lizalfos et activent trois braseros sacrés dans l'ordre exact. Un Golem de lave monte la garde dans la salle centrale.",
      objectif:"Activer les trois braseros pour libérer l'accès à la salle du boss.",
      description:"Le temple s'est réveillé suite à la corruption du cristal de feu par Ganon. Sans intervention, le Mont Couronnement entrera en éruption d'ici trois lunes."},
    q2:{id:'q2',nom:'La pierre perdue de Darunia',type:'Secondaire',statut:'Non commencée',
      donneur:'Gorko le Vieux',lieu:'Mines inférieures Goron',
      recompense:'75 rubis + Potion de vigueur ×2',
      scenario:"Un vieil Goron a perdu une pierre ancestrale lors d'une avalanche. Elle est gardée par des Skulltulas géantes dans les galeries inférieures.",
      objectif:'Retrouver la Pierre de Darunia dans les mines inférieures.',
      description:"Objet sans valeur marchande mais d'une importance culturelle immense pour le clan."},
    q3:{id:'q3',nom:'Sauver les mineurs Goron',type:'Principale',statut:'En cours',
      donneur:'Biggoron',lieu:'Mines Goron — Niveau 3',
      recompense:'Épée Goron forgée sur mesure',
      scenario:"Trois mineurs sont piégés dans une section effondrée. Les héros empruntent les galeries est et neutralisent le Dodongo géant bloquant le passage principal.",
      objectif:'Neutraliser le Dodongo géant et ouvrir le passage effondré.',
      description:"L'effondrement n'est pas naturel — des traces d'explosifs ont été trouvées."},
    q4:{id:'q4',nom:'Le mystère du puits',type:'Secondaire',statut:'Non commencée',
      donneur:'Maire de Kakariko',lieu:'Village Kakariko — Vieux puits',
      recompense:'Lentille des vérités',
      scenario:"Des bruits étranges viennent du vieux puits depuis le réveil du Temple des Ombres. Les habitants sont terrifiés et n'osent plus s'en approcher la nuit.",
      objectif:'Investiguer le puits et identifier la source des perturbations.',
      description:"Le puits cache l'entrée d'un réseau Sheikah relié au Temple des Ombres."},
    q5:{id:'q5',nom:'Escorter la marchande',type:'Secondaire',statut:'Non commencée',
      donneur:'Impa',lieu:'Route Hyrule — Plaine',
      recompense:'100 rubis + Objet rare au choix',
      scenario:"Une marchande Sheikah doit rejoindre Castle Town mais la route est infestée de Stalfos. Elle transporte secrètement des documents pour la résistance.",
      objectif:"Escorter la marchande jusqu'à Castle Town sans incident.",
      description:"La marchande est en réalité une espionne. Les documents concernent les failles dans la défense de Ganon."}
  }
};

// ═══════════════════════════════════════════════════
// ÉTAT
// ═══════════════════════════════════════════════════
let mode='mj', sess=null, quest=null;
let comb=[], turn=0, round=1;
let notes={};

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
(function init(){
  const sel=document.getElementById('ssel');
  DATA.sessions.forEach(s=>{
    const o=document.createElement('option');
    o.value=s.id; o.textContent=s.nom+' — '+s.statut;
    sel.appendChild(o);
  });
})();

// ═══════════════════════════════════════════════════
// MODE
// ═══════════════════════════════════════════════════
function setMode(m){
  mode=m;
  document.getElementById('bmj').classList.toggle('active',m==='mj');
  document.getElementById('bpl').classList.toggle('active',m==='pl');
  document.getElementById('vmj').style.display=m==='mj'?'block':'none';
  document.getElementById('vpl').style.display=m==='pl'?'block':'none';
  if(m==='pl') renderPV();
}

// ═══════════════════════════════════════════════════
// SESSION
// ═══════════════════════════════════════════════════
function loadSess(){
  const v=document.getElementById('ssel').value;
  quest=null; comb=[]; turn=0; round=1;
  document.getElementById('qdetail').style.display='none';
  if(!v){document.getElementById('pq').style.display='none';return;}
  sess=DATA.sessions.find(s=>s.id===v);
  document.getElementById('pq').style.display='block';
  renderQ();
}

// ═══════════════════════════════════════════════════
// QUÊTES
// ═══════════════════════════════════════════════════
const SB={
  'En cours':'bb','Non commencée':'bk','Terminée':'bg','Échouée':'br',
  'Principale':'bo','Secondaire':'ba','Autres':'bk'
};
function renderQ(){
  const qs=sess.quetes.map(id=>DATA.quetes[id]).filter(q=>q&&(q.statut==='En cours'||q.statut==='Non commencée'));
  document.getElementById('qcount').textContent=qs.length;
  document.getElementById('qlist').innerHTML=qs.map(q=>`
    <div class="qcard ${quest&&quest.id===q.id?'sel':''}" onclick="selQ('${q.id}')">
      <div class="qname">${q.nom}</div>
      <div class="qmeta">
        <span class="badge ${SB[q.statut]||'bk'}">${q.statut}</span>
        <span class="badge ${SB[q.type]||'bk'}">${q.type}</span>
      </div>
      <div class="qloc">${q.lieu}</div>
    </div>`).join('');
}

function selQ(id){
  if(quest) notes[quest.id]=document.getElementById('dnotes').value;
  quest=DATA.quetes[id]; comb=[]; turn=0; round=1;
  renderQ();
  document.getElementById('dtitle').childNodes[0].textContent=quest.nom+' ';
  document.getElementById('dsc').textContent=quest.scenario;
  document.getElementById('dobj').textContent=quest.objectif;
  document.getElementById('ddon').textContent=quest.donneur;
  document.getElementById('dlieu').textContent=quest.lieu;
  document.getElementById('drec').textContent=quest.recompense;
  document.getElementById('ddesc').textContent=quest.description;
  document.getElementById('dnotes').value=notes[quest.id]||'';
  const d=document.getElementById('qdetail');
  d.style.display='block'; d.classList.remove('fi'); void d.offsetWidth; d.classList.add('fi');
  renderC(); notify('Quête : '+quest.nom);
}

// ═══════════════════════════════════════════════════
// COMBAT
// ═══════════════════════════════════════════════════
function hpc(cur,max){const p=cur/max;return p>0.6?'#4DAA70':p>0.3?'#C87820':cur>0?'#CC3333':'#4A3820'}
function etat(cur,max){
  if(cur<=0) return '<span class="badge bk">KO</span>';
  const p=cur/max;
  if(p>0.6) return '<span class="badge bg">Intact</span>';
  if(p>0.3) return '<span class="badge ba">Blessé</span>';
  return '<span class="badge br">Critique</span>';
}
function tbadge(t){
  if(t==='joueur') return '<span class="badge bb">Joueur</span>';
  if(t==='pnj') return '<span class="badge bg">Allié</span>';
  return '<span class="badge br">Ennemi</span>';
}
function renderC(){
  const tb=document.getElementById('ctbody');
  if(!comb.length){
    tb.innerHTML='<tr><td colspan="6"><div class="empty">Ajoute des participants pour démarrer le combat</div></td></tr>';
    document.getElementById('tlabel').textContent='Aucun combat en cours';
    document.getElementById('rbadge').textContent='Round —';
    return;
  }
  tb.innerHTML=comb.map((c,i)=>{
    const pct=Math.round(c.pvCur/c.pvMax*100);
    const act=i===turn;
    return `<tr class="crow${act?' act':''}">
      <td>
        <div class="cname${act?' act':''}">${act?'▶ ':''}${c.name}</div>
        <div class="ctypes">${tbadge(c.type)}${c.ca?'<span class="badge bk">CA '+c.ca+'</span>':''}</div>
      </td>
      <td class="initn">${c.init}</td>
      <td>
        <div class="hp-nums" style="color:${hpc(c.pvCur,c.pvMax)}">${c.pvCur}<span style="font-size:11px;color:var(--text-dim)">/${c.pvMax}</span></div>
        <div class="hpbar"><div class="hpfill" style="width:${pct}%;background:${hpc(c.pvCur,c.pvMax)}"></div></div>
      </td>
      <td>
        <div class="dmg-row">
          <input class="di" id="d${i}" type="number" placeholder="0" min="0" onkeydown="if(event.key==='Enter')applyD(${i})">
          <button class="btn sm dan" onclick="applyD(${i})">−PV</button>
          <button class="btn sm" onclick="healD(${i})">+PV</button>
        </div>
      </td>
      <td style="text-align:center">${etat(c.pvCur,c.pvMax)}</td>
      <td style="text-align:center"><button class="btn sm" onclick="remC(${i})">✕</button></td>
    </tr>`;
  }).join('');
  document.getElementById('tlabel').textContent='Tour de '+comb[turn].name;
  document.getElementById('rbadge').textContent='Round '+round;
  if(mode==='pl') renderPV();
}

function addC(){
  const name=document.getElementById('nn').value.trim();
  const type=document.getElementById('nt').value;
  const init=parseInt(document.getElementById('ni').value)||0;
  const pv=parseInt(document.getElementById('np').value)||10;
  const ca=parseInt(document.getElementById('nc').value)||0;
  if(!name){notify('Saisis un nom');return;}
  comb.push({name,type,init,pvMax:pv,pvCur:pv,ca});
  comb.sort((a,b)=>b.init-a.init); turn=0;
  ['nn','ni','np','nc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('nn').focus();
  renderC(); notify(name+' ajouté(e)');
}
function applyD(i){
  const v=parseInt(document.getElementById('d'+i).value)||0;
  if(!v)return;
  comb[i].pvCur=Math.max(0,comb[i].pvCur-v);
  document.getElementById('d'+i).value='';
  if(comb[i].pvCur===0) notify(comb[i].name+' est KO !');
  renderC();
}
function healD(i){
  const v=parseInt(document.getElementById('d'+i).value)||0;
  if(!v)return;
  comb[i].pvCur=Math.min(comb[i].pvMax,comb[i].pvCur+v);
  document.getElementById('d'+i).value='';
  renderC();
}
function remC(i){const n=comb[i].name;comb.splice(i,1);if(turn>=comb.length)turn=0;renderC();notify(n+' retiré(e)');}
function nextT(){if(!comb.length)return;turn=(turn+1)%comb.length;if(turn===0){round++;notify('Round '+round+' !');}renderC();}
function prevT(){if(!comb.length)return;if(turn===0){round=Math.max(1,round-1);turn=comb.length-1;}else turn--;renderC();}
function resetC(){comb.forEach(c=>c.pvCur=c.pvMax);turn=0;round=1;renderC();notify('Combat réinitialisé');}

// ═══════════════════════════════════════════════════
// VUE JOUEURS
// ═══════════════════════════════════════════════════
function pvClass(cur,max){if(cur<=0)return 'ko';const p=cur/max;return p>0.6?'ok':p>0.3?'wa':'da';}
function renderPV(){
  document.getElementById('psn').textContent=sess?sess.nom:'—';
  document.getElementById('pqn').textContent=quest?'Quête : '+quest.nom:'Aucune quête active';
  const pg=document.getElementById('pcards');
  if(!comb.length){pg.innerHTML='<div class="empty" style="grid-column:1/-1">Aucun participant enregistré</div>';}
  else{
    pg.innerHTML=comb.map(c=>{
      const p=Math.round(c.pvCur/c.pvMax*100);
      const cl=pvClass(c.pvCur,c.pvMax);
      return `<div class="pcard ${cl}">
        <div class="pcname">${c.name}</div>
        <div class="pchp ${cl}">${c.pvCur}</div>
        <div class="pcmax">/ ${c.pvMax} PV</div>
        <div class="pcbar"><div class="pcfill" style="width:${p}%;background:${hpc(c.pvCur,c.pvMax)}"></div></div>
        ${c.ca?'<div style="margin-top:7px;font-size:11px;color:var(--text-dim);font-family:\'JetBrains Mono\',monospace">CA '+c.ca+'</div>':''}
      </div>`;
    }).join('');
  }
  const pi=document.getElementById('pilist');
  if(!comb.length){pi.innerHTML='<div class="empty">Aucun combat en cours</div>';return;}
  pi.innerHTML=comb.map((c,i)=>`
    <div class="irow${i===turn?' act':''}">
      <div class="inum">${c.init}</div>
      <div class="iname">${c.name}</div>
      ${tbadge(c.type)}
      ${etat(c.pvCur,c.pvMax)}
      ${i===turn?'<div class="iact">▶ À jouer</div>':''}
    </div>`).join('');
}

// Notif
let nt=null;
function notify(msg){const e=document.getElementById('notif');e.textContent=msg;e.classList.add('show');if(nt)clearTimeout(nt);nt=setTimeout(()=>e.classList.remove('show'),2400);}