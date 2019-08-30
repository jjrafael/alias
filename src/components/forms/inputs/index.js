import React from 'react';

//components
import TextInput from './text';
import BtnToText from './BtnToText';
import ToggleBtn from './ToggleBtn';
import Quantity from './Quantity';

class Input extends React.Component {
  render(){
  	const { component } = this.props;
  	let input = null;
  	
  	switch(component){
  		case 'text':
  			input = <TextInput {...this.props}/>
  		break;
  		case 'btnToText':
  			input = <BtnToText {...this.props}/>
  		break;
  		case 'togglebtn':
  			input = <ToggleBtn {...this.props}/>
  		break;
  		case 'quantity':
  			input = <Quantity {...this.props}/>
  		break;
  		default:
  			input = <TextInput {...this.props}/>
  		break;
  	}

  	return input;
  }
}

export default Input;