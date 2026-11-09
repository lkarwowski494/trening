# Narzędzia partii A2 (Python) — kopia robocza sesji B #1, 08.11.2026

`<SCRATCH>` = katalog roboczy sesji (do podmiany); `<SCRATCH>/bad` = pliki badań z `git show origin/badania/<gałąź>:<plik>`. Kolejność: `run_a2.sh` (od commitu bazy gałęzi: importer → sprzątanie Hack Squat → post → fixture → gen.mjs → zrodla-runtime --write).

## ext.py

```python
import re,json,glob,os
B='<SCRATCH>/bad'
def blocks(path):
    t=open(path).read(); out=[]
    for m in re.finditer(r'```json\n(.*?)\n```',t,re.S):
        try: out.append((m.start(),json.loads(m.group(1))))
        except Exception as e: out.append((m.start(),('ERR',str(e)[:80],m.group(1)[:60])))
    return t,out
def files():
    return sorted(glob.glob(B+'/*/docs/research/wskazowki-fala-w*/*.md'))
```

## tabs.py

```python
import re,os,json
from ext import *
def cells(l): return [c.strip() for c in l.strip().strip('|').split('|')]
def tables(t):
    L=t.split('\n'); i=0
    while i<len(L):
        if L[i].startswith('|') and i+1<len(L) and re.match(r'^\|\s*:?-',L[i+1]):
            h=[x.lower() for x in cells(L[i])]; rows=[]; j=i+2
            while j<len(L) and L[j].startswith('|'): rows.append(cells(L[j])); j+=1
            yield h,rows; i=j
        else: i+=1
def clean_id(x):
    m=re.match(r'^\s*`([^`]+)`',x)
    if m: return m.group(1).strip()
    return re.sub(r'\s*\((NOWE|nowe|propozycja)\)','',x).replace('`','').replace('*','').strip()
# kolejność: W1 (g4, lokalne) potem W2 — W2 nadpisuje
def order(files):
    return sorted(files,key=lambda f:(0 if '/g4-nogi/' in f or '/lokalne-0211/' in f else 1, f))
def sentences():
    out={}
    for f in order(files()):
        for h,rows in tables(open(f).read()):
            if h and h[0].startswith('id') and len(h)>2 and h[1]=='pl' and h[2].startswith('en'):
                for r in rows:
                    if len(r)>=3: out.setdefault(clean_id(r[0]),[]).append((r[1],r[2],os.path.relpath(f,B)))
    return out
def sources():
    out={}
    for f in order(files()):
        t=open(f).read()
        for h,rows in tables(t):
            if h and h[0].startswith('id') and any('adres' in x for x in h) and any('organizacja' in x for x in h) and any('szczebel' in x for x in h):
                ia=[i for i,x in enumerate(h) if 'adres' in x][0]; io=[i for i,x in enumerate(h) if 'organizacja' in x][0]; il=[i for i,x in enumerate(h) if 'szczebel' in x][0]
                for r in rows:
                    if len(r)>max(ia,io,il): out.setdefault(clean_id(r[0]),[]).append(dict(url=r[ia],org=r[io],lvl=r[il],row=' | '.join(r),f=os.path.relpath(f,B)))
        for _,b in blocks(f)[1]:
            if not isinstance(b,dict): continue
            src=b.get('sources') if isinstance(b.get('sources'),dict) else None
            if src is None and b and all(isinstance(v,dict) and 'org' in v for v in b.values()): src=b
            if src:
                for k,v in src.items(): out.setdefault(k,[]).append(dict(url=v.get('url',''),org=v.get('org',''),lvl=str(v.get('level','')),json=v,orgs=b.get('orgs',{}),f=os.path.relpath(f,B)))
    return out
```

## cards.py

```python
import json,os
from tabs import *
L=json.load(open(B+'/../lista-a2.json'))
FAM=['calf_raise','glute_floor','hip_abd_add','hip_bridge','kneeling_hinge','leg_isolation','leg_machine','lunge']
TARGET={k:f for f in FAM for k in L[f]['brak']}
SECS=['setup','move','tips','mistakes']
def exblocks(f):
    out=[]; t,bl=blocks(f)
    cut=t.find('Blok do wdrożenia (po przeliczeniu') if f.endswith('lunge.md') and '/lokalne-0211/' in f else -1
    for pos,b in bl:
        if pos<cut: continue
        if not isinstance(b,dict): continue
        if 'exercises' in b and isinstance(b['exercises'],dict): b=b['exercises']
        for k,v in b.items():
            if isinstance(v,dict) and any(s in v for s in SECS): out.append((k,v))
    return out
W1={'g4-nogi/docs/research/wskazowki-fala-w1/przeliczenie-szczebli-2026-11-02.md','lokalne-0211/docs/research/wskazowki-fala-w1/lunge.md'}
base={};w2={};other={}
for f in files():
    r=os.path.relpath(f,B)
    for k,v in exblocks(f):
        if r in W1:
            if r.endswith('lunge.md'):
                # tylko blok po przeliczeniu (ostatni wystąpienie)
                pass
            base[k]=(v,r)
        elif '/w2-' in '/'+r.split('/')[0] or r.startswith('w2-'): w2[k]=(v,r)
        else: other.setdefault(k,[]).append(r)
cards={};src={}
for k in TARGET:
    if k in w2 and (w2[k][0].get('setup') or w2[k][0].get('move')):
        cards[k]={s:list(w2[k][0].get(s,[])) for s in SECS}; src[k]=[w2[k][1]]
    elif k in base:
        cards[k]={s:list(base[k][0].get(s,[])) for s in SECS}; src[k]=[base[k][1]]
        if k in w2:
            cards[k]['mistakes']+=w2[k][0].get('mistakes',[]); src[k].append(w2[k][1])
    elif k in w2: print('W2 tylko błędy bez bazy:',k)
```

## import_a2.py

```python
import json,re,glob,sys
from cards import *
WT='/home/user/trening/'; ST=B+'/../stan/'; import os; os.makedirs(ST,exist_ok=True)
def rd(f): return json.load(open(WT+f))
def wr(f,d,ind=1): open(WT+f,'w').write(json.dumps(d,ensure_ascii=False,indent=ind)+'\n')
cues=rd('data/zrodla/cues.json'); pl=rd('lib/cues/text/pl.json'); en=rd('lib/cues/text/en.json')
S=sentences(); R=sources()
# źródła warunkowe bez rozstrzygnięcia (docs/18 do 08.11.2026) — nie liczą się, odwołania usunięte z kart
WARUNKOWE={'ama-curtsy':'AMA — szczebel nierozstrzygnięty (STAN-w2-ramiona pkt szczebli)','canfitpro-curtsey':'canfitpro — szczebel nierozstrzygnięty (brak w szczeble-organizacji)',
 'bos-hip-thrust-machine':'Bells of Steel — rozbieżne oceny, reguła nierozstrzygnięta (STAN-w2-nogi pkt 2)','rts-valslide-leg-curl':'Robertson Training Systems — zakres certyfikacji do potwierdzenia (W1)',
 'nfpt-leg-extensions':'NFPT (strona leg extensions) — wiązanie ramki autora z kwalifikacjami niepotwierdzone na stronie (leg_isolation.md W2: „4 warunkowo”)'}
ORG={'ace':'ACE','nasm':'NASM','issa':'ISSA','catalyst':'Catalyst Athletics','barbend':'BarBend','bodylastics':'Bodylastics','hss':'HSS','nsca':'NSCA','nfpt':'NFPT',
 'ncsf':'NCSF','nismat':'NISMAT','hoist':'Hoist Fitness','staywell':'WebMD Ignite','ph':'Thera-Band','theraband':'Thera-Band','hk':'Human Kinetics'}
NEWORG={'NCSF':{'name':'National Council on Strength and Fitness — blog szkoleniowy (ncsf.org)','level':4,'kind':'org'},
 'NISMAT':{'name':'NISMAT — instytut medycyny sportowej przy szpitalu Lenox Hill (materiał edukacyjny placówki; nismat.org)','level':4,'kind':'site'},
 'Hoist Fitness':{'name':'Hoist Fitness — instrukcje własnych maszyn (producent maszyn; przy maszynie innego producenta — uproszczenie)','level':4,'kind':'maker'},
 'Thera-Band':{'name':'Thera-Band (Performance Health) — instrukcje ćwiczeń z gumami (producent gum)','level':4,'kind':'maker'},
 'Human Kinetics':{'name':'Human Kinetics — fragmenty książek o treningu (us.humankinetics.com)','level':4,'kind':'site','warunkowo':'fragment książki, którego autor jest trenerem z kwalifikacjami; strona bez takiego autora — szczebel 5 (docs/18, 02.11.2026, uzupełnienie 2)'}}
def org_of(sid): return ORG.get(sid.split('-')[0])
def lvl(sid):
    if sid in cues['sources']:
        e=cues['sources'][sid]; return e.get('level',cues['orgs'][e['org']]['level']), e['org']
    o=org_of(sid); o2=o if o in cues['orgs'] or o in NEWORG else None
    return (NEWORG.get(o) or cues['orgs'].get(o) or {}).get('level',9), o
LOG={'odrzucone':[],'usunieteOdwolania':[],'bezRuchu':[],'bezBleduZPozami':[]}
final={}
for k,c in cards.items():
    m={}
    for s in SECS:
        keep=[]
        for x in c[s]:
            refs=[]
            for r in x['s']:
                if r[0] in WARUNKOWE: LOG['usunieteOdwolania'].append([k,x['c'],r[0]]); continue
                refs.append(r)
            orgs={lvl(a)[1] for a,*_ in refs if a!='wniosek' and lvl(a)[0]<=4}
            y=dict(x); y['s']=[a for a in refs if a[0]!='wniosek']
            if len(orgs)>=2: keep.append(y)
            else: LOG['odrzucone'].append([k,s,x['c'],sorted(o for o in orgs if o)])
        m[s]=keep
    if not m['setup'] or not m['move']: LOG['bezRuchu'].append(k); continue
    final[k]=m
POSES=set()
for f in glob.glob(WT+'lib/figures/v2/poses/*.json'): POSES|=set(json.load(open(f))['cwiczenia'])
for k in [k for k,m in final.items() if k in POSES and not m['mistakes']]: LOG['bezBleduZPozami'].append(k); del final[k]
# animowany błąd w pozach v2 musi być błędem karty (lib/figures/v2/contract.ts:448 „blad-cue”); zmiana póz należy do partii figur B2 — karta czeka
LOG['konfliktPozy']=[]
for f in glob.glob(WT+'lib/figures/v2/poses/*.json'):
    for k,p in json.load(open(f))['cwiczenia'].items():
        if k in final:
            mis={x['c'] for x in final[k]['mistakes']}; zle=[b['cue'] for b in p.get('bledy',[]) if b['cue'] not in mis]
            if zle: LOG['konfliktPozy'].append([k,zle]); del final[k]
# źródła
added=[]; need=sorted({a for m in final.values() for s in m.values() for x in s for a,*_ in x['s']})
for sid in need:
    if sid in cues['sources']: continue
    r=R[sid][-1]; o=org_of(sid)
    if not o: raise SystemExit('nieznana organizacja '+sid+' '+r['org'])
    if o not in cues['orgs']: cues['orgs'][o]=NEWORG[o]
    url=r['url'].split(' ')[0].strip('<>`')
    if not url.startswith('https://'):
        # adres z innego wiersza tego id
        for q in R[sid]:
            u=q['url'].split(' ')[0].strip('<>`')
            if u.startswith('https://'): url=u
    t=url.rstrip('/').split('/')[-1] or sid
    ent={'org':o,'title':re.sub(r'[-_]',' ',re.sub(r'\.(html?|pdf)$','',t)),'url':url}
    ent["level"]=cues["orgs"][o]["level"]
    if 'warunkowo' in cues['orgs'][o]:
        ent['level']=4; ent['strona']=('odczyt 02.11.2026: '+re.sub(r'\s+',' ',r.get('row',r['lvl'])))[:420]
    cues['sources'][sid]=ent; added.append(sid)
# zdania
newids=[]
for m in final.values():
    for s in m.values():
        for x in s:
            c=x['c']
            if c in pl: continue
            if c not in S: raise SystemExit('brak tekstu '+c)
            p,e,_=S[c][-1]; pl[c]=p.strip().strip('„”"'); en[c]=e.strip().strip('"'); newids.append(c)
for k,m in final.items():
    cues['exercises'][k]={s:m[s] for s in SECS if m[s]}
    cues['open'].pop(k,None)
    x=cues['exercises'][k]
    if len(x.get('tips',[]))<2 and k not in cues['partial']: cues['partial'].append(k)
srt=lambda d:dict(sorted(d.items()))
wr('data/zrodla/cues.json',cues); wr('lib/cues/text/pl.json',srt(pl) if list(rd('lib/cues/text/pl.json'))==sorted(rd('lib/cues/text/pl.json')) else pl); wr('lib/cues/text/en.json',srt(en) if list(rd('lib/cues/text/en.json'))==sorted(rd('lib/cues/text/en.json')) else en)
json.dump({'kart':list(final),'zdania':sorted(set(newids)),'zrodla':added,**LOG},open(ST+'import-a2.json','w'),ensure_ascii=False,indent=1)
print(len(final),'kart',len(set(newids)),'zdań',len(added),'źródeł'); print({k:len(v) for k,v in LOG.items()})
```

## post_a2.py

```python
import json
W='/home/user/trening/'; ST='<SCRATCH>/stan/'
c=json.load(open(ST+'import-a2.json')); d=json.load(open(W+'data/zrodla/cues.json'))
K=c['kart']
f=W+'data/zrodla/figures.json'; g=json.load(open(f)); fig_added=[]
for k in K:
    if k not in g['exercises']:
        g['open'][k]="Figura v1 (etap 1) nie powstaje: ćwiczenie ma kartę własną z partii A2 integracji badań (08.11.2026), a rysunek należy do rodziny figur v2 albo czeka na figurę v2 (partia B2) — karta ukryta do recenzji niezależnej."; fig_added.append(k)
open(f,'w').write(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
f=W+'data/zrodla/wskazowki-ogolne.json'; g=json.load(open(f)); prz=[k for k in K if k in g['przypisania']]
for k in K: g['przypisania'].pop(k,None)
open(f,'w').write(json.dumps(g,ensure_ascii=False,indent=1)+'\n')
f=W+'lib/figures/v2/cue-sets.json'; g=json.load(open(f)); prev={k:g['items'].get(k) for k in K}
for k in K: g['items'][k]={'b':'own'}
open(f,'w').write(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
json.dump({'figOpen':fig_added,'przypisania':prz,'cueSetsPrzed':prev},open(ST+'post-a2.json','w'),ensure_ascii=False,indent=1)
print(len(K),'fig open',len(fig_added),'przypisania',len(prz),{v['b'] if v else None for v in prev.values()})
```

## fx_a2.py

```python
import json
W='/home/user/trening/'; ST='<SCRATCH>/stan/'
c=json.load(open(ST+'import-a2.json')); d=json.load(open(W+'data/zrodla/cues.json'))
pl=json.load(open(W+'lib/cues/text/pl.json')); en=json.load(open(W+'lib/cues/text/en.json'))
K=c['kart']; part=[k for k in K if len(d['exercises'][k].get('tips',[]))<2]
fx={"_opis":"Partia A2 integracji badań (nogi i biodra: calf_raise, glute_floor, hip_abd_add, hip_bridge, leg_isolation, leg_machine, lunge; linia 1.1, 08.11.2026): ćwiczenia z nowymi kartami własnymi, karty niepełne (partial), nowe zdania, błędy i zdania odrzucone (mniej niż dwie organizacje szczebla ≤ 4 — także błędy wnioskowane) oraz odwołania do źródeł o nierozstrzygniętym szczeblu (usunięte z kart). Źródło: badania W1 (badania/g4-nogi — tylko blok po przeliczeniu szczebli; badania/lokalne-0211 lunge.md — blok po przeliczeniu) i W2 (badania/w2-nogi, badania/w2-ramiona lunge.md) z 02.11.2026. Hack Squat: dotychczasowa karta ukryta „do poprawy” zastąpiona kartą W2 (zdanie hack.setup i źródło ExRx usunięte jako nieużywane). Niewdrożone: karty, których animowany błąd w pozach v2 nie jest błędem karty (konfliktPozy — zmiana póz należy do partii figur B2: wykroki z lunge.mis.kneeIn, Slider Hamstring Curl z ht.mis.arch), Machine Hip Thrust i Curtsy Lunge (po odrzuceniu zdań bez dwóch organizacji brak ustawienia albo ruchu), Cable Hip Adduction i Smith Machine Hip Thrust (bez błędu przy pozach v2 — decyzja z 02.11.2026), ćwiczenia bez bloku w badaniach (otwarte), squat i hinge (rodziny ready na zrecenzowanych zestawach ogólnych — karta własna byłaby ukryta do recenzji i obniżyłaby pokrycie; osobna partia), błędy W2 dla istniejących kart (zmiana karty = ponowna recenzja).",
 "rodzina":"nogi","cwiczenia":K,"partial":part,"zdania":c['zdania'],"zastapione":["Hack Squat"],
 "odrzucone":c['odrzucone'],"usunieteOdwolania":c['usunieteOdwolania'],"bezUstawieniaLubRuchu":c['bezRuchu'],"pominieteBezBledu":c['bezBleduZPozami'],"konfliktPozy":c['konfliktPozy'],"noweZrodla":c['zrodla']}
open(W+'tests/fixtures/cues-a2-nogi.json','w').write(json.dumps(fx,ensure_ascii=False,indent=1)+'\n')
z={"_opis":"Zdania wskazówek techniki z partii A2 (nogi i biodra; linia 1.1, 08.11.2026) czekające na przekład na 33 języki poza PL i EN (workflow przeklad-tlumaczen.yml; wymaga zgody właściciela — koszt). Do czasu przekładu aplikacja pokazuje angielski (cueText: język → angielski → polski); wyjątek testu kompletności tests/cues.test.tsx. Po przekładzie: dopisać zdania do lib/cues/text/<język>.json i usunąć wpisy (pusta lista = brak wyjątków).","data":"2026-11-08","klucze":[{"rodzaj":"nowy","id":i,"pl":pl[i],"en":en[i]} for i in sorted(c['zdania'])]}
open(W+'docs/lokalizacja/zestaw-przekladu-2026-11-08-a2-wskazowki.json','w').write(json.dumps(z,ensure_ascii=False,indent=2)+'\n')
print(len(K),len(part),len(c['zdania']))
```

## run_a2.sh

```bash
set -e
cd /home/user/trening
git checkout 391af68 -- data/zrodla lib/cues lib/figures docs/research/27-wskazowki-zrodla.md lib/muscleRoles lib/i18n.en.ts
T=<SCRATCH>/tools
python3 $T/import_a2.py
python3 - <<'PY'
import json,glob
for f in glob.glob('lib/cues/text/*.json'):
    d=json.load(open(f))
    if 'hack.setup' in d:
        raw=open(f).read(); ind=1 if raw.startswith('{\n "') else 2
        del d['hack.setup']; open(f,'w').write(json.dumps(d,ensure_ascii=False,indent=ind)+'\n')
c=json.load(open('data/zrodla/cues.json')); c['sources'].pop('exrx-Quadriceps/SLHackSquat',None); open('data/zrodla/cues.json','w').write(json.dumps(c,ensure_ascii=False,indent=1)+'\n')
PY
python3 $T/post_a2.py
python3 $T/fx_a2.py
node scripts/cues/gen.mjs
node scripts/zrodla-runtime.mjs --write | tail -1
node scripts/cues/gen.mjs --check && echo CHECK-OK
```
