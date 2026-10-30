import re,sys
S='/tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad'
rows=[l.split('\t') for l in open(S+'/names.tsv').read().split('\n')]
LIB_DISPLAY={'Assault Bike':'Rower powietrzny','Ski Erg':'Ergometr narciarski','Bosu Ball Cable Crunch With Side Bends':'Cable Crunch With Side Bends (półkula balansowa)'}
EX_FULL={'Wyciskanie na linkach (stojąc)':'Standing Cable Press','Wiosłowanie na linkach (siedząc)':'Seated Cable Row (home)','Wyciskanie nad głowę (linki)':'Cable Overhead Press','Przysiad z pasem (linki)':'Belt Squat (cable)','Łydki na stopniu':'Calf Raise on Step','Bieg':'Running','Rower':'Cycling','Skakanka':'Jump Rope','Orbitrek':'Elliptical','Rower powietrzny':'Air Bike','Ergometr narciarski':'Ski Ergometer'}
EX_PAREN={'sztanga':'Barbell','hantle':'Dumbbell','hantel':'Dumbbell','linki':'Cable','ławka':'Bench','bieżnia':'Treadmill','hantle/linki':'Dumbbell/Cable','hantel/linka':'Dumbbell/Cable','dwie linki':'Two Cables','talerz':'Plate','półkula balansowa':'Balance Dome'}
def en_today(k):
    k2=LIB_DISPLAY.get(k,k)
    if k2 in EX_FULL: return EX_FULL[k2]
    return re.sub(r'\(([^)]+)\)',lambda m:'('+EX_PAREN[m.group(1)]+')' if m.group(1) in EX_PAREN else m.group(0),k2)
# barbell implicit for classic barbell lifts (rule S2)
CLASSIC={'Bench Press','Incline Bench Press','Deadlift','Overhead Press','Bent-Over Row','Romanian Deadlift','Hip Thrust','Floor Press','Stiff-Legged Deadlift'}
LEAD=r'((?:(?:Seated|Standing|Lying|Kneeling|Incline|Decline|Single-Arm|Single-Leg|Close-Grip|Wide-Grip|Reverse-Grip)\s)*)'
SMALL={'a','an','the','and','or','to','on','in','at','of','for','by','with','from','off','into','onto','per','vs'}
PAT={}
for x in __import__('json').load(open(S+'/cat.json')): PAT[x['rid']]=x['pattern']
KEEP_PL={'Circles','Swings','Jacks','Climbers','Knees','Kicks'}
def rules(s,rid=''):
    r=[]
    o=s
    # hyphens: compounds from phrasal verbs (dictionary spelling)
    s2=re.sub(r'\b(Push|Pull|Chin|Sit|Step|Muscle|Get) Up(s?)\b',r'\1-Up\2',s)
    s2=re.sub(r'\bPull Through\b','Pull-Through',s2); s2=re.sub(r'\bPull Apart\b','Pull-Apart',s2)
    if s2!=s: r.append('H1'); s=s2
    s2=re.sub(r'\bBent Over\b','Bent-Over',s)
    s2=re.sub(r'\b(Close|Wide|Reverse|Neutral|Mixed) Grip\b',r'\1-Grip',s2)
    s2=re.sub(r'\bToes to Bar\b','Toes-to-Bar',s2)
    s2=re.sub(r'\bSide [Tt]o Side\b','Side-to-Side',s2)
    if s2!=s: r.append('H2'); s=s2
    s2=re.sub(r'\b(?:One|Single)[ -]Arm\b','Single-Arm',s); s2=re.sub(r'\b(?:One|Single)[ -]Leg\b','Single-Leg',s2)
    if s2!=s: r.append('H3'); s=s2
    s2=re.sub(r'Skullcrusher','Skull Crusher',s); s2=re.sub(r'\bFlyes?\b','Fly',s2)
    if s2!=s: r.append('L1'); s=s2
    # singular
    SING={'Burpees':'Burpee','Push-Ups':'Push-Up','Sit-Ups':'Sit-Up','Butt-Ups':'Butt-Up','Lunges':'Lunge','Shrugs':'Shrug','Dips':'Dip','Chins':'Chin-Up','Climbers':'Climber','Cocoons':'Cocoon','Groiners':'Groiner','Drivers':'Driver','Crunches':'Crunch','Curls':'Curl','Hops':'Hop','Jacks':'Jack','Kicks':'Kick','Mornings':'Morning','Swings':'Swing','Taps':'Tap','Touchers':'Toucher','Touches':'Touch','Twists':'Twist','Wipers':'Wiper','Bridges':'Bridge','Circles':'Circle','Ships':'Ship','Worlds':'World','Rows':'Row','Bends':'Bend','Crosses':'Cross','Stairs':'Stair'}
    hd,sep,tl=(re.split(r'( (?:with|With|on|On|to|To|from|From) )',s,maxsplit=1)) if re.search(r' (?:with|With|on|On|to|To|from|From) ',s) else (s,'','')
    hd=' '.join((w if (w in KEEP_PL and PAT.get(rid) in ('mobility','cardio')) else SING.get(w,w)) for w in hd.split(' '))
    s2=hd+sep+tl
    if s2!=s: r.append('L2'); s=s2
    # title case
    ws=s.split(' '); out=[]
    for i,w in enumerate(ws):
        parts=w.split('-'); np=[]
        for j,p in enumerate(parts):
            lw=p.lower()
            if (j>0 and lw in {'a','an','the','to','of','and'}) or (j==0 and i>0 and lw in SMALL): np.append(lw)
            elif p and p[0].islower() and not p.startswith('(') : np.append(p[0].upper()+p[1:])
            else: np.append(p)
        out.append('-'.join(np))
    s2=' '.join(out)
    if s2!=s: r.append('W1'); s=s2
    # parentheses -> implement prefix
    m=re.match(r'^(.*) \((Barbell|Dumbbell|Cable|EZ|Kettlebell|Trap Bar|Treadmill|Plate|Balance Dome)\)$',s)
    if m:
        base,imp=m.group(1),m.group(2); imp={'EZ':'EZ-Bar'}.get(imp,imp)
        if imp=='Barbell' and base in CLASSIC: s=base
        else:
            mm=re.match(LEAD+r'(.*)$',base); s=mm.group(1)+imp+' '+mm.group(2)
        r.append('S1')
    s2=s.replace('EZ Bar','EZ-Bar').replace('Exercise Ball','Stability Ball')
    if s2!=s: r.append('E1'); s=s2
    toks=[('Flat Bench','A'),('Seated','A'),('Standing','A'),('Lying','A'),('Kneeling','A'),('Supine','A'),('Prone','A'),('Incline','A'),('Decline','A'),('Single-Arm','B'),('Single-Leg','B'),('Close-Grip','C'),('Wide-Grip','C'),('Reverse-Grip','C'),('Neutral-Grip','C'),('Mixed-Grip','C'),('Double Kettlebell','D'),('Smith Machine','D'),('EZ-Bar','D'),('Trap Bar','D'),('Medicine Ball','D'),('Barbell','D'),('Dumbbell','D'),('Kettlebell','D'),('Cable','D'),('Band','D'),('Machine','D')]
    lead=[]; rest=s
    while True:
        for t,cat in toks:
            if rest.startswith(t+' '): lead.append((cat,t)); rest=rest[len(t)+1:]; break
        else: break
    if lead:
        s2=' '.join(t for _,t in sorted(lead,key=lambda x:x[0]))+' '+rest
        if s2!=s: r.append('K1'); s=s2
    return s,r
OV={}
for l in open(S+'/override.tsv').read().strip().split('\n'):
    if l.strip() and not l.startswith('#'):
        a,b,c=l.split('\t'); OV[a]=(b,c)
res=[]
for rid,k in rows:
    t=en_today(k); p,r=rules(t,rid)
    if rid in OV: p=OV[rid][0]; r=r+[x for x in OV[rid][1].split(',') if x and x not in r]
    if p!=t: res.append((rid,k,t,p,','.join(r)))
import json
json.dump(res,open(S+'/res.json','w'),ensure_ascii=False,indent=0)
print(len(res))
if len(sys.argv)>1:
    for x in res: print(' | '.join(x))
