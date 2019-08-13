import React from 'react';
import { connect } from 'react-redux';

//components
import Button from '../common/Button';

//misc
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
      }
    }
  }

  componentDidMount() {
    this.setState({
      formData: {
        [this.props.input.id]: this.props.input.value || ''
      }
    })
  }

  updateValue(e){
    e.preventDefault();
    const { input } = this.props;
    const value = e.target.value;
    let newValue = value;
    if(input.validations && input.validations.length){
      const valid = validateSingleValue(input, {[input.id]: value})
      newValue = valid ? value : this.state.formData[input.id];
    }

    this.setState({
      formData: { [input.id]: newValue }
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
          <div className="input__wrapper">
            {input.showLabel && !textOnly &&
              <h4 className="input__label">{input.label || input.id}</h4>
            }
            <input
              {...generalProps}
              className={`input__textbox --huge ${input.className || ''}`}
              type="text" 
              value={formData[input.id]} 
              onChange={(e) => this.updateValue(e)}
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
              onChange={(e) => this.updateValue(e)}
            />
          </div>
        )
      break;
    }

    return html;
  }

  submitForm() {
    const { onSubmit } = this.props;
    const { formData } = this.state;

    onSubmit(formData);
  }

  renderForm() {
    const { input, textOnly } = this.props;

    return (
      <div className="form-single__inner">
        {this.renderInput(input)}
        { !textOnly &&
          <Button text="OK" onClick={this.submitForm}/>
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
