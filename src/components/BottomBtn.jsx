import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 

const BottomBtn = ({text, colorClass, icon, onBtnClick}) => {
    return (
        <button
            style={{width: 'calc(107%)'}}
            type='button'
            className={`btn btn-block no-border ${colorClass}`}
            onClick={onBtnClick}
        >
            <FontAwesomeIcon 
                className='mr-2'
                icon={icon}
                size="lg"
            />
            {text}
        </button>
    )
}

BottomBtn.propTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    onBtnClick: PropTypes.func
}

BottomBtn.defaultProps = {
    text: '新建'
}


export default BottomBtn
