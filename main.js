import { app, BrowserWindow, ipcMain } from 'electron';
import * as dgram from 'dgram';
import fs from 'fs';
import { start } from 'repl';

const PORT = 20777;
const outputFile = 'output.txt';

let udpServer = null;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });


  mainWindow.loadFile('index.html');
  
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function startUpServer() {
  if (udpServer) {
    console.log('The server is already on');
    return;
  }

  udpServer = dgram.createSocket('udp4');

  udpServer.on('error', (err) => {
    console.log(`UDP server error:\n${err.stack}`);

    udpServer?.close();
    udpServer = null;
  })

  udpServer.on('message', (msg, rinfo) => {
    // console.log(`UDP server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

    const hexString = msg.toString('hex');

    fs.appendFile(outputFile, hexString + '\n', (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`);
      }
    });

    // console.log(`Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
  });

  udpServer.on('listening', () => {
    const address = udpServer?.address();
    if (typeof address === 'object' && address !== null) {
      console.log(`UDP server listening on ${address.address}:${address.port}`);
    }

  });

  udpServer.bind(PORT);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('start-server', () => {
  console.log('Starting server...');
  startUpServer();
});