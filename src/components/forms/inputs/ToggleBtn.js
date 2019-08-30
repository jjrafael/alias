import React from 'react';

class ToggleBtn extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      active: false,
    }
  }

  componentDidMount() {
    this.setState({ active: this.props.value });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.value !== this.props.value){
      this.setState({ active: this.props.value });
    }
  }

  toggle() {
    this.setState({ active: !this.state.active });
    this.props.handlers.updateHandler(!this.state.active, {
      notInput: true,
      name: this.props.id
    });
  }

  render(){
    const {
      className,
      label,
      id,
      readOnly,
      disabled,
      extra,
    } = this.props;
    const { btnLabel } = extra;
    const { active } = this.state;
    const isDisabled = disabled || readOnly;
    const cx = {
      active: active ? 'active' : '',
      input: `${className || ''} ${(isDisabled) ? 'disabled' : ''}`
    }

  	return (
      <div className="input__wrapper inputwrap__togglebtn group">
        <div className={`input input__togglebtn ${cx.input} ${cx.active}`} onClick={this.toggle.bind(this)}>
          <div className="toggle__btn-wrapper">
            <div className="toggle__btn">{btnLabel || ''}</div>
          </div>
          <h4 className="input__label">{label || id}</h4>
        </div>
      </div>
    )
  }
}

export default ToggleBtn;