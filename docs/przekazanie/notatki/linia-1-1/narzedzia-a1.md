# Narzędzia partii A1 (Python) — kopia robocza koordynatora 08.11.2026

Ścieżki /home/user/... są lokalne — do podmiany. Punkt wyjścia importera partii tekstu, nie wymóg.

## ext.py

```python
import re,json,glob,os,sys
B='/home/user/stan-a1/badania'
def blocks(path):
    t=open(path).read()
    out=[]
    for m in re.finditer(r'```json\n(.*?)\n```',t,re.S):
        try: out.append((m.start(),json.loads(m.group(1))))
        except Exception as e: out.append((m.start(),('ERR',str(e)[:80],m.group(1)[:60])))
    return t,out
if __name__=='__main__':
    for f in sorted(glob.glob(B+'/*/docs/research/wskazowki-fala-w*/*.md')):
        t,bl=blocks(f)
        print(os.path.relpath(f,B)[:70],[ (len(b) if isinstance(b,dict) else b) for _,b in bl], [list(b)[:3] if isinstance(b,dict) else 0 for _,b in bl][:2])
```

## tabs.py

```python
import sys,glob,os,re,json
sys.path.insert(0,'/home/user/stan-a1/tools')
from ext import *
def cells(l): return [c.strip() for c in l.strip().strip('|').split('|')]
def tables(t):
    L=t.split('\n'); i=0
    while i<len(L):
        if L[i].startswith('|') and i+1<len(L) and re.match(r'^\|\s*-',L[i+1]):
            h=[x.lower() for x in cells(L[i])]; rows=[]; j=i+2
            while j<len(L) and L[j].startswith('|'): rows.append(cells(L[j])); j+=1
            yield h,rows; i=j
        else: i+=1
def allfiles():
    # W1 first, W2 later (nadpisuje)
    return sorted(glob.glob(B+'/g5-pchanie/docs/research/wskazowki-fala-w1/*.md'))+sorted(glob.glob(B+'/w2-pchanie/docs/research/wskazowki-fala-w2/*.md'))
def sentences():
    out={}
    for f in allfiles():
        for h,rows in tables(open(f).read()):
            if h[:2]==['id','pl'] and h[2].startswith('en'):
                for r in rows:
                    if len(r)>=3: out[r[0].strip('`')]=(r[1],r[2],os.path.basename(f))
    return out
def sources():
    out={}
    for f in allfiles():
        for h,rows in tables(open(f).read()):
            if h[:3]==['id','adres','organizacja']:
                for r in rows:
                    if len(r)>=4: out[re.sub(r' \(NOWE\)','',r[0]).strip('`')]=dict(url=r[1],org=r[2],lvl=r[3],f=os.path.basename(f))
    return out
```

## pick.py

```python
import sys,glob,os,json
sys.path.insert(0,'/home/user/stan-a1/tools')
from ext import *
def get(rel,name,idx=None):
    t,bl=blocks(B+'/'+rel)
    r=[b[name] for _,b in bl if isinstance(b,dict) and name in b]
    return r[-1] if idx is None else r[idx]
W1='g5-pchanie/docs/research/wskazowki-fala-w1/'; W2='w2-pchanie/docs/research/wskazowki-fala-w2/'
PICK={
 'Arnold Press':W1+'przeliczenie-szczebli-2026-11-02.md',
 'Seated Barbell Military Press':W1+'przeliczenie-szczebli-2026-11-02.md',
 'Kettlebell Press':W2+'overhead_press-cz2.md',
 'Kettlebell Seated Press':W2+'overhead_press-cz2.md',
 'Band Shoulder Press':W2+'overhead_press.md',
 'Single Arm Overhead Press (hantel)':W2+'overhead_press.md',
 'Landmine Press':W2+'overhead_press.md',
 'Ab Wheel':W2+'pushup_plank-cz2.md','Renegade Row':W2+'pushup_plank-cz2.md',
 'Rollout (sztanga)':W1+'pushup_plank-cz2.md',
 'Band Chest Fly':W2+'chest_fly-cz1.md',
 'Incline Chest Fly (hantle)':W2+'chest_fly-cz1.md','Pullover (hantel)':W2+'chest_fly-cz2.md',
 'Chest Dip':W2+'dip.md','Seated Cable Chest Press':W2+'cable_press.md',
 'Decline Push Up':W2+'pushup_plank-cz1.md','Suspended Push-Up':W2+'pushup_plank-cz1.md','Suspended Fallout':W2+'pushup_plank-cz3.md',
}
cards={k:get(v,k) for k,v in PICK.items()}
if __name__=='__main__':
    for k,c in cards.items():
        print('##',k,{s:[x['c'] for x in c.get(s,[])] for s in c if isinstance(c[s],list)}, {s:str(c[s])[:200] for s in c if not isinstance(c[s],list)})
```

## cand.py

```python
import sys,glob,os,json
sys.path.insert(0,'/home/user/stan-a1/tools')
from ext import *
lst={x['nazwa'] for x in json.load(open('/home/user/stan-a1/lista-a1.json'))}
cand={}
for f in sorted(glob.glob(B+'/*/docs/research/wskazowki-fala-w*/*.md')):
    t,bl=blocks(f)
    for pos,b in bl:
        if not isinstance(b,dict): continue
        for k,v in b.items():
            cand.setdefault(k,[]).append((os.path.relpath(f,B).split('/docs/research/')[1],pos))
for k,v in cand.items():
    print('LIST' if k in lst else 'repo', k, [a for a,_ in v])
print('listy bez bloku:', len(lst-set(cand)))
```

## import_cards.py

```python
import sys,json,re
sys.path.insert(0,'/home/user/stan-a1/tools')
from tabs import *; from pick import *
WT='/home/user/wt-a1/'
def rd(f): return json.load(open(WT+f))
def wr(f,d): open(WT+f,'w').write(json.dumps(d,ensure_ascii=False,indent=1)+'\n')
cues=rd('data/zrodla/cues.json'); pl=rd('lib/cues/text/pl.json'); en=rd('lib/cues/text/en.json')
S=sentences(); R=sources()
SECS=['setup','move','tips','mistakes']
# bazy W1 dla kart, gdzie W2 daje tylko błędy
BASE={'Landmine Press':W1+'przeliczenie-szczebli-2026-11-02.md','Band Chest Fly':W1+'przeliczenie-szczebli-2026-11-02.md','Ab Wheel':W1+'pushup_plank-cz2.md','Renegade Row':W1+'pushup_plank-cz2.md'}
final={}
for k,c in cards.items():
    if k in BASE:
        b=get(BASE[k],k); m={s:list(b.get(s,[])) for s in SECS}
        for x in c.get('mistakes',[]):
            m['mistakes'].append(x)
        if c.get('setup') or c.get('move'): raise SystemExit('W2 ma setup: '+k)
        for s in SECS: pass
        final[k]=m
    else:
        final[k]={s:list(c.get(s,[])) for s in SECS}
DROPPED=[]
def lvl_of(sid):
    r=R.get(sid); 
    if sid in cues['sources']:
        e=cues['sources'][sid]; return e.get('level', cues['orgs'][e['org']]['level']), e['org']
    return int(re.match(r'\**(\d)',r['lvl']).group(1)), r['org'][:20]
for k,m in final.items():
    keep=[]
    for x in m['mistakes']:
        orgs={lvl_of(a)[1] for a,_ in x['s'] if a!='wniosek' and lvl_of(a)[0]<=4}
        if len(orgs)>=2: keep.append(x)
        else: DROPPED.append((k,x['c']))
    m['mistakes']=keep
import glob as _g
POSES=set()
for _f in _g.glob(WT+'lib/figures/v2/poses/*.json'): POSES|=set(json.load(open(_f))['cwiczenia'])
BEZ_BLEDU=[k for k,m in final.items() if k in POSES and not m['mistakes']]
for k in BEZ_BLEDU: del final[k]
json.dump(BEZ_BLEDU,open('/home/user/stan-a1/pominiete-bez-bledu.json','w'),ensure_ascii=False)
orgmap={'ACE':'ACE','BarBend':'BarBend','Bodylastics':'Bodylastics','Catalyst Athletics':'Catalyst Athletics','Cleveland Clinic':'Cleveland Clinic','Fitness Volt':'Fitness Volt','ISSA':'ISSA','Major Fitness':None,'NASM':'NASM','NFPT':'NFPT','The Prehab Guys':'The Prehab Guys','StrongFirst':'StrongFirst'}
NEWORG={'ColumbiaDoctors':{'name':'ColumbiaDoctors — biblioteka zdrowia (materiał WebMD Ignite, recenzja Clinical Review Board; columbiadoctors.org)','level':4,'kind':'site'},
 'Echelon Fitness':{'name':'Echelon Fitness — instrukcja ćwiczeń do własnego kółka (producent, PDF 2021)','level':4,'kind':'maker'},
 'Human Kinetics':{'name':'Human Kinetics — fragmenty książek o treningu (us.humankinetics.com)','level':4,'kind':'site','warunkowo':'fragment książki, którego autor jest trenerem z kwalifikacjami; strona bez takiego autora — szczebel 5 (docs/18, 02.11.2026, uzupełnienie 2)'},
 'OriGym':{'name':'OriGym — blog ośrodka szkolącego trenerów (origym.com)','level':4,'kind':'site','warunkowo':'artykuł z autorem z kwalifikacjami trenerskimi w biogramie i datą aktualizacji; bez nich — szczebel 5 (docs/18, 02.11.2026, uzupełnienie 3)'},
 'Thera-Band':{'name':'Thera-Band (Performance Health) — instrukcje ćwiczeń z gumami (producent gum)','level':4,'kind':'maker'},
 'GoodLife Fitness':{'name':'GoodLife Fitness — blog sieci klubów (blog.goodlifefitness.com)','level':4,'kind':'site','warunkowo':'artykuł z autorem z certyfikatem trenerskim i datą na stronie; bez autora lub daty — szczebel 5 (docs/18, 02.11.2026, uzupełnienie 3)'},
 'TRX':{'name':'TRX — blog producenta zawieszeń (trxtraining.com)','level':4,'kind':'maker'},
 'Cugliari, Boccia (badanie EMG)':{'name':'Cugliari, Boccia — badanie EMG w recenzowanym czasopiśmie, J Hum Kinet 2017','level':3,'kind':'study'},
 'NSCA — Exercise Technique Manual (Human Kinetics)':{'name':'NSCA — Exercise Technique Manual for Resistance Training, wyd. 4 (fragment u wydawcy Human Kinetics)','level':3,'kind':'org'}}
UNK=[]
def org_of(sid,r):
    t=r['org']
    if sid=='cugliari-2017': return 'Cugliari, Boccia (badanie EMG)'
    if sid=='nsca-etm4-one-arm-kb-press': return 'NSCA — Exercise Technique Manual (Human Kinetics)'
    if sid=='columbia-shoulder-press-band': return 'ColumbiaDoctors'
    if sid.startswith('goodlife'): return 'GoodLife Fitness'
    if sid.startswith('trx'): return 'TRX'
    if sid.startswith('therabend'): return 'Thera-Band'
    if sid.startswith('origym'): return 'OriGym'
    if sid.startswith('strongfirst'): return 'StrongFirst'
    if sid.startswith('hk-'): return 'Human Kinetics'
    if sid.startswith('echelon'): return 'Echelon Fitness'
    if sid.startswith('majorfitness'): return None
    for k in orgmap:
        if t.startswith(k) and orgmap[k]: return orgmap[k]
    UNK.append((sid,t[:150],r['lvl'][:60])); return 'UNK'
def title_of(sid,url):
    u=url.split(' ')[0].rstrip('/').split('/')[-1] or sid
    return re.sub(r'[-_]',' ',u)
need=set(sid for m in final.values() for s in m.values() for x in s for sid,_ in x['s'])
added_src=[];
for sid in sorted(need):
    if sid=='wniosek' or sid in cues['sources']: continue
    r=R[sid]; org=org_of(sid,r)
    if org is None: raise SystemExit('pominięte źródło '+sid)
    if org in NEWORG and org not in cues['orgs']: cues['orgs'][org]=NEWORG[org]
    url=r['url'].split(' ')[0]
    ent={'org':org,'title':title_of(sid,url),'url':url,'level':int(re.match(r'\**(\d)',r['lvl']).group(1))}
    if sid=='fv-decline-push-up': ent['url']='https://fitnessvolt.com/?p=75039'
    if 'warunkowo' in cues['orgs'][org]:
        st=re.sub(r'^\**\d\**\s*(\(warunkowo[^)]*\))?\s*[—:-]*\s*','',r['lvl']).strip()
        ent['strona']=('odczyt 02.11.2026: '+st)[:420]
    cues['sources'][sid]=ent; added_src.append(sid)
if UNK:
    for u in UNK: print(u)
    raise SystemExit('nieznane organizacje')
# zdania
newids=[]
for m in final.values():
    for s in m.values():
        for x in s:
            c=x['c']
            if c not in pl:
                if c not in S: raise SystemExit('brak zdania '+c)
                pl[c]=S[c][0]; en[c]=S[c][1]; newids.append(c)
for k,m in final.items():
    cues['exercises'][k]={s:m[s] for s in SECS if m[s]}
    if k in cues['open']: del cues['open'][k]
    x=cues['exercises'][k]
    if not (len(x.get('setup',[]))>=1 and len(x.get('move',[]))>=1 and len(x.get('tips',[]))>=2) and k not in cues['partial']: cues['partial'].append(k)
# sortuj klucze tekstów jak w pliku
pl=dict(sorted(pl.items())) if list(rd('lib/cues/text/pl.json'))==sorted(rd('lib/cues/text/pl.json')) else pl
en=dict(sorted(en.items())) if list(rd('lib/cues/text/en.json'))==sorted(rd('lib/cues/text/en.json')) else en
wr('data/zrodla/cues.json',cues); wr('lib/cues/text/pl.json',pl); wr('lib/cues/text/en.json',en)
json.dump({'kart':list(final),'zdania':sorted(set(newids)),'zrodla':added_src},open('/home/user/stan-a1/import-a1.json','w'),ensure_ascii=False,indent=1)
json.dump(DROPPED,open('/home/user/stan-a1/odrzucone-bledy.json','w'),ensure_ascii=False)
print(len(DROPPED),'odrzuconych błędów;',len(final),'kart',len(set(newids)),'zdań',len(added_src),'źródeł')
```

## post.py

```python
import json
W='/home/user/wt-a1/'
c=json.load(open('/home/user/stan-a1/import-a1.json')); d=json.load(open(W+'data/zrodla/cues.json'))
K=c['kart']
f=W+'data/zrodla/figures.json'; g=json.load(open(f))
for k in K: g['open'][k]="Figura v1 (etap 1) nie powstaje: ćwiczenie ma kartę własną z partii A1 integracji badań (08.11.2026), a rysunek należy do rodziny figur v2 albo czeka na figurę v2 (partia B1) — karta ukryta do recenzji niezależnej."
open(f,'w').write(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
f=W+'data/zrodla/wskazowki-ogolne.json'; g=json.load(open(f))
for k in K: g['przypisania'].pop(k,None)
open(f,'w').write(json.dumps(g,ensure_ascii=False,indent=1)+'\n')
f=W+'lib/figures/v2/cue-sets.json'; g=json.load(open(f))
for k in K: g['items'][k]={'b':'own'}
open(f,'w').write(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
part=[k for k in K if len(d['exercises'][k].get('tips',[]))<2]
fx={"_opis":"Partia A1 integracji badań (rodziny pchania: pushup_plank, overhead_press, chest_fly, dip, cable_press; linia 1.1, 08.11.2026): ćwiczenia z nowymi kartami własnymi, karty niepełne (partial), nowe zdania i błędy odrzucone. Źródło: badania W1 (badania/g5-pchanie) i W2 (badania/w2-pchanie) z 02.11.2026 po przeliczeniu szczebli. Niewdrożone: Cable Fly (low to high) (źródło szczebla 5 po korekcie 2), Svend Press i Plyo Push-Up (szczebel warunkowy), Landmine Press, Band Chest Fly, Pullover (hantel) i Suspended Fallout (po odrzuceniu błędów bez dwóch źródeł karta nie ma błędu, a ćwiczenie ma pozy v2 — decyzja z 02.11.2026), Pec Deck, Dip Machine, Triceps Dip, Ring Dips i pozostałe otwarte.",
 "rodzina":"pchanie","cwiczenia":K,"partial":part,"zdania":c['zdania'],"odrzuconeBledy":json.load(open('/home/user/stan-a1/odrzucone-bledy.json')),"pominieteBezBledu":json.load(open('/home/user/stan-a1/pominiete-bez-bledu.json'))}
open(W+'tests/fixtures/cues-a1-pchanie.json','w').write(json.dumps(fx,ensure_ascii=False,indent=1)+'\n')
z={"_opis":"Zdania wskazówek techniki z partii A1 (rodziny pchania; linia 1.1, 08.11.2026) czekające na przekład na 33 języki poza PL i EN (workflow przeklad-tlumaczen.yml; wymaga zgody właściciela — koszt). Do czasu przekładu aplikacja pokazuje angielski (cueText: język → angielski → polski); wyjątek testu kompletności tests/cues.test.tsx. Po przekładzie: dopisać zdania do lib/cues/text/<język>.json i usunąć wpisy (pusta lista = brak wyjątków).","data":"2026-11-08","klucze":[{"rodzaj":"nowy","id":i,"pl":json.load(open(W+"lib/cues/text/pl.json"))[i],"en":json.load(open(W+"lib/cues/text/en.json"))[i]} for i in sorted(c['zdania'])]}
open(W+'docs/lokalizacja/zestaw-przekladu-2026-11-08-a1-wskazowki.json','w').write(json.dumps(z,ensure_ascii=False,indent=2)+'\n')
print(len(K),len(part),len(c['zdania']))
```
