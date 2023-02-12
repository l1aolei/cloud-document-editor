import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
import useContextMenu from '../hooks/useContextMenu'
import { getParentNode } from "../utils/helper"

//load nodejs modules
const remote = window.require('@electron/remote')
const { Menu,  MenuItem } = remote
const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
   
    const [editStatus, setEditStatus] = useState(false)
    const [value, setValue] = useState('')
    const node = useRef(null)
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    useEffect(() => {
        const newFile = files.find(file => file.isNew)
        if(newFile){
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    }, [files])

    useEffect(()=>{
        if(editStatus){
            node.current.focus()  
        } 
    }, [editStatus])
    
    const closeSearch = (editItem) => {
        setEditStatus(false)
        setValue('')
        // if we are editing a newly created file, we should delete this file when pressing esc
        if(editItem.isNew){
            onFileDelete(editItem.id)
        }
    }

    const clickedItem = useContextMenu([
        {
            label: '打开',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                if(parentElement){
                    onFileClick(parentElement.dataset.id)
                }
            }
        },
        {
            label: '重命名',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                if(parentElement){
                    setEditStatus(parentElement.dataset.id)
                }
            }
        },
        {
            label: '删除',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                if(parentElement){
                    onFileDelete(parentElement.dataset.id)
                }
            }
        }
    ], '.file-list', files)

    // 绑定键盘事件
    useEffect(() => {
        const editItem = files.find(file => file.id === editStatus)
        if(enterPressed && editStatus && value.trim() !== ''){
            onSaveEdit(editItem.id, value, editItem.isNew)
            setEditStatus(false)
            setValue('')
        }else if(escPressed && editStatus){
            closeSearch(editItem)
        }
    })

    return (
        <ul className='list-group list-group-flush file-list'>
            {
                files.map(file => {
                    return (
                        <li
                            className="list-group-item bg-light row d-flex align-items-center file-item mx-0"
                            key={file.id}
                            data-id={file.id}
                            data-title={file.title}
                        >
                            { ( file.id !== editStatus && !file.isNew) && 
                            <>
                            <span className="col-2">
                                <FontAwesomeIcon
                                size="lg"
                                icon={faMarkdown} 
                                />
                            </span>
                            <span 
                                className="col-6 c-link"
                                onClick={() => {onFileClick(file.id)}}
                            >
                                {file.title}
                            </span>
                            <button
                                type='button'
                                className='icon-button col-2'
                                onClick={() => {setEditStatus(file.id); setValue(file.title)}}
                            >
                                <FontAwesomeIcon 
                                    title='编辑'
                                    icon={faEdit}
                                    size="lg"
                                />
                            </button>
                            <button
                                type='button'
                                className='icon-button col-2'
                                onClick={()=>{onFileDelete(file.id)}}
                            >
                                <FontAwesomeIcon 
                                    title='删除'
                                    icon={faTrash}
                                    size="lg"
                                />
                            </button>
                            </>
                            }
                            { ((file.id === editStatus) || file.isNew) &&
                            <>
                                <input 
                                    className="col-10"
                                    value={value}
                                    ref={node}
                                    placeholder="请输入文件名称"
                                    onChange={(e) => { setValue(e.target.value) }}
                                ></input>
                                <button
                                type="button"
                                className="icon-button col-2"
                                onClick={() => {closeSearch(file)}}
                                >
                                <FontAwesomeIcon
                                    title="关闭"
                                    size="lg"
                                    icon={faTimes} 
                                />
                                </button>
                            </>

                            }
                        </li>
                    )
                })
            }
        </ul>
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func
}

export default FileList