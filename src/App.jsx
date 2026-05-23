import { useState, useEffect, useMemo } from 'react'

const LEVEL_TITLES = ['', 'Neuling', 'Aufsteiger', 'Kämpfer', 'Krieger', 'Legende']
const LEVEL_ICONS  = ['', '🌱', '⚔️', '🔥', '💎', '👑']

const PRESET_HABITS = [
  { id:'p1',  name:'30 Min. Sport',            sub:'Stärke +2',    xp:50,  stat:'str' },
  { id:'p2',  name:'10 Min. meditieren',        sub:'Fokus +1',     xp:30,  stat:'foc' },
  { id:'p3',  name:'Kein Junk Food',            sub:'Disziplin +2', xp:20,  stat:'dis' },
  { id:'p4',  name:'Buch lesen (20 Seiten)',     sub:'Fokus +1',     xp:25,  stat:'foc' },
  { id:'p5',  name:'Cold Shower',               sub:'Ausdauer +2',  xp:35,  stat:'agi' },
  { id:'p6',  name:'2L Wasser trinken',          sub:'Ausdauer +1',  xp:15,  stat:'agi' },
  { id:'p7',  name:'5 Min. Stretching',          sub:'Ausdauer +1',  xp:10,  stat:'agi' },
  { id:'p8',  name:'Keine Sozialen Medien',      sub:'Disziplin +3', xp:40,  stat:'dis' },
  { id:'p9',  name:'Journaling (10 Min.)',        sub:'Fokus +2',     xp:25,  stat:'foc' },
  { id:'p10', name:'Kein Alkohol heute',          sub:'Disziplin +2', xp:30,  stat:'dis' },
  { id:'p11', name:'Gesund frühstücken',          sub:'Ausdauer +1',  xp:15,  stat:'agi' },
  { id:'p12', name:'10.000 Schritte',             sub:'Ausdauer +2',  xp:40,  stat:'agi' },
  { id:'p13', name:'Dankbarkeit aufschreiben',    sub:'Fokus +1',     xp:15,  stat:'foc' },
  { id:'p14', name:'Kein Koffein nach 14 Uhr',   sub:'Disziplin +1', xp:15,  stat:'dis' },
]

const SOLO_QUESTS = [
  { id:'s1',  title:'Naturstunde',             desc:'1 Stunde in der Natur, kein Handy.',                             icon:'🌿', diff:'easy',   xp:60,  total:1  },
  { id:'s2',  title:'5km Lauf',                desc:'Laufe 5 km am Stück ohne Pause.',                                icon:'🏃', diff:'medium', xp:100, total:1  },
  { id:'s3',  title:'10km Challenge',          desc:'Laufe 10 km – volle Leistung.',                                  icon:'🏆', diff:'hard',   xp:200, total:1  },
  { id:'s4',  title:'30-Tage Sport',           desc:'Täglich Sport für 30 Tage. Kein Tag frei.',                      icon:'💪', diff:'hard',   xp:500, total:30 },
  { id:'s5',  title:'Digital Detox Tag',       desc:'24h ohne Social Media, YouTube und Netflix.',                    icon:'📵', diff:'medium', xp:80,  total:1  },
  { id:'s6',  title:'Frühaufsteher-Woche',     desc:'7 Tage lang vor 6 Uhr aufstehen.',                              icon:'🌅', diff:'medium', xp:150, total:7  },
  { id:'s7',  title:'Tagebuch-Streak',         desc:'14 Tage jeden Abend deine Gedanken aufschreiben.',              icon:'📓', diff:'easy',   xp:120, total:14 },
  { id:'s8',  title:'Kalt duschen (14 Tage)',  desc:'60 Sekunden kalt, jeden Tag, 14 Tage.',                         icon:'🚿', diff:'medium', xp:140, total:14 },
  { id:'s9',  title:'Solo-Ausflug',            desc:'Einen ganzen Tag alleine erkunden. Kein Plan, kein Handy.',     icon:'🗺️', diff:'easy',   xp:70,  total:1  },
  { id:'s10', title:'1 Monat kein Alkohol',    desc:'30 Tage komplett nüchtern.',                                    icon:'🚫', diff:'hard',   xp:300, total:30 },
  { id:'s11', title:'Neues Hobby starten',     desc:'Lerne etwas komplett Neues – Instrument, Sprache, Skill.',     icon:'🎯', diff:'easy',   xp:80,  total:1  },
  { id:'s12', title:'Sonnenaufgang sehen',     desc:'Steh früh genug auf um den Sonnenaufgang zu erleben.',         icon:'🌄', diff:'easy',   xp:50,  total:1  },
  { id:'s13', title:'21-Tage Habit-Streak',    desc:'Irgendein Habit 21 Tage ohne Unterbrechung.',                  icon:'🔥', diff:'hard',   xp:350, total:21 },
]

const SOCIAL_QUESTS = [
  { id:'c1',  title:'Fremden ansprechen',      desc:'Führe ein echtes Gespräch mit einem fremden Menschen.',              icon:'🗣️', diff:'medium', xp:80,  total:1 },
  { id:'c2',  title:'Alten Freund anrufen',    desc:'Ruf jemanden an dem du lang nicht gesprochen hast.',               icon:'📞', diff:'easy',   xp:40,  total:1 },
  { id:'c3',  title:'Gruppen-Aktivität',       desc:'Organisiere eine Aktivität für 3+ Freunde.',                        icon:'👥', diff:'medium', xp:100, total:1 },
  { id:'c4',  title:'Wanderung mit Freunden',  desc:'Gemeinsam wandern, min. 2h, Handys weg.',                          icon:'⛰️', diff:'easy',   xp:90,  total:1 },
  { id:'c5',  title:'Koch-Abend hosten',       desc:'Koche für Freunde oder Familie – du bist Host.',                   icon:'👨‍🍳', diff:'medium', xp:110, total:1 },
  { id:'c6',  title:'Sport-Buddy Challenge',   desc:'3x/Woche Sport mit einem Freund, 2 Wochen.',                       icon:'🤝', diff:'hard',   xp:250, total:6 },
  { id:'c7',  title:'Komfort-Zone brechen',    desc:'Macht zusammen etwas das ihr normalerweise nie tun würdet.',       icon:'⚡', diff:'hard',   xp:150, total:1 },
  { id:'c8',  title:'Ehrenamtlich helfen',     desc:'Gemeinsam bei einer sozialen Aktion mitmachen.',                   icon:'❤️', diff:'medium', xp:200, total:1 },
  { id:'c9',  title:'Überraschung machen',     desc:'Überrasche jemanden dem du wichtig bist mit einer netten Geste.', icon:'🎁', diff:'easy',   xp:60,  total:1 },
  { id:'c10', title:'Stadtabenteuer',          desc:'Entdeckt eure Stadt wie Touristen – kein Plan, einfach gehen.',   icon:'🏙️', diff:'easy',   xp:80,  total:1 },
]

const ALL_DAILY_QUESTS = [
  { id:'d1',  title:'10 Liegestütze jetzt',      desc:'Steh auf und mach sofort 10 Liegestütze.',              icon:'💪', xp:20 },
  { id:'d2',  title:'5 Min. frische Luft',        desc:'Raus aus dem Haus, auch wenn es kurz ist.',             icon:'🌬️', xp:15 },
  { id:'d3',  title:'Ein Glas Wasser extra',      desc:'Trink jetzt gleich ein großes Glas Wasser.',           icon:'💧', xp:10 },
  { id:'d4',  title:'Jemanden aufrichtig loben',  desc:'Sag heute jemandem ehrlich etwas Nettes.',              icon:'🌟', xp:20 },
  { id:'d5',  title:'Handy 1h weglegen',          desc:'Eine Stunde bewusstes Handy-Fasten.',                   icon:'📵', xp:25 },
  { id:'d6',  title:'3 Dinge der Dankbarkeit',    desc:'Schreib 3 Dinge auf für die du heute dankbar bist.',  icon:'📝', xp:15 },
  { id:'d7',  title:'20 Kniebeugen',              desc:'Mach 20 saubere Kniebeugen. Jetzt.',                   icon:'🦵', xp:20 },
  { id:'d8',  title:'5 Min. Dehnen',              desc:'Steh auf und strecke deinen Körper.',                  icon:'🧘', xp:15 },
  { id:'d9',  title:'10 Min. etwas Neues lernen', desc:'Lies über etwas das dich interessiert.',               icon:'🧠', xp:25 },
  { id:'d10', title:'Musik bewusst hören',        desc:'Hör ein Album ohne Ablenkung.',                        icon:'🎵', xp:15 },
  { id:'d11', title:'10 Min. aufräumen',          desc:'Räum deinen Raum oder Schreibtisch auf.',              icon:'🧹', xp:20 },
  { id:'d12', title:'Alten Kontakt schreiben',    desc:'Schreib jemandem dem du lang nicht geschrieben hast.', icon:'💬', xp:20 },
  { id:'d13', title:'Kein Snacken abends',        desc:'Nach 19 Uhr nichts mehr essen.',                       icon:'🚫', xp:25 },
  { id:'d14', title:'Früher schlafen gehen',      desc:'Heute min. 30 Min. früher ins Bett als sonst.',       icon:'🌙', xp:20 },
  { id:'d15', title:'Tagesziel festlegen',        desc:'Schreib dein wichtigstes Ziel für heute auf.',        icon:'🎯', xp:15 },
  { id:'d16', title:'1 Min. Plank',              desc:'Halte eine Plank für 60 Sekunden.',                    icon:'🔥', xp:25 },
  { id:'d17', title:'Spaziergang (20 Min.)',      desc:'20 Minuten zu Fuß, ohne Destination.',                icon:'🚶', xp:20 },
  { id:'d18', title:'Selbstreflexion (5 Min.)',   desc:'Sitz still, kein Handy, denke über deinen Tag nach.', icon:'💭', xp:20 },
  { id:'d19', title:'Proteinreiches Essen',       desc:'Stell sicher dass du heute genug Protein isst.',      icon:'🥩', xp:15 },
  { id:'d20', title:'Kaltes Wasser morgens',      desc:'Spritz dir kaltes Wasser ins Gesicht. Wach werden.',  icon:'🚿', xp:10 },
  { id:'d21', title:'Etwas Inspirierendes lesen', desc:'10 Seiten Buch oder ein guter Artikel.',              icon:'📚', xp:15 },
]

const QUOTES = [
  { text:'Disziplin ist die Brücke zwischen Zielen und Ergebnissen.', author:'Jim Rohn' },
  { text:'Ein Mann wird nicht durch das definiert was er sagt, sondern durch das was er tut.', author:'Unbekannt' },
  { text:'Der Schmerz von Disziplin ist nichts verglichen mit dem Schmerz der Reue.', author:'Roy Bennett' },
  { text:'Wer sich selbst beherrscht, beherrscht sein Leben.', author:'Stoisches Sprichwort' },
  { text:'Tu was du tun musst, dann kannst du tun was du willst.', author:'Mark Twain' },
  { text:'Der einzige Mensch den du übertreffen solltest ist der den du gestern warst.', author:'Unbekannt' },
  { text:'Erfolg ist die Summe kleiner Anstrengungen die Tag für Tag wiederholt werden.', author:'Robert Collier' },
  { text:'Stärke wächst nicht aus körperlicher Kraft. Sie kommt aus einem unbeugsamen Willen.', author:'Gandhi' },
  { text:'Der Weg zu einem starken Charakter führt immer durch Unbequemlichkeit.', author:'Unbekannt' },
  { text:'Tue jeden Tag etwas das dich erschreckt.', author:'Eleanor Roosevelt' },
  { text:'Ein Gentleman ist jemand der niemals unbeabsichtigt unhöflich ist.', author:'Oscar Wilde' },
  { text:'Ruhe ist keine Abwesenheit von Aktivität sondern ein Zustand des Geistes.', author:'Unbekannt' },
  { text:'Sei die Person die du brauchtest als du jünger warst.', author:'Unbekannt' },
  { text:'Das Schwierigste ist der Entschluss zu handeln. Der Rest ist reine Ausdauer.', author:'Amelia Earhart' },
  { text:'Wer aufhört besser zu werden hat aufgehört gut zu sein.', author:'Philip Rosenthal' },
  { text:'Dein zukünftiges Ich schaut auf dich. Mach es stolz.', author:'Unbekannt' },
  { text:'Kleine tägliche Verbesserungen führen zu atemberaubenden Langzeitergebnissen.', author:'Robin Sharma' },
  { text:'Die Qualität deines Lebens ist die Qualität deiner täglichen Gewohnheiten.', author:'Unbekannt' },
  { text:'Your only limit is you.', author:'Unbekannt' },
]

const GENT_TIPS = [
  { icon:'👔', title:'Kleidung mit Absicht',    body:'Ein Gentleman trägt keine Marken um zu beeindrucken. Er kleidet sich angemessen für den Ort und die Situation.' },
  { icon:'👂', title:'Aktiv zuhören',           body:'Die stärkste Fähigkeit im Gespräch: wirklich zuhören, nicht nur warten bis man selbst reden kann.' },
  { icon:'✋', title:'Grenzen setzen',          body:'Nein sagen ist keine Schwäche. Ein Mann mit klaren Grenzen wird mehr respektiert als einer der zu allem Ja sagt.' },
  { icon:'🤝', title:'Wort halten',             body:'Versprich wenig und halte viel. Verlässlichkeit ist das wichtigste Kapital eines Mannes.' },
  { icon:'📱', title:'Handy wegstecken',        body:'Im Gespräch das Handy weglegen. Diese einfache Geste zeigt mehr Respekt als jede Höflichkeit.' },
  { icon:'🪞', title:'Tägliche Selbstreflexion',body:'Nimm dir jeden Abend 5 Minuten. Was lief gut? Was besser? Wer reflektiert, wächst.' },
  { icon:'💬', title:'Weniger reden, mehr tun', body:'Ankündigungen beeindrucken niemanden. Resultate schon. Lass deine Taten sprechen.' },
  { icon:'🧭', title:'Eigene Werte kennen',     body:'Wer seine Werte nicht kennt lässt sich von jedem führen. Definiere was dir wichtig ist und lebe danach.' },
]

const PEACE_TIPS = [
  { icon:'🌬️', title:'Stoizismus im Alltag',  body:'Frage dich bei jedem Problem: Liegt das in meiner Kontrolle? Wenn nein – lass es los. Diese Frage spart 80% deiner Unruhe.' },
  { icon:'🌙', title:'Morgen-Ritual',          body:'Starte den Tag ohne Handy. 10 Minuten Stille, ein Glas Wasser, eine klare Absicht. Das setzt den Ton.' },
  { icon:'🍃', title:'Minimalismus denken',    body:'Jede unnötige Sache kostet Energie – Objekte, Beziehungen, Gedanken. Weniger besitzen, mehr erleben.' },
  { icon:'🎯', title:'Nur eine Sache',         body:'Multitasking ist eine Illusion. Mach eine Sache, gib ihr deine volle Aufmerksamkeit, dann die nächste.' },
  { icon:'🌊', title:'Akzeptanz üben',         body:'Was du nicht ändern kannst musst du akzeptieren lernen. Der Kampf gegen die Realität erschöpft dich mehr als sie selbst.' },
  { icon:'🏔️', title:'Langfristig denken',    body:'Die meisten Probleme die sich heute riesig anfühlen werden in einem Jahr irrelevant sein. Atme durch.' },
  { icon:'☀️', title:'Natur als Reset',        body:'10 Minuten in der Natur senken Cortisol nachweislich. Wenn du gestresst bist – raus gehen.' },
  { icon:'🤍', title:'Selbstmitgefühl',        body:'Du machst Fehler. Das ist menschlich. Behandle dich so wie du einen guten Freund behandeln würdest.' },
]

function loadState() {
  try { const r = localStorage.getItem('levelup_v3'); return r ? JSON.parse(r) : null } catch { return null }
}
function saveState(s) {
  try { localStorage.setItem('levelup_v3', JSON.stringify(s)) } catch {}
}
function todayStr() { return new Date().toDateString() }

function getDailyQuests() {
  const seed = new Date().toDateString().split('').reduce((a,c) => a + c.charCodeAt(0), 0)
  const picked = []; const pool = [...ALL_DAILY_QUESTS]; let s = seed
  while (picked.length < 3 && pool.length > 0) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    picked.push(pool.splice(s % pool.length, 1)[0])
  }
  return picked
}

function initialState() {
  const saved = loadState(); const today = todayStr()
  if (!saved) return { xp:0, maxXp:200, level:1, str:1, agi:1, foc:1, dis:1, activeHabits:[], doneTodayIds:[], customHabits:[], quests:{}, goals:[], doneDailyIds:[], lastDate:today }
  if (saved.lastDate !== today) return { ...saved, doneTodayIds:[], doneDailyIds:[], lastDate:today }
  return saved
}

const DIFF_LABEL = { easy:'Leicht', medium:'Mittel', hard:'Schwer' }
const DIFF_COLOR = { easy:'#E1F5EE', medium:'#FAEEDA', hard:'#FAECE7' }
const DIFF_TEXT  = { easy:'#085041', medium:'#633806', hard:'#712B13' }

const S = {
  card:      { background:'#fff', border:'0.5px solid #ebebeb', borderRadius:14, padding:'1rem 1.25rem', marginBottom:10 },
  cardHL:    { background:'#fff', border:'1.5px solid #AFA9EC', borderRadius:14, padding:'1rem 1.25rem', marginBottom:10 },
  secTitle:  { fontSize:11, fontWeight:600, color:'#aaa', textTransform:'uppercase', letterSpacing:'.07em', margin:'1.2rem 0 .5rem' },
  xpWrap:    { background:'#eeebff', borderRadius:99, height:8, overflow:'hidden' },
  xpBar:     { height:'100%', borderRadius:99, background:'linear-gradient(90deg,#9B8FFF,#7F77DD)', transition:'width .5s ease' },
  statBox:   { background:'#f7f7fb', borderRadius:10, padding:'8px 6px', textAlign:'center' },
  habitRow:  { display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'0.5px solid #f5f5f5' },
  chk:       { width:27, height:27, borderRadius:'50%', border:'1.5px solid #ddd', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' },
  chkOn:     { background:'linear-gradient(135deg,#9B8FFF,#7F77DD)', borderColor:'#7F77DD' },
  progWrap:  { background:'#f0f0f0', borderRadius:99, height:5, overflow:'hidden' },
  progBar:   { height:'100%', borderRadius:99, background:'linear-gradient(90deg,#9B8FFF,#7F77DD)', transition:'width .4s' },
  bPurple:   { fontSize:11, color:'#3C3489', background:'#EEEDFE', padding:'2px 9px', borderRadius:99, fontWeight:500 },
  bGreen:    { fontSize:11, color:'#085041', background:'#E1F5EE', padding:'2px 9px', borderRadius:99, fontWeight:500 },
  empty:     { fontSize:13, color:'#ccc', textAlign:'center', padding:'1rem 0' },
  input:     { width:'100%', padding:'9px 11px', border:'0.5px solid #e0e0e0', borderRadius:9, fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box', background:'#fafafa' },
  btnSm:     { padding:'5px 13px', fontSize:12, border:'0.5px solid #e0e0e0', borderRadius:8, background:'transparent', cursor:'pointer', fontFamily:'inherit' },
  btnPri:    { background:'linear-gradient(135deg,#9B8FFF,#7F77DD)', color:'white', fontWeight:500, border:'none' },
  btnActive: { background:'#EEEDFE', borderColor:'#AFA9EC', color:'#3C3489' },
  btnDone:   { background:'#E1F5EE', borderColor:'#86CDB8', color:'#085041' },
  modalBg:   { background:'rgba(0,0,0,0.35)', borderRadius:14, padding:'1rem', marginBottom:10 },
  modalBox:  { background:'#fff', borderRadius:14, padding:'1.25rem' },
}

function XPBar({ xp, maxXp, level, str, agi, foc, dis }) {
  const pct = Math.min(Math.round(xp/maxXp*100),100)
  return (
    <div style={{ background:'linear-gradient(135deg,#F0EFFE,#EEF0FF)', borderRadius:14, padding:'1rem 1.25rem', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:700 }}>{LEVEL_ICONS[level]} Level {level} · {LEVEL_TITLES[level]}</div>
          <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{xp} / {maxXp} XP</div>
        </div>
      </div>
      <div style={S.xpWrap}><div style={{ ...S.xpBar, width:pct+'%' }} /></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:12 }}>
        {[['⚔️',str,'Stärke'],['🏃',agi,'Ausdauer'],['🧠',foc,'Fokus'],['🛡️',dis,'Disziplin']].map(([icon,v,l])=>(
          <div key={l} style={S.statBox}><div style={{ fontSize:14 }}>{icon}</div><div style={{ fontSize:16, fontWeight:700, marginTop:2 }}>{v}</div><div style={{ fontSize:10, color:'#aaa', marginTop:1 }}>{l}</div></div>
        ))}
      </div>
    </div>
  )
}

function HabitRow({ habit, done, onCheck }) {
  return (
    <div style={S.habitRow}>
      <div onClick={!done ? onCheck : undefined} style={{ ...S.chk, ...(done?S.chkOn:{}), cursor:done?'default':'pointer' }}>
        {done && <span style={{ color:'white', fontSize:13, fontWeight:700 }}>✓</span>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, color:done?'#ccc':'#1a1a1a', textDecoration:done?'line-through':'none' }}>{habit.name}</div>
        <div style={{ fontSize:11, color:'#ccc' }}>{habit.sub}</div>
      </div>
      <span style={S.bPurple}>+{habit.xp} XP</span>
    </div>
  )
}

function PageToday({ state, allHabits, onCheck, activeQuests, onDailyDone, dailyQuests }) {
  const activeHabitObjects = allHabits.filter(h => state.activeHabits.includes(h.id))
  const openGoals = (state.goals||[]).filter(g => !g.done)
  return (
    <div>
      <XPBar {...state} />
      {openGoals.length > 0 && <>
        <div style={S.secTitle}>🎯 Meine Ziele</div>
        {openGoals.map(g => (
          <div key={g.id} style={{ ...S.card, borderLeft:'3px solid #7F77DD' }}>
            <div style={{ fontSize:14, fontWeight:500 }}>{g.text}</div>
            {g.note && <div style={{ fontSize:12, color:'#888', marginTop:3 }}>{g.note}</div>}
          </div>
        ))}
      </>}
      <div style={S.secTitle}>✅ Heutige Habits</div>
      <div style={S.card}>
        {activeHabitObjects.length === 0
          ? <div style={S.empty}>Noch keine Habits aktiv.<br/>Geh zu Habits!</div>
          : activeHabitObjects.map(h => <HabitRow key={h.id} habit={h} done={state.doneTodayIds.includes(h.id)} onCheck={() => onCheck(h)} />)
        }
      </div>
      <div style={S.secTitle}>⚡ Daily Quests</div>
      <div style={S.card}>
        {dailyQuests.map(q => {
          const done = (state.doneDailyIds||[]).includes(q.id)
          return (
            <div key={q.id} style={S.habitRow}>
              <span style={{ fontSize:20, flexShrink:0 }}>{q.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, color:done?'#ccc':'#1a1a1a', textDecoration:done?'line-through':'none' }}>{q.title}</div>
                <div style={{ fontSize:11, color:'#ccc' }}>{q.desc}</div>
              </div>
              <button onClick={() => !done && onDailyDone(q)} style={{ ...S.btnSm, ...(done?S.btnDone:{}) }}>
                {done ? 'Erledigt ✓' : '+'+q.xp+' XP'}
              </button>
            </div>
          )
        })}
      </div>
      {activeQuests.length > 0 && <>
        <div style={S.secTitle}>⚔️ Aktive Quests</div>
        {activeQuests.map(q => (
          <div key={q.id} style={S.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:q.total>1?6:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>{q.icon}</span>
                <span style={{ fontSize:14, fontWeight:500 }}>{q.title}</span>
              </div>
              <span style={S.bPurple}>+{q.xp} XP</span>
            </div>
            {q.total>1 && <>
              <div style={S.progWrap}><div style={{ ...S.progBar, width:Math.round((q.prog||0)/q.total*100)+'%' }} /></div>
              <div style={{ fontSize:11, color:'#aaa', marginTop:4 }}>{q.prog||0} / {q.total} Tage</div>
            </>}
          </div>
        ))}
      </>}
    </div>
  )
}

function PageHabits({ state, onTogglePreset, onAddCustom, onDeleteCustom }) {
  const [show, setShow] = useState(false)
  const [name, setName] = useState(''); const [xpVal, setXpVal] = useState(''); const [statVal, setStatVal] = useState('')
  function submit() {
    if (!name.trim()) return
    const smap = { stärke:'str', fokus:'foc', ausdauer:'agi', disziplin:'dis' }
    onAddCustom({ id:'cu'+Date.now(), name:name.trim(), sub:statVal||'Disziplin +1', xp:parseInt(xpVal)||20, stat:smap[statVal.trim().toLowerCase()]||'dis' })
    setName(''); setXpVal(''); setStatVal(''); setShow(false)
  }
  return (
    <div>
      <div style={S.secTitle}>Vorgegebene Habits</div>
      <div style={S.card}>
        {PRESET_HABITS.map(h => {
          const active = state.activeHabits.includes(h.id)
          return (
            <div key={h.id} style={S.habitRow}>
              <span style={{ fontSize:18, flexShrink:0 }}>{h.stat==='str'?'⚔️':h.stat==='agi'?'🏃':h.stat==='foc'?'🧠':'🛡️'}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14 }}>{h.name}</div>
                <div style={{ fontSize:11, color:'#ccc' }}>{h.sub} · +{h.xp} XP</div>
              </div>
              <button onClick={() => onTogglePreset(h.id)} style={{ ...S.btnSm, ...(active?S.btnActive:{}) }}>
                {active ? 'Aktiv ✓' : 'Hinzufügen'}
              </button>
            </div>
          )
        })}
      </div>
      <div style={S.secTitle}>Meine Habits</div>
      <div style={S.card}>
        {state.customHabits.length === 0
          ? <div style={S.empty}>Noch keine eigenen Habits.</div>
          : state.customHabits.map(h => (
            <div key={h.id} style={S.habitRow}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14 }}>{h.name}</div>
                <div style={{ fontSize:11, color:'#ccc' }}>{h.sub} · +{h.xp} XP</div>
              </div>
              <button onClick={() => onDeleteCustom(h.id)} style={{ ...S.btnSm, color:'#e74c3c', borderColor:'#fdd' }}>✕</button>
            </div>
          ))
        }
      </div>
      {show && (
        <div style={S.modalBg}><div style={S.modalBox}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:12 }}>Neuen Habit erstellen</div>
          <input style={S.input} placeholder="Name (z.B. Journaling)" value={name} onChange={e=>setName(e.target.value)} />
          <input style={{ ...S.input, marginTop:8 }} type="number" placeholder="XP-Wert (z.B. 25)" value={xpVal} onChange={e=>setXpVal(e.target.value)} />
          <input style={{ ...S.input, marginTop:8, marginBottom:14 }} placeholder="Stat: Stärke / Fokus / Ausdauer / Disziplin" value={statVal} onChange={e=>setStatVal(e.target.value)} />
          <div style={{ display:'flex', gap:8 }}>
            <button style={S.btnSm} onClick={()=>setShow(false)}>Abbrechen</button>
            <button style={{ ...S.btnSm, ...S.btnPri, padding:'6px 16px' }} onClick={submit}>Erstellen</button>
          </div>
        </div></div>
      )}
      <button style={{ ...S.btnPri, width:'100%', padding:'11px 0', borderRadius:10, cursor:'pointer', fontSize:14, fontFamily:'inherit' }} onClick={()=>setShow(true)}>+ Eigenen Habit hinzufügen</button>
    </div>
  )
}

function PageGoals({ state, onAddGoal, onDeleteGoal, onToggleDone }) {
  const [showAdd, setShowAdd] = useState(false)
  const [text, setText] = useState(''); const [note, setNote] = useState('')
  const openGoals = (state.goals||[]).filter(g => !g.done)
  const doneGoals = (state.goals||[]).filter(g => g.done)
  function add() {
    if (!text.trim()) return
    onAddGoal({ id:'g'+Date.now(), text:text.trim(), note:note.trim(), done:false, createdAt:todayStr() })
    setText(''); setNote(''); setShowAdd(false)
  }
  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,#F0EFFE,#EEF0FF)', borderRadius:14, padding:'1.25rem', marginBottom:12, textAlign:'center' }}>
        <div style={{ fontSize:28, marginBottom:6 }}>🎯</div>
        <div style={{ fontSize:16, fontWeight:700 }}>Deine Ziele</div>
        <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Setze klare Meilensteine – keine Habits, sondern Ziele die du einmalig erreichst.</div>
      </div>
      {showAdd && (
        <div style={S.modalBg}><div style={S.modalBox}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:12 }}>Neues Ziel</div>
          <input style={S.input} placeholder="Dein Ziel (z.B. 10kg abnehmen)" value={text} onChange={e=>setText(e.target.value)} />
          <input style={{ ...S.input, marginTop:8, marginBottom:14 }} placeholder="Notiz – bis wann, warum? (optional)" value={note} onChange={e=>setNote(e.target.value)} />
          <div style={{ display:'flex', gap:8 }}>
            <button style={S.btnSm} onClick={()=>setShowAdd(false)}>Abbrechen</button>
            <button style={{ ...S.btnSm, ...S.btnPri, padding:'6px 16px' }} onClick={add}>Speichern</button>
          </div>
        </div></div>
      )}
      <button style={{ ...S.btnPri, width:'100%', padding:'11px 0', borderRadius:10, cursor:'pointer', fontSize:14, fontFamily:'inherit', marginBottom:12 }} onClick={()=>setShowAdd(true)}>+ Neues Ziel hinzufügen</button>
      {openGoals.length === 0 && doneGoals.length === 0 && <div style={S.card}><div style={S.empty}>Noch keine Ziele gesetzt.<br/>Füge dein erstes Ziel hinzu!</div></div>}
      {openGoals.map(g => (
        <div key={g.id} style={{ ...S.card, borderLeft:'3px solid #7F77DD' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500 }}>{g.text}</div>
              {g.note && <div style={{ fontSize:12, color:'#888', marginTop:3 }}>{g.note}</div>}
              <div style={{ fontSize:11, color:'#ccc', marginTop:4 }}>Erstellt: {g.createdAt}</div>
            </div>
            <div style={{ display:'flex', gap:6, marginLeft:10, flexShrink:0 }}>
              <button onClick={() => onToggleDone(g.id)} style={{ ...S.btnSm, ...S.btnDone, fontSize:11 }}>✓ Erreicht</button>
              <button onClick={() => onDeleteGoal(g.id)} style={{ ...S.btnSm, color:'#e74c3c', borderColor:'#fdd', fontSize:11 }}>✕</button>
            </div>
          </div>
        </div>
      ))}
      {doneGoals.length > 0 && <>
        <div style={S.secTitle}>✅ Erreichte Ziele</div>
        {doneGoals.map(g => (
          <div key={g.id} style={{ ...S.card, opacity:.6 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:14, textDecoration:'line-through' }}>{g.text}</div>
                {g.note && <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{g.note}</div>}
              </div>
              <button onClick={() => onDeleteGoal(g.id)} style={{ ...S.btnSm, color:'#e74c3c', borderColor:'#fdd', fontSize:11 }}>✕</button>
            </div>
          </div>
        ))}
      </>}
    </div>
  )
}

function PageQuests({ state, onToggleQuest }) {
  const [tab, setTab] = useState('solo')
  const list = tab === 'solo' ? SOLO_QUESTS : SOCIAL_QUESTS
  return (
    <div>
      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
        {['solo','social'].map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'9px 0', borderRadius:10, border:'0.5px solid #e0e0e0', background:tab===t?'#EEEDFE':'transparent', color:tab===t?'#3C3489':'#888', fontWeight:tab===t?600:400, cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
            {t==='solo' ? '👤 Solo' : '👥 Sozial'}
          </button>
        ))}
      </div>
      {list.map(q => {
        const qs = state.quests[q.id] || { active:false, prog:0 }
        const completed = qs.prog >= q.total && !qs.active
        const pct = q.total > 1 ? Math.round((qs.prog||0)/q.total*100) : 0
        return (
          <div key={q.id} style={qs.active ? S.cardHL : S.card}>
            <div style={{ display:'flex', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{q.icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600 }}>{q.title}</div>
                <div style={{ fontSize:12, color:'#888', marginTop:2, lineHeight:1.4 }}>{q.desc}</div>
              </div>
            </div>
            {qs.active && q.total > 1 && <>
              <div style={S.progWrap}><div style={{ ...S.progBar, width:pct+'%' }} /></div>
              <div style={{ fontSize:11, color:'#aaa', marginTop:4, marginBottom:6 }}>{qs.prog} / {q.total} Tage</div>
            </>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
              <span style={{ fontSize:11, padding:'2px 9px', borderRadius:99, background:DIFF_COLOR[q.diff], color:DIFF_TEXT[q.diff], fontWeight:500 }}>{DIFF_LABEL[q.diff]}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={S.bPurple}>+{q.xp} XP</span>
                {completed
                  ? <span style={{ ...S.btnSm, ...S.btnDone }}>Abgeschlossen ✓</span>
                  : <button onClick={() => onToggleQuest(q)} style={{ ...S.btnSm, ...(qs.active?S.btnActive:{}) }}>
                      {!qs.active ? 'Starten' : q.total===1 ? 'Abschließen ✓' : 'Fortschritt +1'}
                    </button>
                }
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PageMindset({ todayQuote }) {
  const [gi, setGi] = useState(0); const [pi, setPi] = useState(0)
  return (
    <div>
      <div style={S.secTitle}>💬 Tages-Quote</div>
      <div style={{ background:'linear-gradient(135deg,#F0EFFE,#EEF0FF)', borderLeft:'3px solid #7F77DD', borderRadius:14, padding:'1.1rem 1.25rem', marginBottom:10 }}>
        <div style={{ fontSize:15, fontStyle:'italic', lineHeight:1.7 }}>"{todayQuote.text}"</div>
        <div style={{ fontSize:12, color:'#888', marginTop:8 }}>— {todayQuote.author}</div>
      </div>
      <div style={S.secTitle}>🎩 Gentleman-Tipps</div>
      <div style={S.card}>
        <div style={{ display:'flex', gap:12 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{GENT_TIPS[gi].icon}</span>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>{GENT_TIPS[gi].title}</div>
            <div style={{ fontSize:13, color:'#555', marginTop:4, lineHeight:1.6 }}>{GENT_TIPS[gi].body}</div>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={S.btnSm} onClick={() => setGi(i => (i-1+GENT_TIPS.length)%GENT_TIPS.length)}>← Vorheriger</button>
          <span style={{ fontSize:11, color:'#ccc', alignSelf:'center' }}>{gi+1} / {GENT_TIPS.length}</span>
          <button style={S.btnSm} onClick={() => setGi(i => (i+1)%GENT_TIPS.length)}>Nächster →</button>
        </div>
      </div>
      <div style={S.secTitle}>🌿 Inner Peace</div>
      <div style={S.card}>
        <div style={{ display:'flex', gap:12 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{PEACE_TIPS[pi].icon}</span>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>{PEACE_TIPS[pi].title}</div>
            <div style={{ fontSize:13, color:'#555', marginTop:4, lineHeight:1.6 }}>{PEACE_TIPS[pi].body}</div>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={S.btnSm} onClick={() => setPi(i => (i-1+PEACE_TIPS.length)%PEACE_TIPS.length)}>← Vorheriger</button>
          <span style={{ fontSize:11, color:'#ccc', alignSelf:'center' }}>{pi+1} / {PEACE_TIPS.length}</span>
          <button style={S.btnSm} onClick={() => setPi(i => (i+1)%PEACE_TIPS.length)}>Nächster →</button>
        </div>
      </div>
      <div style={S.secTitle}>📖 Alle Quotes</div>
      {QUOTES.map((q,i) => (
        <div key={i} style={{ ...S.card, borderLeft:'2px solid #ebebeb' }}>
          <div style={{ fontSize:13, fontStyle:'italic', color:'#333', lineHeight:1.6 }}>"{q.text}"</div>
          <div style={{ fontSize:11, color:'#bbb', marginTop:5 }}>— {q.author}</div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('today')
  const [state, setState] = useState(initialState)
  const [toast, setToast] = useState('')
  const dailyQuests = useMemo(() => getDailyQuests(), [])
  const todayQuote = useMemo(() => { const seed = new Date().toDateString().split('').reduce((a,c)=>a+c.charCodeAt(0),0); return QUOTES[seed%QUOTES.length] }, [])

  useEffect(() => { saveState(state) }, [state])

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(''), 2500) }

  function gainXP(amount, statKey) {
    setState(prev => {
      let { xp, maxXp, level, ...rest } = prev
      xp += amount
      if (statKey) rest[statKey] = (rest[statKey]||1)+1
      while (xp >= maxXp && level < 5) { xp -= maxXp; level++; maxXp = Math.round(maxXp*1.6) }
      return { ...prev, xp, maxXp, level, ...rest }
    })
  }

  function checkHabit(h) {
    if (state.doneTodayIds.includes(h.id)) return
    setState(prev => ({ ...prev, doneTodayIds:[...prev.doneTodayIds, h.id] }))
    gainXP(h.xp, h.stat); showToast('✨ +'+h.xp+' XP – '+h.name+' erledigt!')
  }

  function doDailyQuest(q) {
    if ((state.doneDailyIds||[]).includes(q.id)) return
    setState(prev => ({ ...prev, doneDailyIds:[...(prev.doneDailyIds||[]), q.id] }))
    gainXP(q.xp, 'dis'); showToast('⚡ +'+q.xp+' XP – Daily Quest erledigt!')
  }

  function togglePreset(id) {
    setState(prev => ({ ...prev, activeHabits: prev.activeHabits.includes(id) ? prev.activeHabits.filter(x=>x!==id) : [...prev.activeHabits, id] }))
  }

  function addCustom(h) { setState(prev => ({ ...prev, customHabits:[...prev.customHabits, h], activeHabits:[...prev.activeHabits, h.id] })); showToast('Habit erstellt!') }
  function deleteCustom(id) { setState(prev => ({ ...prev, customHabits:prev.customHabits.filter(h=>h.id!==id), activeHabits:prev.activeHabits.filter(x=>x!==id) })) }

  function toggleQuest(quest) {
    setState(prev => {
      const qs = prev.quests[quest.id] || { active:false, prog:0 }
      let updated
      if (!qs.active) { updated = { active:true, prog:0 }; showToast('Quest gestartet: '+quest.title) }
      else if (quest.total === 1) { updated = { active:false, prog:1 }; gainXP(quest.xp, 'dis'); showToast('🏆 Quest abgeschlossen! +'+quest.xp+' XP') }
      else {
        const prog = Math.min((qs.prog||0)+1, quest.total)
        if (prog >= quest.total) { updated = { active:false, prog }; gainXP(quest.xp, 'dis'); showToast('🏆 Quest abgeschlossen! +'+quest.xp+' XP') }
        else { updated = { active:true, prog }; showToast('Fortschritt: '+prog+'/'+quest.total) }
      }
      return { ...prev, quests:{ ...prev.quests, [quest.id]:updated } }
    })
  }

  function addGoal(g) { setState(prev => ({ ...prev, goals:[...(prev.goals||[]), g] })); showToast('Ziel gespeichert! 🎯') }
  function deleteGoal(id) { setState(prev => ({ ...prev, goals:(prev.goals||[]).filter(g=>g.id!==id) })) }
  function toggleGoalDone(id) {
    setState(prev => ({ ...prev, goals:(prev.goals||[]).map(g=>g.id===id?{...g,done:!g.done}:g) }))
    gainXP(50, 'dis'); showToast('Ziel erreicht! +50 XP 🎉')
  }

  const allHabits = [...PRESET_HABITS, ...state.customHabits]
  const allQuests = [...SOLO_QUESTS, ...SOCIAL_QUESTS]
  const activeQuests = allQuests.filter(q=>state.quests[q.id]?.active).map(q=>({...q, prog:state.quests[q.id]?.prog||0}))
  const NAV = [{ id:'today',label:'Heute',icon:'🏠'},{ id:'habits',label:'Habits',icon:'✅'},{ id:'goals',label:'Ziele',icon:'🎯'},{ id:'quests',label:'Quests',icon:'⚔️'},{ id:'mindset',label:'Mindset',icon:'🔥'}]

  return (
    <div style={{ maxWidth:440, margin:'0 auto', padding:'1rem', paddingBottom:90, fontFamily:'-apple-system,system-ui,sans-serif', color:'#1a1a1a', minHeight:'100vh', background:'#f9f9fb' }}>
      {toast && <div style={{ background:'linear-gradient(135deg,#9B8FFF,#534AB7)', color:'white', padding:'9px 18px', borderRadius:99, fontSize:13, fontWeight:500, textAlign:'center', marginBottom:12, boxShadow:'0 2px 12px rgba(127,119,221,.3)' }}>{toast}</div>}
      <div style={{ display:'flex', background:'#fff', border:'0.5px solid #ebebeb', borderRadius:14, padding:4, gap:3, marginBottom:16, boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={()=>setPage(n.id)} style={{ flex:1, padding:'7px 2px', border:'none', borderRadius:10, background:page===n.id?'#F0EFFE':'transparent', cursor:'pointer', fontSize:10, color:page===n.id?'#534AB7':'#bbb', fontWeight:page===n.id?700:400, display:'flex', flexDirection:'column', alignItems:'center', gap:3, fontFamily:'inherit' }}>
            <span style={{ fontSize:17 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
      {page==='today'   && <PageToday   state={state} allHabits={allHabits} onCheck={checkHabit} activeQuests={activeQuests} onDailyDone={doDailyQuest} dailyQuests={dailyQuests} />}
      {page==='habits'  && <PageHabits  state={state} onTogglePreset={togglePreset} onAddCustom={addCustom} onDeleteCustom={deleteCustom} />}
      {page==='goals'   && <PageGoals   state={state} onAddGoal={addGoal} onDeleteGoal={deleteGoal} onToggleDone={toggleGoalDone} />}
      {page==='quests'  && <PageQuests  state={state} onToggleQuest={toggleQuest} />}
      {page==='mindset' && <PageMindset todayQuote={todayQuote} />}
    </div>
  )
}