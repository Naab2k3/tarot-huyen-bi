import sys, os
sys.stdout.reconfigure(encoding='utf-8')
print('CWD:', os.getcwd())
print('FILES in root:')
for f in sorted(os.listdir('.'))[:20]:
    print(' ', f, '[DIR]' if os.path.isdir(f) else '')
print()
print('frontend/dist exists:', os.path.isdir('frontend/dist'))
if os.path.isdir('frontend/dist'):
    for f in sorted(os.listdir('frontend/dist'))[:10]:
        print('  frontend/dist/' + f)
print()
print('PYTHONPATH:')
for p in sys.path:
    print(' ', p)
