export const actionEnums = {
	CHANGE_BW: 'CHANGE_BW',
	CHANGE_FEE: 'CHANGE_FEE',
};

export const ActionLabels = (action: keyof typeof actionEnums) => {
	switch (action) {
		case actionEnums.CHANGE_BW:
			return {
				label: 'Indique cual sera la wallet que otorgara los premios',
				placeholder: 'Backend wallet',
			};

		case actionEnums.CHANGE_FEE:
			return {
				label: 'Indicate the wallet that will receive the fee',
				placeholder: 'fee wallet',
			};

		default:
			return {
				label: '',
				placeholder: '',
			};
	}
};
