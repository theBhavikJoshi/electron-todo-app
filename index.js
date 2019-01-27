const { app, BrowserWindow, Menu, ipcMain } = require('electron');
let mainWindow, addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadFile('main.html');
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function addTaskWindow() {
  addWindow = new BrowserWindow({
    height: 300,
    width: 200,
    title: 'Add a new Todo'
  });
  addWindow.loadFile('add.html');
  addWindow.on('closed', () => addWindow = null);
}

function clearTodos() {
  mainWindow.webContents.send('todo:clear');
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
})

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'New Todo',
        click() { addTaskWindow() }
      },
      { 
        label: 'Clear Todos',
        click() { clearTodos() }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }
    ]
  }
]

if(process.platform === 'darwin') {
  menuTemplate.unshift({ label: '' })
}

if(process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'Open Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}