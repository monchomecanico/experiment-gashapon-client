import { PrizeType } from '@/utils/toyoufrontv2';

export type PrizeDataType = {
	mint: string;
	tipo: PrizeType | null;
	monto: number | string;
	cuantos: number | string;
	decimals: number | string;
};
