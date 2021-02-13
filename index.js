const electron = require('electron')
const url = require('url')
const path = require('path')
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/wfh', {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
})

const track_db = require('./models/db.js');


const schedule = require('node-schedule');

const { PythonShell } = require('python-shell');
let pyshell = new PythonShell('sample.py')

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let timerWindow;

let prev_message = "What The WFH1";
let curr_message;
var today, dd, mm, yyyy, i;

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
        height: 50,
        title: 'Timer',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        x: width - 200,
        y: 0,
        //show: false

    });

    timerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'timer.html'),
        protocol: 'file',
        slashes: true
    }));


    timerWindow.setAlwaysOnTop(true, 'screen');


    timerWindow.on('close', function () {
        timerWindow = null;
    })
    // timerWindow.showInactive()


    timerWindow.menuBarVisible = false;

}

var alltrack;

ipcMain.on('date', async function (e, date) {
    dd = date.substr(date.length - 2, 2);
    mm = date.substr(date.length - 5, 2);
    yyyy = date.substr(0, 4);
    today = dd + '/' + mm + '/' + yyyy;

    console.log(today);

    alltrack = await track_db.find({ date: today });

    var ress = "";
    for (i = 0; i < alltrack.length; i++) {
        ress += alltrack[i].name + '|' + alltrack[i].time + '|' + alltrack[i].productive + '*';
    }
    console.log(ress);
    mainWindow.webContents.send('results', ress);

})


const menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'DevTools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: 'Quit',
                click() {
                    timerWindow.webContents.send('close', cls);
                    timerWindow.destroy();
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Timer',
        submenu: [
            {
                label: 'Hide',
                click() {
                    timerWindow.hide();
                }
            },
            {
                label: 'Show',
                click() {
                    timerWindow.show();
                }
            }
        ]
    },
    {
        label: 'Configure',
        submenu: [
            {
                label: 'Location Details',
                click() {
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'loc.html'),
                        protocol: 'file',
                        slashes: true
                    }));
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


ipcMain.on('time', async function (e, timee) {
    var prod = false;
    if (curr_message.charAt(curr_message.length - 1) == '1')
        prod = true;


    today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    curr_message = curr_message.slice(0, -1);
    today = dd + '/' + mm + '/' + yyyy;
    console.log(today);

    let already = await track_db.findOne({ date: today, name: curr_message });
    if (already) {
        track_db.updateOne({ date: today, name: curr_message }, { $inc: { time: timee } }, {}, (err, numberAffected) => {
            console.log('updated');
        });
    }
    else {

        var newtrack = new track_db({
            name: curr_message,
            time: timee,
            date: today,
            productive: prod
        });
        await newtrack.save();
        console.log('saved');

    }


    console.log(curr_message + '  -   ' + timee);

});




var cls = 1;
pyshell.on('message', function (message) {

    if (message === "Ticking...0") {
        // 
    }
    else {
        if (message != prev_message) {
            curr_message = prev_message;
            console.log(message);
            if (timerWindow === null) {
                console.log('uy');
            }
            else {
                timerWindow.webContents.send('close', cls);

            }
            prev_message = message;
        }
    }

})
