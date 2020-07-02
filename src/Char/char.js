import React from 'react';

const style = {
    display: 'inline-block', 
    padding: '16px', 
    textalign: 'center', 
    margin: '16px', 
    border: '1px solid black'
};

const char = (props) => {
    return (
        <button style = {style} 
        onClick={props.click}
    >{props.character}{props.index}</button>
    )
};

export default char;