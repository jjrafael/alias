import React from 'react';

//components
import Button from '../common/Button';
import Input from './inputs';

//misc
import { validateValues, validateSingleValue } from '../../utils/validations';

class FormBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	formData: null,
    	errors: null,
    }
  }

  focusHandler = (e) => {
    if(this.props.focusHandler){
      this.props.focusHandler(e);
    }
  }

  blurHandler = (e) => {
    if(this.props.blurHandler){
      this.props.blurHandler(e);
    }
  }

  updateHandler = (e) => {
    e.preventDefault();
    const { formInfo, updateHandler } = this.props;
    const { formData } = this.state;
    const value = e.target.value;
    const input = formInfo.inputs.filter(d => d.id === e.target.name)[0];
    let data = formData || {};
    let errors = this.state.errors || {};
    let newValue = value;

    if(input && !!input.validations){
      const validResult = validateSingleValue(input, {[input.id]: value}, 'all');
      errors[input.id] = (validResult.valid ? null : validResult.errors);
      newValue = validResult.valid ? value : (formData ? formData[input.id] : null);
    }

    data[input.id] = newValue;
    if(updateHandler){
      updateHandler(data, errors);
    }

    this.setState({ formData: data, errors: errors });
  }

  validateForm(_inputs, _data) {
  	const { formInfo, updateHandler } = this.props;
  	let inputs = _inputs || formInfo.inputs;
  	let formData = _data || this.state.formData;
  	let errors = null;

  	if(inputs && formData){
  		errors = validateValues(inputs, formData, true);
  	}

  	if(errors && updateHandler){
  		updateHandler(formData, errors);
  	}

  	this.setState({ errors: errors });
  	return errors && errors.valid;
  }

  submitForm(e) {
  	e.preventDefault();
    const { onSubmit, payload, clearOnSubmit, formInfo } = this.props;
    const { formData } = this.state;
    const isValid = this.validateForm(formInfo.inputs, formData);

    if(isValid){
      onSubmit(formData, payload);
    }

    if(clearOnSubmit){
      this.resetForm();
    }
  }

  resetForm(){
    this.setState({
      formData: null,
      errors: null
    })
  }

  renderForm(data) {
  	const { children, isCustomForm } = this.props;
  	const { formData } = this.state;
  	let html = [];
  	const handlers = {
  		updateHandler: this.updateHandler,
  		blurHandler: this.updateHandler,
  		focusHandler: this.focusHandler,
  	}

  	if(data && !!data.inputs && !isCustomForm){
  		data.inputs.forEach((d, i) => {
  			const value = formData ? formData[d.id] : (d.defaultValue || null);
  			html.push(
  				<Input key={i} {...d} value={value} handlers={handlers}/>
  			)
  		})
  	}

  	return isCustomForm ? children : html;
  }

  renderSubmit(data) {
  	return (
  		<Button
  			className={data.className || ''} 
  			text={data.label || 'OK'} 
  			onClick={(e) => this.submitForm(e)}/>
  	)
  }

  render() {
  	const {
  		wrapperClassName,
  		className,
  		noSubmitButton,
  		formInfo,
  	} = this.props;
  	const cx = {
  		wrapper: wrapperClassName || '',
  		form: className || '',
  	}

  	return (
  		<div className={`form__wrapper ${cx.wrapper}`}>
  			<form className={cx.form} name={formInfo.formName}>
  				{this.renderForm(formInfo)}
  				{ !noSubmitButton &&
  					this.renderSubmit(formInfo.submit)
  				}
  			</form>
      </div>
  	)
  }
}

export default FormBox;