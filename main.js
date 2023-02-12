const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const Store = require('electron-store')
Store.initRenderer()
const path = require('path')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
let mainWindow, settingsWindow

app.on('ready', () => {
    const mainWindowConfig = {
        width: 1024,
        height: 680,
    }
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(mainWindow.webContents)
    const urlLocation = isDev ? 'http://localhost:3000' : 'testUrl'
    mainWindow = new AppWindow(mainWindowConfig, urlLocation)
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    // hook up main events
    ipcMain.on('open-settings-window', () => {
        const settingsWindowConfig = {
            width: 500,
            height: 400,
            parent:  mainWindow
        }
        const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
        settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
        settingsWindow.on('closed', () => {
            settingsWindow = null
        })
    })
    // set the menu
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})
