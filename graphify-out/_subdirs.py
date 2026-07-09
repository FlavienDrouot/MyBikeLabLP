import json
from pathlib import Path
from collections import Counter

d = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
scan_root = d.get('scan_root').replace('\\', '/').rstrip('/')
all_lists = []
for cat in ('code', 'document', 'paper', 'image', 'video'):
    v = d['files'].get(cat, [])
    if isinstance(v, list):
        all_lists.extend(v)

all_lists = [f.replace('\\', '/') for f in all_lists]
all_lists = [f for f in all_lists if not f.startswith(scan_root + '/graphify-out/')]

c = Counter()
for f in all_lists:
    if f.startswith(scan_root + '/'):
        rel = f[len(scan_root) + 1:]
    else:
        rel = f
    parts = rel.split('/')
    first = parts[0] if len(parts) > 1 else '(root)'
    c[first] += 1

print('distinct first-level:', len(c))
print('Top first-level subdirectories by file count:')
for name, cnt in c.most_common(10):
    print(f'  {cnt:4d}  {name}')
