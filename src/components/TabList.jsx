import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'

const TabList = ({files, activeId, unsaveIds, onTabClick, onCloseTab}) => {

    return (
    <ul className='nav nav-pills tablist-component'>
        {
            files.map(file => {
                // 未保存的小红点
                const withUnsaveMark = unsaveIds.includes(file.id)
                const fClassNames = classNames({
                    'nav-link': true,
                    'active': file.id === activeId,
                    'withUnsaved': withUnsaveMark
                })
                return (
                    <li className='nav-item' key={file.id}>
                        <a
                            className={fClassNames}
                            href="#"
                            onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}    
                        >
                            {file.title}
                            <span
                                style={{margin: '0 0 0 10px'}}
                                className="close-icon"
                                onClick={(e) => {e.stopPropagation(); onCloseTab(file.id)}}
                            >
                                <FontAwesomeIcon 
                                    icon={faTimes}
                                />
                            </span>
                            { withUnsaveMark &&
                                <span 
                                    className='rounded-circle unsaved-icon'
                                    style={{margin: '0 0 0 10px'}}
                                    >
                                </span>
                            }
                        </a>
                    </li>
                )
            })
        }
    </ul>
  )
}

TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string,
    unsaveIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTab: PropTypes.func
}

TabList.defaultProps = {
    unsaveIds: []
}

export default TabList
