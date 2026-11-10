# Odbiór promptów ról z wiadomości send_message (KO-029, WG-09): python3 -I role.py <transkrypt sesji .jsonl> <katalog wyjścia>
# Zdejmuje wcięcie 4 spacji i encje HTML, skleja części, sprawdza bajty i sha256[:16] z nagłówka.
# Gdy NIEZGODNE o kilka bajtów: sprawdź twarde spacje (U+00A0, U+202F) zamienione przez transport na 0x20 i odtwórz je, potwierdzając sumą.
import json,re,html,hashlib,sys,os
src,out=sys.argv[1],sys.argv[2]
texts=[]
for line in open(src):
    try: o=json.loads(line)
    except: continue
    def walk(x):
        if isinstance(x,str):
            if '=== TREŚĆ ===' in x and 'ROLA ' in x: texts.append(x)
        elif isinstance(x,dict):
            for v in x.values(): walk(v)
        elif isinstance(x,list):
            for v in x: walk(v)
    walk(o)
parts={}
hdr=re.compile(r'ROLA (\S+) część (\d+)/(\d+) · bajtów całości (\d+) · sha256\[:16\] ([0-9a-f]{16})\n *=== TREŚĆ ===\n(.*?)\n</cross-session-message>',re.S)
for t in texts:
    for m in hdr.finditer(t):
        f,i,n,B,H,body=m.groups()
        lines=body.split('\n')
        lines=[l[4:] if l.startswith('    ') else l.lstrip(' ') if l.strip()=='' else l for l in lines]
        parts.setdefault(f,{'n':int(n),'B':int(B),'H':H,'p':{}})['p'][int(i)]='\n'.join(lines)
os.makedirs(out,exist_ok=True)
for f,d in sorted(parts.items()):
    if len(d['p'])!=d['n']: print(f,'brak części',sorted(d['p'])); continue
    base=''.join(html.unescape(d['p'][k]) for k in sorted(d['p']))
    ok=None
    # warianty: łączenie części z/bez nowej linii, końcowa nowa linia
    for sep in ['', '\n']:
        joined=sep.join(html.unescape(d['p'][k]) for k in sorted(d['p']))
        for tail in ['', '\n', '\n\n']:
            c=(joined.rstrip('\n')+tail).encode()
            if len(c)==d['B'] and hashlib.sha256(c).hexdigest()[:16]==d['H']: ok=c;break
        if ok: break
    if ok: open(os.path.join(out,f),'wb').write(ok); print(f,'OK',len(ok),d['H'])
    else:
        c=base.encode(); print(f,'NIEZGODNE',len(c),'oczek',d['B'],hashlib.sha256(c).hexdigest()[:16],'oczek',d['H'])
