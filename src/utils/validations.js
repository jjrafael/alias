export function validateValues(inputs, formData, isSubmit) {
	let result = {
		valid: true,
		count: 0,
		errors: {},
	};

	inputs.forEach(input => {
		const key = input.id;
		const validations = input.validations;
		const value = formData[key];
		const inputName = input.label || input.id;
		
		if(!!validations){
			validations.forEach(rule => {
				switch(rule){
					case 'required':
						if(!value && isSubmit){
							result.count++;
							result.errors[key] = inputName + ' is required';
						}
					break;
					case 'charMax-10':
						if(value && value.length > 10){
							result.count++;
							result.errors[key] = inputName + ' should not exceed 10 characters';
						}
					break;
					case 'charMax-6':
						if(value && value.length > 6){
							result.count++;
							result.errors[key] = inputName + ' should not exceed 6 characters';
						}
					break;
					case 'charMax-50':
						if(value && value.length > 50){
							result.count++;
							result.errors[key] = inputName + ' should not exceed 6 characters';
						}
					break;
					case 'numMax-8':
						if(value && value > 8){
							result.count++;
							result.errors[key] = inputName + ' should not be more than 8';
						}
					break;
					case 'oneWord':
						const rgx = /\s/;
						if(value && rgx.test(value.trim())){
							result.count++;
							result.errors[key] = 'give should only one-word only';
						}
					break;
					default:
					break;
				}
			})
		}
	})

	return {...result, valid: result.count === 0};
}

export function validateSingleValue(input, value, resultAttribute) {
	const result = validateValues([input], value);
    return resultAttribute === 'all' ? result : result[resultAttribute];
}