export const formInfo = {
	formName: 'aliasCard',
	className: '',
	groupedInputs: 0,
	inputs: [
		{
			id: 'text',
	    component: 'text',
	    type: 'text',
	    placeholder: '',
	    label: 'Text',
	    showLabel: true,
	    validations: ['required','charMax-50'],
	    className: '--card-look',
	    extra: {
	    	spellCheck: false,
	    }
		}
	],
	submit: {
		label: 'OK',
		className: '',
	}
}

export default formInfo;