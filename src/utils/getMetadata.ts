import {
	TokenStandard,
	Metadata as MData,
	PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { getConnection } from './toyoufrontv2';

function getMetadataPDA(mint: string) {
	const mintKey = new PublicKey(mint);
	const [metadatakey] = PublicKey.findProgramAddressSync(
		[
			Buffer.from('metadata'),
			TOKEN_METADATA_PROGRAM_ID.toBuffer(),
			mintKey.toBuffer(),
		],
		TOKEN_METADATA_PROGRAM_ID,
	);

	return metadatakey;
}

export const getNftOrTokenMetadata = async (mint: string) => {
	const connection = getConnection();

	try {
		const metadataPDA = getMetadataPDA(mint);

		const onchainMetadata = await MData.fromAccountAddress(
			connection,
			metadataPDA,
			'confirmed',
		);
		const externalMetadata = (
			await axios.get(onchainMetadata.data.uri.replace(/\0/g, ''))
		).data; //TODO si no existe el data.uri no hay imagen

		return {
			externalMetadata,
			mint: new PublicKey(mint),
			onChain: {
				key: onchainMetadata.key,
				updateAuthority: onchainMetadata.updateAuthority,
				mint: onchainMetadata.mint,
				data: {
					//TODO Revisar que devuelve para poder hacer la diferencia entre token y NFT
					name: onchainMetadata.data.name.replace(/\0/g, ''),
					symbol: onchainMetadata.data.symbol.replace(/\0/g, ''),
					uri: onchainMetadata.data.uri.replace(/\0/g, ''),
					sellerFeeBasisPoints: onchainMetadata.data.sellerFeeBasisPoints,
					creators: onchainMetadata.data.creators ?? null,
				},
				primarySaleHappened: onchainMetadata.primarySaleHappened,
				isMutable: onchainMetadata.isMutable,
				editionNonce: onchainMetadata.editionNonce ?? undefined,
				tokenStandard: onchainMetadata.tokenStandard ?? undefined,
				collection: onchainMetadata.collection ?? undefined,
				uses: onchainMetadata.uses ?? undefined,
				collectionDetails: onchainMetadata.collectionDetails ?? undefined,
				programmableConfig: onchainMetadata.programmableConfig ?? undefined,
			},
		};
	} catch (error) {
		return {
			mint: new PublicKey(mint),
			onChain: null,
			externalMetadata: {
				image: 'unknow',
				name: 'unknow',
			},
		};
	}
};
