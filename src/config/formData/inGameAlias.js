export const formInfo = {
	formName: 'inGameAlias',
	className: 'inGameAlias --inline',
	autoComplete: 'off',
	groupedInputs: 0,
	inputs: [
		{
			id: 'alias',
	    component: 'text',
	    type: 'text',
	    placeholder: '',
	    label: 'Give a one-word clue',
	    showLabel: true,
	    validations: ['required','charMax-50','oneWord'],
	    className: '--card-look --huge',
	    extra: {
	    	spellCheck: false,
	    	autoComplete: 'off',
	    }
		},
		{
			id: 'count',
	    component: 'quantity',
	    value: 1,
	    label: 'Count',
	    showLabel: true,
	    validations: ['numberOnly', 'numMax-8'],
	    className: '--huge',
		}
	],
	submit: {
		label: 'Submit',
		className: '',
	}
}

export default formInfo;