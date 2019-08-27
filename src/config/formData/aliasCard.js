export const formInfo = {
	formName: 'aliasCard',
	className: 'aliasCard',
	groupedInputs: 0,
	inputs: [
		{
			id: 'text',
	    component: 'text',
	    type: 'text',
	    placeholder: '',
	    label: 'Alias Text',
	    showLabel: true,
	    validations: ['required','charMax-50'],
	    className: '--card-look',
	    extra: {
	    	spellCheck: false,
	    }
		},
		{
			id: 'jinx_msg',
	    component: 'btnToText',
	    type: 'textarea',
	    placeholder: '',
	    label: 'Jinx Message',
	    showLabel: true,
	    validations: [],
	    extra: {
	    	btnLabelToShow: 'Add Jinx',
	    	btnLabelToHide: 'Cancel',
	    }
		}
	],
	submit: {
		label: 'Submit',
		className: '',
	}
}

export default formInfo;