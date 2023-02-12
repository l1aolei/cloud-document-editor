import { useEffect} from 'react'
const remote = window.require('@electron/remote')
const { ipcRenderer } = window.require('electron')


// obj = {
//    'create-new-file': createNewFile,
//    'import-file': importFiles,
//    'save-edit-file': saveCurrentFile
// }
const useIpcRenderer = (keyCallbackMap) => {
    useEffect(() => {
        Object.keys(keyCallbackMap).forEach(key => {
            ipcRenderer.on(key, keyCallbackMap[key])
        })
        return () => {
            Object.keys(keyCallbackMap).forEach(key => {
                ipcRenderer.removeAllListeners(key, keyCallbackMap[key])
            })
        }
    })
}

export default useIpcRenderer
