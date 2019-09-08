import React from 'react';

class TextInput extends React.Component {
  render(){
    const {
      className, 
      showLabel,
      label,
      placeholder,
      type,
      id,
      value,
      extra={},
      handlers,
      readOnly,
      disabled,
    } = this.props;
    const enableEnter = extra ? extra.enableEnter : false;
    const cx = {
      input: `${className || ''} ${disabled ? 'disabled' : ''}`
    }
    
  	return (
      <div className="input__wrapper inputwrap__textbox group">
        {showLabel &&
          <h4 className="input__label">{label || id}</h4>
        }
        { type === 'textarea' ?
          <textarea
            name={id}
            className={`input input__textbox ${cx.input}`}
            type="text" 
            spellCheck={extra.spellCheck}
            autoComplete={extra.autoComplete}
            placeholder={placeholder}
            value={value || ''} 
            readOnly={readOnly}
            disabled={disabled}
            onChange={(e) => handlers.updateHandler(e)}
            onFocus={(e) => handlers.focusHandler(e, enableEnter)}
            onBlur={(e) => handlers.blurHandler(e, enableEnter)}
          />
          :
          <input
            name={id}
            className={`input input__textbox ${cx.input}`}
            type={type || 'text'} 
            spellCheck={extra.spellCheck}
            autoComplete={extra.autoComplete}
            placeholder={placeholder}
            value={value || ''} 
            readOnly={readOnly}
            disabled={disabled}
            onChange={(e) => handlers.updateHandler(e)}
            onFocus={(e) => handlers.focusHandler(e, enableEnter)}
            onBlur={(e) => handlers.blurHandler(e, enableEnter)}
          />
        }
      </div>
    )
  }
}

export default TextInput;