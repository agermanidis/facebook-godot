const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const GodotBot = require('./js_api/godot-api');

var myBot = new GodotBot();

const path = require('path')
const url = require('url')


global.loginUser = function(user, pass, cb) {
    myBot.start(user, pass, function(err) {
        console.log("err", err);
        cb(err);
    });
}

global.getActiveUsers = function(cb) {
    myBot.getFriendsList(function(err, friends) {
        console.log("friends", friends);
        var activeUsers = myBot.getActiveUsers();
        console.log("active users", activeUsers);
        var ret = [];
        for (var i = 0; i < activeUsers.length; i++) {
            var user = activeUsers[i];
            var friend = friends[user.userID];
            if (friend === null) {
                continue;
            }
            ret.push({
                start: user.start,
                name: friend.fullName,
                profilePicture: friend.profilePicture,
            });
        }
        cb(ret);
    });
    
};

let mainWindow

function createWindow () {
    
    mainWindow = new BrowserWindow({
        width: 450,
        height: 650,
        icon: __dirname + '/icon.png'
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
