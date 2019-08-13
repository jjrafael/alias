import React from 'react';
import { connect } from 'react-redux';

//components
import Button from '../common/Button';

//misc
import { variables } from '../../config';
import { validateSingleValue } from '../../utils/validations';

const mapStateToProps = state => {
  return {
    settings: state.app.settings,
    gameDetails: state.game.gameDetails,
  }
}

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

  onKeyPress = (e) => {
    const { keyCode } = variables;
    if(e.keyCode === keyCode.enter || e.key === keyCode.enter) {
      this.submitForm();
    }
  }

  changeHandler(e){
    e.preventDefault();
    const { input } = this.props;
    const value = e.target.value;
    let errors = null;
    let newValue = value;

    if(input.validations && input.validations.length){
      const validResult = validateSingleValue(input, {[input.id]: value}, 'all');
      errors = validResult.valid ? null : validResult.errors;
      newValue = validResult.valid ? value : this.state.formData[input.id];
    }

    this.setState({
      formData: { [input.id]: newValue },
      errors: errors
    })
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
    const { onSubmit, input, textOnly } = this.props;
    const { formData, errors } = this.state;

    if(!errors && !textOnly){
      onSubmit(formData, input.teamNumber);
    }
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
          <div className="input__wrapper">
            {input.showLabel && !textOnly &&
              <h4 className="input__label">{input.label || input.id}</h4>
            }
            <input
              {...generalProps}
              className={`input__textbox --huge ${input.className || ''}`}
              type="text" 
              value={formData[input.id]} 
              onChange={(e) => this.changeHandler(e)}
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
              value={formData[input.id]} 
              onChange={(e) => this.changeHandler(e)}
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
    const { input, textOnly } = this.props;

    return (
      <div className="form-single__inner">
        {this.renderInput(input)}
        { !textOnly &&
          <Button text="OK" onClick={this.submitForm.bind(this)}/>
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

export default connect(mapStateToProps)(SingleForm);
