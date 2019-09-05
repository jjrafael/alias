import React from 'react';

//components
import TextInput from './text';
import BtnToText from './BtnToText';
import ToggleBtn from './ToggleBtn';
import Quantity from './Quantity';

//misc
import { bool } from '../../../utils';

class Input extends React.Component {
  render(){
  	const { component, required, validations } = this.props;
  	const props = {
  		...this.props,
  		required: required || (bool(validations) &&
  			validations.indexOf('required') !== -1)
  	}
  	let input = null;
  	
  	switch(component){
  		case 'text':
  			input = <TextInput {...props}/>
  		break;
  		case 'btnToText':
  			input = <BtnToText {...props}/>
  		break;
  		case 'togglebtn':
  			input = <ToggleBtn {...props}/>
  		break;
  		case 'quantity':
  			input = <Quantity {...props}/>
  		break;
  		default:
  			input = <TextInput {...props}/>
  		break;
  	}

  	return input;
  }
}

export default Input;