import React from 'react';

class TextInput extends React.Component {
  render(){
    const {
      className, 
      showLabel,
      label,
      id,
      value,
      handlers,
      readOnly,
      disabled,
    } = this.props;
    const cx = {
      input: `${className || ''} ${disabled ? 'disabled' : ''}`
    }
    
  	return (
      <div className="input__wrapper inputwrap__quantity group">
        {showLabel &&
          <h4 className="input__label">{label || id}</h4>
        }
        <input
          name={id}
          className={`input input__quantity ${cx.input}`}
          type={'number'}
          value={value || ''} 
          readOnly={readOnly}
          disabled={disabled}
          onChange={(e) => handlers.updateHandler(e)}
          onFocus={(e) => handlers.focusHandler(e)}
          onBlur={(e) => handlers.blurHandler(e)}
        />
      </div>
    )
  }
}

export default TextInput;