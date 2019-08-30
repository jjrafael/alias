export const formInfo = {
	formName: 'inGameAlias',
	className: 'inGameAlias --inline',
	groupedInputs: 0,
	inputs: [
		{
			id: 'alias',
	    component: 'text',
	    type: 'text',
	    placeholder: '',
	    label: 'Give a one-word clue',
	    showLabel: true,
	    validations: ['required','charMax-50'],
	    className: '--card-look --huge',
	    extra: {
	    	spellCheck: false,
	    }
		},
		{
			id: 'count',
	    component: 'quantity',
	    label: 'Count',
	    showLabel: true,
	    validations: ['numberOnly'],
	    className: '--huge',
		}
	],
	submit: {
		label: 'Submit',
		className: '',
	}
}

export default formInfo;