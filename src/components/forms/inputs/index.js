import React from 'react';

//components
import TextInput from './text';

class Input extends React.Component {
  render(){
  	const { component } = this.props;
  	let input = null;

  	switch(component){
  		case 'text':
  			input = <TextInput {...this.props}/>
  		break;
  		default:
  			input = <TextInput {...this.props}/>
  		break;
  	}

  	return input;
  }
}

export default Input;