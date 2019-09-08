export const formInfo = {
	formName: 'aliasCard',
	className: 'aliasCard',
	autoComplete: 'off',
	groupedInputs: 0,
	inputs: [
		{
			id: 'text',
	    component: 'text',
	    type: 'text',
	    placeholder: '',
	    label: 'New Card Text',
	    showLabel: true,
	    validations: ['required','charMax-50'],
	    className: '--card-look',
	    extra: {
	    	spellCheck: false,
	    	enableEnter: true,
	    	autoComplete: 'off',
	    }
		},
		{
			id: 'jinx_msg',
	    component: 'btnToText',
	    type: 'textarea',
	    placeholder: '',
	    label: 'Jinx Message',
	    showLabel: true,
	    value: '',
	    validations: [],
	    extra: {
	    	btnLabelToShow: 'Add Jinx',
	    	btnLabelToHide: 'Cancel',
	    	autoComplete: 'off',
	    }
		}
	],
	submit: {
		label: 'Submit',
		className: '',
	}
}

export default formInfo;