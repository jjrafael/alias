export const formInfo = {
	formName: 'deckOptions',
	className: 'deckOptions',
	groupedInputs: 0,
	noSubmitButton: true,
	inputs: [
		{
			id: 'desc',
	    component: 'text',
	    type: 'textarea',
	    placeholder: '',
	    label: 'Deck Description',
	    showLabel: true,
	    extra: {},
		},
		{
			id: 'is_default_bundle',
	    component: 'togglebtn',
	    type: 'default',
	    label: 'Set as part of Default Bundle?',
	    value: false,
	    extra: {},
		},
	]
}

export default formInfo;