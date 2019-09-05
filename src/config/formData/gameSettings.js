export const formInfo = {
	formName: 'gameSettings',
	className: 'gameSettings --col2',
	groupedInputs: 0,
	noSubmitButton: true,
	inputs: [
		{
			id: 'timer',
			label: 'Timer (minutes)',
	    component: 'quantity',
	    value: 3,
	    showLabel: true,
	    validations: ['numberOnly', 'numMax-8'],
		},
		{
			id: 'violation_limit',
			label: 'Violation Limit',
	    component: 'quantity',
	    value: 5,
	    showLabel: true,
	    validations: ['numberOnly', 'numMax-8'],
		},
		{
			id: 'winning_score',
			label: 'Winning Score',
	    component: 'quantity',
	    value: 5,
	    showLabel: true,
	    validations: ['required','numberOnly', 'numMax-8'],
		},
		{
			id: 'include_jinx_cards',
	    component: 'togglebtn',
	    type: 'default',
	    label: 'Include Jinx',
	    value: false,
	    extra: {},
		},
		{
			id: 'include_death_card',
	    component: 'togglebtn',
	    type: 'default',
	    label: 'Include Death Card',
	    value: true,
	    extra: {},
		},
		{
			id: 'show_death_on_leader',
	    component: 'togglebtn',
	    type: 'default',
	    label: 'Show Death Card for Leaders',
	    value: false,
	    extra: {},
		},
	]
}

export default formInfo;