import sys
import os
import subprocess
import re
import schedule
import time


def get_active_window_title():
    root = subprocess.Popen(
        ['xprop', '-root', '_NET_ACTIVE_WINDOW'], stdout=subprocess.PIPE)
    stdout, stderr = root.communicate()

    m = re.search(b'^_NET_ACTIVE_WINDOW.* ([\w]+)$', stdout)
    if m != None:
        window_id = m.group(1)
        window = subprocess.Popen(
            ['xprop', '-id', window_id, 'WM_NAME'], stdout=subprocess.PIPE)
        stdout, stderr = window.communicate()
    else:
        return None

    match = re.match(b"WM_NAME\(\w+\) = (?P<name>.+)$", stdout)
    if match != None:
        return match.group("name").strip(b'"')

    return None


def printt():
    if __name__ == "__main__":
        print(get_active_window_title())
        sys.stdout.flush()


schedule.every(0.0166).minutes.do(printt)
while 1:
    schedule.run_pending()
    time.sleep(1)
