import React from 'react';

//components
import Button from '../common/Button';

//misc
import { variables } from '../../config';
import { validateSingleValue } from '../../utils/validations';

class SingleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        [this.props.input.id]: this.props.input.value || ''
      },
      errors: null
    }
  }

  componentDidMount() {
    this.setState({
      formData: {
        [this.props.input.id]: this.props.input.value || ''
      }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress, false);
  }

  onKeyPress = (e) => {
    const { keyCode } = variables;
    if(e.keyCode === keyCode.enter || e.key === keyCode.enter) {
      this.submitForm();
    }
  }

  updateHandler(e){
    e.preventDefault();
    const { input, updateHandler } = this.props;
    const value = e.target.value;
    let errors = null;
    let newValue = value;

    if(input.validations && input.validations.length){
      const validResult = validateSingleValue(input, {[input.id]: value}, 'all');
      errors = validResult.valid ? null : validResult.errors;
      newValue = validResult.valid ? value : this.state.formData[input.id];
    }

    if(updateHandler){
      updateHandler({ [input.id]: newValue });
    }

    this.setState({
      formData: { [input.id]: newValue },
      errors: errors
    });
  }

  focusHandler() {
    if(this.props.input.enableEnter){
      document.addEventListener('keydown', this.onKeyPress, false);
    }
  }

  blurHandler() {
    if(this.props.input.enableEnter){
      document.removeEventListener('keydown', this.onKeyPress, false);
    }
  }

  submitForm() {
    const { onSubmit, input, textOnly, payloadKey, clearOnSubmit } = this.props;
    const payload = payloadKey ? input[payloadKey] : null;
    const { formData, errors } = this.state;

    if(!errors && !textOnly){
      onSubmit(formData, payload);
    }

    if(clearOnSubmit){
      this.resetForm();
    }
  }

  resetForm(){
    this.setState({
      formData: {
        [this.props.input.id]: '',
        errors: null,
      },
    })
  }

  renderInput(input) {
    const { textOnly } = this.props;
    const { formData } = this.state;
    const generalProps = {
      placeholder: input.placeholder,
      disabled: textOnly,
    }

    let html = null;

    switch(input.type){
      case 'text':
        html = (
          <div className="input__wrapper group">
            {input.showLabel && !textOnly &&
              <h4 className="input__label">{input.label || input.id}</h4>
            }
            <input
              {...generalProps}
              className={`input__textbox --huge ${input.className || ''}`}
              type="text" 
              spellCheck="false"
              value={formData[input.id]} 
              onChange={(e) => this.updateHandler(e)}
              onFocus={(e) => this.focusHandler(e)}
              onBlur={(e) => this.blurHandler(e)}
            />
          </div>
        )
      break;
      default:
        html = (
          <div className="input__wrapper">
            {input.showLabel && !textOnly &&
              <h4 className="input__label">{input.label || input.id}</h4>
            }
            <input
              {...generalProps}
              className={`input__textbox --huge ${input.className || ''}`}
              type="text" 
              spellCheck="false"
              value={formData[input.id]} 
              onChange={(e) => this.updateHandler(e)}
              onFocus={(e) => this.focusHandler(e)}
              onBlur={(e) => this.blurHandler(e)}
            />
          </div>
        )
      break;
    }

    return html;
  }

  renderForm() {
    const { input, textOnly, noSubmitButton, submitLabel } = this.props;
    
    return (
      <div className="form-single__inner">
        {this.renderInput(input)}
        { !textOnly && !noSubmitButton &&
          <Button text={submitLabel || 'OK'} onClick={this.submitForm.bind(this)}/>
        }
      </div>
    )
  }

  render() {
    const { className } = this.props;

    return (
      <div className={`forms-single ${className || ''}`}>
        {this.renderForm()}
      </div>
    );
  }
}

export default SingleForm;
