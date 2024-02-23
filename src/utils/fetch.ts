export const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const optionsGet = {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
	},
};

export const fetchWithoutToken = (
	endpoint: string,
	body = {},
	method = 'POST',
) => {
	const url = `${base_url}${endpoint}`;
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	};
	return fetch(url, options);
};
