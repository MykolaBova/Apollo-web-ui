import React from 'react'
import classNames from 'classnames';

const InfoBox = (props) => (
    <div
        className={classNames({
            'info-box': true,
            'danger': props.danger,
            'mt': props.mt
        })}>
        <p>
            {props.children}
        </p>
    </div>
)

export default InfoBox;