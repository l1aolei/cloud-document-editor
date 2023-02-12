import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'

// 将title, onFileSearch从props对象中提取出来
const FileSearch = ({title, onFileSearch}) => {

    const [inputActive, setInputActive] = useState(false)
    const [value, setValue] = useState('')
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)
 
    let node = useRef(null)

    const closeSearch = () =>{
        onFileSearch('')
        setInputActive(false)
        setValue('')
    }

    // 绑定键盘事件
    useEffect(() => {
        if(inputActive && enterPressed){
            onFileSearch(value)
        }
        if(inputActive && escPressed){
            closeSearch()
        }
    })

    // Input框自动获得焦点
    useEffect(() => {
        if(inputActive){
            node.current.focus()
        }
    }, [inputActive])

    return (
        <div className='alert alert-primary'>
            {
                !inputActive &&
                <div className='d-flex justify-content-between align-items-center mb-0'>
                    <span>{title}</span>
                    <button
                        type='button'
                        className='icon-button'
                        onClick={()=>{setInputActive(true)}}
                    >
                        <FontAwesomeIcon 
                            title='搜索'
                            icon={faSearch}
                            size="lg"
                        />
                    </button>
                </div>
            }
            {
                inputActive && 
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                        className='form-control'
                        vlaue={value}
                        style={{height: 24 + 'px'}}
                        ref={node}
                        onChange={(e)=>{setValue(e.target.value)}}
                    />
                    <button
                        type='button'
                        className='icon-button'
                        onClick={closeSearch}
                    >
                        <FontAwesomeIcon 
                            title='关闭'
                            icon={faTimes}
                            size="lg"
                        />
                    </button>
                </div>
            }
        </div>
    )
}

FileSearch.propTypes = {
    title: PropTypes.string,
    onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
    title: '我的云文档'
}

export default FileSearch
