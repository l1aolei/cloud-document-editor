import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import useIpcRenderer from "./hooks/useIpcRenderer"
import { v4 as uuidv4 } from 'uuid'
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'

// require node.js modules
const { join, basename, extname, dirname } = window.require('path')
const remote = window.require('@electron/remote')
const { ipcRenderer } = window.require('electron')

const Store = window.require('electron-store')
const fileStore = new Store({'name': 'Files Data'})
const saveFilesToStore = (files) => {
  // we don't have to store any info in file system, eg: isNew, body
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file
    result[id] = {
      id, 
      path, 
      title,
      createdAt
    }
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const filesArr = objToArr(files)
  const savedLocation = remote.app.getPath('documents')
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  const activeFile = files[activeFileID]
    const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })

  const fileClick = (fileID) => {
    // set current active file
    setActiveFileID(fileID)
    const currentFile = files[fileID]
    if(!currentFile.isLoaded){
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileID], body: value, isLoaded: true }
        setFiles({ ...files, [fileID]: newFile })
      })
    }
    // add new fileID to openedFiles
    if(!openedFileIDs.includes(fileID)){
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }

  const tabClick = (fileID) => {
    setActiveFileID(fileID)
  }

  const tabClose = (id) => {
    // remove current id from openedFileIDs
    const tabWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabWithout)
    // set the active to the first opened tab if still left
    if(tabWithout.length > 0){
      setActiveFileID(tabWithout[0])
    }else{
      setActiveFileID('')
    }
  }

  const fileChange = (id, value) => {
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value }
      setFiles({ ...files, [id]: newFile })
      // update unsavedIDs
      if (!unsavedFileIDs.includes(id)) {
        setUnsavedFileIDs([ ...unsavedFileIDs, id])
      }
    }
  }

  const deleteFile = (id) => {
    if(files[id].isNew){
      setIsCreating(false)
      const {[id]: value, ...afterDelete} = files
      setFiles(afterDelete)
    }else{
      // filter out the current file id
      fileHelper.deleteFile(files[id].path).then(() => {
        const {[id]: value, ...afterDelete} = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        // close the tab if opened
        tabClose(id)
      })
    }
  }

  const updateFileName = (id, title, isNew) =>  {
    const newPath = isNew ? join(savedLocation, `${title}.md`) :
    join(dirname(files[id].path), `${title}.md`)
    const modifiedFile = {...files[id], title, isNew: false, path: newPath}
    const newFiles = {...files, [id]: modifiedFile} 
    if(isNew){
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        setIsCreating(false)
        // 持久化 (将新文件存储到electron-store)
        saveFilesToStore(newFiles)
      })
    } else{
      const oldPath = files[id].path
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
  }

  const fileSearch = (keyword) => {
    // filter out the new files based on the keyword
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const createNewFile = () => {
    if(isCreating) return
    const newID = uuidv4()
    const newFile = {
      id: newID,
      title: '',
      body: '## 请输入 Markdown',
      createdAt: new Date().getTime(),
      isNew: true
    }
    setFiles({...files, [newID]: newFile})
  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(activeFile.path,
      activeFile.body
    ).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
    })
  }

  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入的Markdown的文件',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Markdown files', extensions: ['md']}
      ]
    }).then((result) => {
      if(Array.isArray(result.filePaths)){
        const paths = result.filePaths
        // filter out the path we already have in the electron store
        const filteredPaths = paths.filter(path => {
          const alreadyAdded = Object.values(files).find(file => {
            return file.path === path
          })
          return !alreadyAdded
        })
        // extend the path array to an array contains file info
         const importFilesArr = filteredPaths.map(path => {
           return {
             id: uuidv4(),
             title: basename(path, extname(path)),
             path
           }
         })
        // get the new files object in flattenArr
         const newFiles = {...files, ...flattenArr(importFilesArr)}
        // setState and update electron store
        setFiles(newFiles)
        saveFilesToStore(newFiles)
        if(importFilesArr.length > 0){
          remote.dialog.showMessageBox({
            type: 'info',
            title: `成功导入了${importFilesArr.length}个文件`,
            message: `成功导入了${importFilesArr.length}个文件`
          })
        }
      }
    })
  }

  useIpcRenderer({
    'create-new-file': createNewFile,
    'import-file': importFiles,
    'save-edit-file': saveCurrentFile
  })

  return (
    <div className="App container-fluid px-0">
      <div className='row no-gutters'>
        {/* 左侧面板 */}
        <div className='col-4 left-panel'>
          <FileSearch 
            title='我的云文档'
            onFileSearch={fileSearch}
          />
          <FileList
            files={fileListArr}
            isCreating={isCreating}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />
          <div className='row no-gutters button-group'>
            <div className='col'>
              <BottomBtn 
                text='新建'
                colorClass='btn-primary'
                icon={faPlus}
                // Only one file can be created at a time
                onBtnClick={() => {createNewFile(); setIsCreating(true)}}
              />
            </div>
            <div className='col'>
              <BottomBtn 
                text='导入'
                colorClass='btn-success'
                icon={faFileImport}
                onBtnClick={importFiles}
              />
            </div>
          </div>
        </div>
        {/* 右侧面板 */}
        <div className='col-8 right-panel'>
          { !activeFile && 
              <div className='start-page'>
                选择或者创建新的 Markdown文档
              </div>
          }
          {
            activeFile && 
            <div>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id} 
                value={activeFile && activeFile.body}
                onChange={(value) => {fileChange(activeFile.id, value)}}
                options={{
                  minHeight: '450px',
                }}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
