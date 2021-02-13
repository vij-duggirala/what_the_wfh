const electron = require('electron')
const url = require('url')
const path = require('path')

const schedule = require('node-schedule');

const { PythonShell } = require('python-shell');
let pyshell = new PythonShell('sample.py')

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let timerWindow;

let prev_message = "b'What The WFH'";

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'landing.html'),
        protocol: 'file',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', function () {
        app.quit();
    })


    startTimer();


});


function startTimer() {
    let display = electron.screen.getPrimaryDisplay();
    let width = display.bounds.width;
    timerWindow = new BrowserWindow({
        width: 200,
        height: 100,
        title: 'Timer',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        x: width - 200,
        y: 0,
        show: false
    });

    timerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'timer.html'),
        protocol: 'file',
        slashes: true
    }));


    timerWindow.setAlwaysOnTop(true, 'screen');

    /// timerWindow.on('close', function () {
    //  timerWindow = null;
    //})
    timerWindow.showInactive()

}



const menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click() {
                    startTimer();
                }
            },
            {
                label: 'DevTools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
]

var os_type;
if (process.platform == 'darwin') {
    menu.unshift({});
    os_type = 'mac';
}
else if (process.platform == 'linux')
    os_type = 'linux';
else
    os_type = 'windows';


console.log(os_type);


ipcMain.on('time', function (e, time) {
    //mongo 
    console.log('!!!GOT TIME !!!');
    console.log(time);
    console.log('!!');
});




var cls = 1;
pyshell.on('message', function (message) {

    if (message === "b'Ticking...'") {
        console.log('tick');
    }
    else {
        if (message != prev_message) {

            console.log(message);
            console.log('there');
            prev_message = message;
            if (timerWindow === null) {
                console.log('uy');
            }
            else {
                timerWindow.webContents.send('close', cls);
                timerWindow.close();
            }
            startTimer();

        }
    }

})
