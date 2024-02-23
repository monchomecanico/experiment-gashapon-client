export interface NftDataType {
	name: string;
	image: string;
	symbol: string;
	address: string;
	description: string;
	external_url: string;
	tokenStandard: number;
	properties: Properties;
	attributes: Attribute[];
	seller_fee_basis_points: number;
}

export interface Attribute {
	value: any;
	trait_type: string;
}

export interface Properties {
	files: File[];
	category: string;
	creators: Creator[];
}

export interface File {
	type: string;
	uri: string;
}

export interface Creator {
	share: number;
	address: string;
	verified: boolean;
}
