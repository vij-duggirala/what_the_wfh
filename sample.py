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


apps = ["Gmail1", "Disney+ Hotstar0", "Stack Overflow1",
        "Visual Studio Code1", "Microsoft Teams1", "YouTube0",  "Spotify0", "Google Search1", "GitHub1", "Medium1", "Netflix0", "Prime Video0", "WhatsApp0", "Android Studio1", "Discord0", "Google Drive1", "Google Chrome1", "Mozilla Firefox1", ]


def printt():
    if __name__ == "__main__":
        bigtit = get_active_window_title()
        if bigtit == None:
            bigtit = "Desktop"
        else:
            bigtit = bigtit.decode("utf-8")
        smalltit = bigtit+"0"
        for app in apps:
            if bigtit.find(app[:-1]) != -1:
                smalltit = app
                break
        print(smalltit)
        sys.stdout.flush()


schedule.every(0.0166).minutes.do(printt)
while 1:
    schedule.run_pending()
    time.sleep(1)
