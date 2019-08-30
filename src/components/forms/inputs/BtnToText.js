import React from 'react';
import Button from '../../common/Button';

class BtnToText extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showField: false,
      btnLabelToShow: 'Show Input',
      btnLabelToHide: 'Cancel',
    }
  }

  componentDidMount(){
    if(this.props.extra){
      const { btnLabelToHide, btnLabelToShow } = this.props.extra;  
      if(btnLabelToHide){ this.setState({ btnLabelToHide }) };
      if(btnLabelToShow){ this.setState({ btnLabelToShow }) };
    }
  }

  toggle() {
    this.setState({ showField: !this.state.showField });
  }


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
    const { showField, btnLabelToShow, btnLabelToHide } = this.state;
    const { spellCheck } = extra;
    const cx = {
      input: `${className || ''} ${disabled ? 'disabled' : ''}`
    }
  	return (
      <div className="btn-to-field inputwrap__btntofield">
        { showField ?
          <div className="input__wrapper inputwrap__textbox group fade-in">
            {showLabel &&
              <h4 className="input__label">{label || id}</h4>
            }
            <Button
              text={btnLabelToHide}
              className="--small --cancel"
              onClick={this.toggle.bind(this)}/>
            { type === 'textarea' ?
              <textarea
                name={id}
                className={`input input__textbox ${cx.input}`}
                type="text" 
                spellCheck={extra.spellCheck}
                placeholder={placeholder}
                value={value || ''} 
                readOnly={readOnly}
                disabled={disabled}
                onChange={(e) => handlers.updateHandler(e)}
                onFocus={(e) => handlers.focusHandler(e)}
                onBlur={(e) => handlers.blurHandler(e)}
              />
              :
              <input
                name={id}
                className={`input input__textbox ${cx.input}`}
                type={type || 'text'} 
                spellCheck={spellCheck}
                placeholder={placeholder}
                value={value || ''} 
                readOnly={readOnly}
                disabled={disabled}
                onChange={(e) => handlers.updateHandler(e)}
                onFocus={(e) => handlers.focusHandler(e)}
                onBlur={(e) => handlers.blurHandler(e)}
              />
            }
          </div>
          : <Button text={btnLabelToShow} onClick={this.toggle.bind(this)}/>
        }
      </div>
    )
  }
}

export default BtnToText;