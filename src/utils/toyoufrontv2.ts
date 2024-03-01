import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	getAccount,
	getAssociatedTokenAddressSync,
	NATIVE_MINT,
} from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';

import {
	Keypair,
	PublicKey,
	Connection,
	ComputeBudgetProgram,
	LAMPORTS_PER_SOL,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js';
import { IDL, Toyou } from './toyou';
import { toast } from 'react-toastify';

type Event = anchor.IdlEvents<typeof IDL>;
type Account = anchor.IdlAccounts<typeof IDL>;

export function walletAux(admcb: Keypair): anchor.Wallet {
	return new anchor.Wallet(admcb);
}
export async function pause(ms: number) {
	await new Promise((response) =>
		setTimeout(() => {
			response(0);
		}, ms),
	);
}

const TMETA_PROG_ID = new PublicKey(
	'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

const TOYOU_PROGRAM_ID = new PublicKey(
	'HWSTVuDSWQpbu8QDYsxEZZ6qMULGQCuB4XCaZgbvZjvU',
);
const FEE_SERVICESC = new PublicKey(
	'45kEB3p5SFtJzvxSqFDmG5viMhUyNcea5AYAKSk5dzQ3',
);

export enum PrizeType {
	Sol = 54,
	Token,
	Nft,
	Pnft,
	Tryagain,
	Freeslot,
}

const opts = {
	commitment: 'confirmed',
	skipPreflight: true,
} as anchor.web3.ConfirmOptions;
const PRIORITY_RATE = 2000; // MICRO_LAMPORTS
const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
	microLamports: PRIORITY_RATE,
});

export const getConnection = () => {
	// const network = anchor.web3.clusterApiUrl('devnet');
	const network = process.env.NEXT_PUBLIC_RPC || 'http://127.0.0.1:8899';

	const jwt = process.env.NEXT_PUBLIC_JWT || ``;
	if (jwt) {
		const conn = new anchor.web3.Connection(network, {
			commitment: 'confirmed',
			httpHeaders: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		});
		return conn;
	} else {
		const conn = new anchor.web3.Connection(network, opts);
		return conn;
	}
};

const getProvider = (wallet: anchor.Wallet) => {
	/* create the provider and return it to the caller */
	/* network set to local network for now */

	const connection = getConnection();

	const provider = new anchor.AnchorProvider(connection, wallet, opts);
	return provider;
};

function getProgram(wallet: anchor.Wallet) {
	const idl = IDL as anchor.Idl;
	const provider = getProvider(wallet);
	if (idl.version != '0.1.0') {
		console.log('Wrong IDL version');
	}
	const program = new anchor.Program(
		idl,
		TOYOU_PROGRAM_ID,
		provider,
	) as unknown as anchor.Program<Toyou>;

	return { provider, program };
}

export function zeroPad(num: any, places: any) {
	return String(num).padStart(places, '0');
}
//! 1 Creo la ruleta
export async function createWheel(
	isYouWallet: anchor.Wallet,
	maxPremios: number,
	feeReciverWallet: PublicKey,
	prizeAuth: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);

	let basewallet = Keypair.generate();
	const firmas =
		program.provider.publicKey == isYouWallet.publicKey
			? [basewallet]
			: [basewallet, isYouWallet.payer];

	const yourWheelSeeds = [
		new Uint8Array(basewallet.publicKey.toBuffer()),
		anchor.utils.bytes.utf8.encode('wheel_id'),
	];

	const [yourWheel, _yourWheelBump] =
		anchor.web3.PublicKey.findProgramAddressSync(
			yourWheelSeeds,
			program.programId,
		);

	const serviceAmount = new anchor.BN(
		maxPremios *
			Number(process.env.NEXT_PUBLIC_FEE_SERVICE_AMOUNT) *
			LAMPORTS_PER_SOL,
	);

	let response;
	let error;
	let tx = await program.methods
		.createWheel(maxPremios, serviceAmount)
		.accounts({
			boss: isYouWallet.publicKey,
			base: basewallet.publicKey,
			yourWheel: yourWheel,
			prizeAuth,
			feeCollectorSc: feeReciverWallet,
			feeServiceSc: FEE_SERVICESC,
		})
		.preInstructions([PRIORITY_FEE_IX])
		.signers(firmas)
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('CREATED SUCCESSFULLY', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('CREATED ERROR', err);
			toast.error(String(err));
		});
	return { response, error };
}

//! 4 rellenas el contigo de los premios (token, sol)
export async function depositWheel({
	isYouWallet,
	yourWheel,
	is_Solana,
	deposit_amount,
	tokenIDWheel,
}: {
	isYouWallet: anchor.Wallet;
	yourWheel: PublicKey;
	is_Solana: boolean;
	deposit_amount: number;
	tokenIDWheel: PublicKey;
}) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	//console.log(program.provider.publicKey.toString(),isYouWallet.publicKey.toString())
	const firmas =
		program.provider.publicKey == isYouWallet.publicKey
			? []
			: [isYouWallet.payer];

	//const yourWheel_info = await program.account.wheel.fetch(yourWheel);
	let yourWheelAtaKey = is_Solana
		? yourWheel
		: getAssociatedTokenAddressSync(tokenIDWheel, yourWheel, true);
	let isYouWalletAtaKey = is_Solana
		? isYouWallet.publicKey
		: getAssociatedTokenAddressSync(tokenIDWheel, isYouWallet.publicKey);

	//console.log('tkn:',tokenIDWheel.toString(),'\nSource',isYouWalletAtaKey.toString(),'\nDest',yourWheelAtaKey.toString())
	let tx = await program.methods
		.depositWheel(
			//new anchor.BN(8000 * 10 ** spldec),
			new anchor.BN(deposit_amount),
		)
		.accounts({
			boss: isYouWallet.publicKey,
			destTokenAccount: yourWheelAtaKey,
			yourWheel,
			mint: is_Solana ? NATIVE_MINT : tokenIDWheel,
			sourceTokenAccount: isYouWalletAtaKey,
			tokenProgram: TOKEN_PROGRAM_ID,
			systemProgram: anchor.web3.SystemProgram.programId,
		})
		.signers(firmas)
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}

export async function cleanWheelBalance({
	isYouWallet,
	yourWheel,
	is_Solana,
	tokenIDWheel = NATIVE_MINT,
}: {
	yourWheel: PublicKey;
	is_Solana: boolean;
	tokenIDWheel: PublicKey;
	isYouWallet: anchor.Wallet;
}) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	//const yourWheel_info = await program.account.wheel.fetch(yourWheel);

	let yourWheelAtaKey = getAssociatedTokenAddressSync(
		tokenIDWheel,
		yourWheel,
		true,
	);
	let isYouWalletAtaKey = getAssociatedTokenAddressSync(
		tokenIDWheel,
		isYouWallet.publicKey,
	);
	let tx = await program.methods
		.withdrawWheel()
		.accounts({
			boss: isYouWallet.publicKey,
			destTokenAccount: is_Solana ? yourWheel : yourWheelAtaKey,
			yourWheel,
			mint: tokenIDWheel,
			sourceTokenAccount: is_Solana ? isYouWallet.publicKey : isYouWalletAtaKey,
			tokenProgram: TOKEN_PROGRAM_ID,
			systemProgram: anchor.web3.SystemProgram.programId,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}
export async function createInitPrizeOne(
	isYouWallet: anchor.Wallet,
	scope: any,
	//program: anchor.Program<Toyou>,
) {
	const { program } = getProgram(isYouWallet);
	let tx = await program.methods
		.createInitPrize(scope.prize_num)
		.accounts({
			prizeAuth: isYouWallet.publicKey,
			wheelId: scope.yourWheel,
			yourPrize: scope.yourPrize,
		})
		//.instruction()
		.rpc();

	return await tx;
}
//! 2 inicializo los premios
//? esto ahora funciona del lado del backend
export async function createInitPrize(
	isYouWallet: anchor.Wallet,
	E: Event['CreateWheel'],
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;

	const yourWheel_info = await program.account.wheel.fetch(E.wheel);
	let faltan = E.prizes - yourWheel_info.maxPrizes.toNumber();
	if ((faltan = 0)) return Promise.reject('ya se Crearon ');
	let ixs = [];
	for (let i = yourWheel_info.maxPrizes.toNumber(); i < E.prizes; i++) {
		const prize_num = zeroPad(i + 1, 5);

		const yourPrizeSeeds = [
			new Uint8Array(E.wheel.toBuffer()),
			anchor.utils.bytes.utf8.encode(prize_num),
		];

		const [yourPrize, _] = anchor.web3.PublicKey.findProgramAddressSync(
			yourPrizeSeeds,
			program.programId,
		);

		let ix = await program.methods
			.createInitPrize(prize_num)
			.accounts({
				prizeAuth: isYouWallet.publicKey,
				wheelId: E.wheel,
				yourPrize: yourPrize,
			})
			.instruction();
		ixs.push(ix);

		if (ixs.length == 15) {
			const recentBlockhash = await provider.connection.getLatestBlockhash(
				opts.commitment,
			);

			const messageV0 = new TransactionMessage({
				payerKey: isYouWallet.publicKey,
				recentBlockhash: recentBlockhash.blockhash,
				instructions: ixs, // note this is an array of instructions
			}).compileToV0Message();

			const transactionV0 = new VersionedTransaction(messageV0);
			//transactionV0.sign([isYouWallet.payer]);
			try {
				pause(6000);
				response = await provider.sendAndConfirm(transactionV0);

				Promise.resolve(response);
				console.log(i, 'signature', response);
			} catch (err: any) {
				error = err;
				Promise.reject(error);
				let balBknd = await program.provider.connection.getBalance(
					isYouWallet.publicKey,
				);
				console.log(
					i,
					'balance BKD',
					isYouWallet.publicKey.toString(),
					balBknd.toString(),
					ixs.length,
				);
				console.error('Your transaction error', err);
			}

			ixs = [];
		}
	}
	if (ixs.length > 0) {
		const recentBlockhash = await provider.connection.getLatestBlockhash(
			opts.commitment,
		);

		const messageV0 = new TransactionMessage({
			payerKey: isYouWallet.publicKey,
			recentBlockhash: recentBlockhash.blockhash,
			instructions: ixs, // note this is an array of instructions
		}).compileToV0Message();

		const transactionV0 = new VersionedTransaction(messageV0);
		//transactionV0.sign([isYouWallet.payer]);
		try {
			response = await provider.sendAndConfirm(transactionV0);
			Promise.resolve(response);
			console.log('Your transaction signature', response);
		} catch (err: any) {
			error = err;
			Promise.reject(error);
			console.error('Your transaction error', err);
		}
	}
	if (error) {
		return Promise.reject(error);
	}
	return Promise.resolve(response);
}

//! 5 Activar ruleta para que se muestre y juegue
export async function activeWheel(
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;

	let tx = await program.methods
		.activeWheel()
		.accounts({
			boss: isYouWallet.publicKey,
			yourWheel: yourWheel,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}
//! 6 asignar backend wallet para que permita asignar un premio a un ganador
export async function changeCtrl(
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
	prizeauth: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;

	let tx = await program.methods
		.changeCtrl()
		.accounts({
			boss: isYouWallet.publicKey,
			yourWheel: yourWheel,
			prizeAuth: prizeauth,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}
//! permite Cambiar quien recibe el fee (pero solo cuando la ruleta esta activa)
export async function changeFee(
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
	feeCollectorSc: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;

	let tx = await program.methods
		.changeFee()
		.accounts({
			boss: isYouWallet.publicKey,
			yourWheel: yourWheel,
			feeCollectorSc,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}
//! Jugador compra un ticket para jugar la ruleta y mandar al backend
export async function buyTurn(
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
	is_Solana: boolean,
	tokenIDWheel: PublicKey = NATIVE_MINT,
	price_amount: number,
	// program: anchor.Program<Toyou>,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	const firmas =
		program.provider.publicKey == isYouWallet.publicKey
			? []
			: [isYouWallet.payer];

	const yourWheel_info = await program.account.wheel.fetch(yourWheel);
	//console.log(yourWheel_info)

	const prize_num = zeroPad(yourWheel_info.turnsSold.toNumber() + 1, 5);
	const buyTurnSeeds = [
		new Uint8Array(yourWheel.toBuffer()),
		anchor.utils.bytes.utf8.encode('turn-sold'),
		new Uint8Array(isYouWallet.publicKey.toBuffer()),
		anchor.utils.bytes.utf8.encode(prize_num),
	];

	let yourWheelAtaKey = getAssociatedTokenAddressSync(
		tokenIDWheel,
		yourWheel,
		true,
	);
	let isYouWalletAtaKey = getAssociatedTokenAddressSync(
		tokenIDWheel,
		isYouWallet.publicKey,
	);

	const [buyTurn, _] = anchor.web3.PublicKey.findProgramAddressSync(
		buyTurnSeeds,
		program.programId,
	);

	let tx = await program.methods
		.buyTurn(prize_num, new anchor.BN(price_amount))
		.accounts({
			buyer: isYouWallet.publicKey,
			wheelId: yourWheel,
			turnSold: buyTurn,
			feeCollectorSc: yourWheel_info.feeCollectorSc,
			destTokenAccount: is_Solana ? yourWheel : yourWheelAtaKey,
			mint: tokenIDWheel,
			sourceTokenAccount: is_Solana ? isYouWallet.publicKey : isYouWalletAtaKey,
		})
		.signers(firmas)
		.preInstructions([PRIORITY_FEE_IX])
		.rpc()
		.then((res: any) => {
			response = buyTurn;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}
export async function assignWinner(
	isYouWallet: anchor.Wallet,
	yourPrize: PublicKey,
	buyTurn: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	const yourPrize_info = await program.account.prize.fetch(yourPrize);

	let tx = await program.methods
		.assignWinner()
		.accounts({
			prizeAuth: isYouWallet.publicKey,
			wheelId: yourPrize_info.wheelId,
			yourPrize: yourPrize,
			turnSold: buyTurn,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}

//! 3 asignar premios, Todos menos NFTS
//? Esto lo ejecuta backend
export async function assignPrizeN(
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
	tokenIDWheel: PublicKey,
	nrepeat: number,
	prizetype: PrizeType,
	prizequantity: number,
	prizedecimals: number = 9,
) {
	const { provider, program } = getProgram(isYouWallet);

	let response;
	let error;
	const firmas =
		program.provider.publicKey == isYouWallet.publicKey
			? []
			: [isYouWallet.payer];

	const data = await program.account.prize.all([
		{
			memcmp: {
				offset: 8,
				bytes: yourWheel.toBase58(),
			},
		},
	]);
	const freeSlot = data.filter(
		(prize) => prize.account.typePrize === PrizeType.Freeslot,
	);
	let isYouWalletAtaKey = getAssociatedTokenAddressSync(
		tokenIDWheel,
		prizetype === PrizeType.Nft ? isYouWallet.publicKey : yourWheel,
		prizetype === PrizeType.Token ||
			prizetype === PrizeType.Sol ||
			prizetype === PrizeType.Tryagain,
	);
	let ixs = [];
	for (let i = 0; i < nrepeat; i++) {
		let yourPrize = freeSlot.pop();

		let ix = await program.methods
			.assingPrizeBkend(prizetype, new anchor.BN(prizequantity), prizedecimals)
			.accounts({
				prizeAuth: isYouWallet.publicKey,
				wheelId: yourWheel,
				yourPrize: yourPrize?.publicKey,
				mint: tokenIDWheel,
				mintAta: isYouWalletAtaKey,
			})
			.instruction();
		ixs.push(ix);

		if (ixs.length == 10) {
			const recentBlockhash = await program.provider.connection.getLatestBlockhash(
				opts.commitment,
			);

			const messageV0 = new TransactionMessage({
				payerKey: isYouWallet.publicKey,
				recentBlockhash: recentBlockhash.blockhash,
				instructions: ixs, // note this is an array of instructions
			}).compileToV0Message();

			const transactionV0 = new VersionedTransaction(messageV0);
			//transactionV0.sign(firmas);
			try {
				response = await provider?.sendAndConfirm(transactionV0);
				console.log('Your transaction signature', response);
			} catch (err: any) {
				error = err;
				console.error('Your transaction error', err);
			}

			ixs = [];
		}
	}
	if (ixs.length > 0) {
		const recentBlockhash = await program.provider.connection.getLatestBlockhash(
			opts.commitment,
		);

		const messageV0 = new TransactionMessage({
			payerKey: isYouWallet.publicKey,
			recentBlockhash: recentBlockhash.blockhash,
			instructions: ixs, // note this is an array of instructions
		}).compileToV0Message();

		const transactionV0 = new VersionedTransaction(messageV0);
		//transactionV0.sign(firmas);
		try {
			response = await provider.sendAndConfirm(transactionV0);
			console.log('Your transaction signature', response);
		} catch (err: any) {
			error = err;
			console.error('Your transaction error', err);
		}
	}
	return { response, error };
}

//! 3Asignar premios, uno por uno (sirve para NFT)
//? Esto lo ejecuta FRONT
export async function assignPrize({
	isYouWallet,
	yourPrize,
	prizetype,
	prizequantity,
	prizedecimals = 9,
	is_Solana,
	yourWheel,
	tokenIDWheel = NATIVE_MINT,
}: {
	isYouWallet: anchor.Wallet;
	yourPrize: PublicKey;
	prizetype: PrizeType;
	prizequantity: number;
	prizedecimals: number;
	is_Solana: boolean;
	yourWheel: PublicKey;
	tokenIDWheel: PublicKey;
}) {
	let response;
	let error;
	const { provider, program } = getProgram(isYouWallet);

	let isYouWalletAtaKey = is_Solana
		? isYouWallet.publicKey
		: getAssociatedTokenAddressSync(tokenIDWheel, isYouWallet.publicKey);

	const nftEditionPda = is_Solana
		? isYouWallet.publicKey
		: PublicKey.findProgramAddressSync(
				[
					Buffer.from('metadata'),
					TMETA_PROG_ID.toBuffer(),
					tokenIDWheel.toBuffer(),
					Buffer.from('edition'),
				],
				TMETA_PROG_ID,
		  )[0];

	console.log('Tipo:', prizetype);
	let tx = await program.methods
		.assignPrize(prizetype, new anchor.BN(prizequantity), prizedecimals)
		.accounts({
			boss: isYouWallet.publicKey,
			wheelId: yourWheel,
			yourPrize: yourPrize,
			mint: tokenIDWheel,
			mintAta: isYouWalletAtaKey,
			edition: nftEditionPda,
			mplTokenMetadataProgram: TMETA_PROG_ID,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}

export async function retrivePrizeSol(
	isYouWallet: anchor.Wallet,
	yourPrize: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	const yourPrize_info = await program.account.prize.fetch(yourPrize);

	let tx = await program.methods
		.retrivePrizeSol()

		.accounts({
			signer: yourPrize_info.winner,
			wheelId: yourPrize_info.wheelId,
			yourPrize: yourPrize,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}

export async function retrivePrize(
	isYouWallet: anchor.Wallet,
	yourPrize: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	const yourPrize_info = await program.account.prize.fetch(yourPrize);

	const payerAta = await getAssociatedTokenAddressSync(
		yourPrize_info.mint,
		yourPrize_info.winner,
	);
	const nftEditionPda = PublicKey.findProgramAddressSync(
		[
			Buffer.from('metadata'),
			TMETA_PROG_ID.toBuffer(),
			yourPrize_info.mint.toBuffer(),
			Buffer.from('edition'),
		],
		TMETA_PROG_ID,
	)[0];

	const remainingAccounts = [];
	remainingAccounts.push({
		pubkey: payerAta,
		isWritable: true,
		isSigner: false,
	});

	let tx = await program.methods
		.retrivePrize()

		.accounts({
			signer: yourPrize_info.winner,
			wheelId: yourPrize_info.wheelId,
			yourPrize: yourPrize,
			mint: yourPrize_info.mint,
			mintAta: yourPrize_info.mintAta,
			edition: nftEditionPda,
			mplTokenMetadataProgram: TMETA_PROG_ID,
		})
		.remainingAccounts(remainingAccounts)
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}

export async function closeWheel(
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;

	let tx = await program.methods
		.closeWheel()
		.accounts({
			prizeAuth: isYouWallet.publicKey,
			yourWheel: yourWheel,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}

//! Obtener todos los premios de la ruleta
export const getPrizeWheel = async (
	wallet: anchor.Wallet,
	wheel: PublicKey,
) => {
	const { program } = getProgram(wallet);
	const data = await program.account.prize.all([
		{
			memcmp: {
				offset: 8,
				bytes: wheel.toBase58(),
			},
		},
	]);
	// console.log(data);
	// const loanActive = data.filter((item) => item.account.status == 22);

	return data;
};

//! Obtener todos los premios de UNA ruleta
export const getPrizeWheelByPubkey = async (
	wallet: anchor.Wallet,
	pubkey: PublicKey,
) => {
	const { program } = getProgram(wallet);
	const data = await program.account.prize.all([
		{
			memcmp: {
				offset: 8,
				bytes: pubkey.toBase58(),
			},
		},
	]);
	// console.log(data);
	// const loanActive = data.filter((item) => item.account.status == 22);

	return data;
};

//! Obtener todos los premios del ganador de la ruleta
export const getPrizesWinner = async (
	wallet: anchor.Wallet,
	wheel: PublicKey,
) => {
	const { program } = getProgram(wallet);
	const data = await program.account.prize.all([
		{
			memcmp: {
				offset: 8,
				bytes: wheel.toBase58(),
			},
		},
	]);

	const filtered = data.filter(
		(reward) =>
			reward.account.winner.toBase58() !== '11111111111111111111111111111111',
	);

	// ([
	// 	{
	// 		memcmp: {
	// 			offset: 41,
	// 			bytes: wallet.publicKey.toBase58(),
	// 		},
	// 	},
	// ]);
	// const loanActive = data.filter((item) => item.account.status == 22);

	return filtered;
};

//! Obtener todos los premios sin reclamar de un jugador
export const getPrizesWinnerActive = async (wallet: anchor.Wallet) => {
	const { program } = getProgram(wallet);
	const data = await program.account.prize.all([
		{
			memcmp: {
				offset: 41,
				bytes: wallet.publicKey.toBase58(),
			},
		},
	]);
	console.log(
		'🚀 ~ file: toyoufrontv2.ts:936 ~ getPrizesWinnerActive ~ data:',
		data,
	);

	const filtered = data.filter((reward) => !reward.account.prizeSta);

	return filtered;
};

//! Obtener Todas las ruletas creadas por una misma wallet
export const getWheels = async (wallet: anchor.Wallet, pubkey?: string) => {
	const { program } = getProgram(wallet);
	const data = await program.account.wheel.all([
		{
			memcmp: {
				offset: 41,
				bytes: pubkey ?? wallet.publicKey.toBase58(),
			},
		},
	]);
	// console.log(data);
	// const loanActive = data.filter((item) => item.account.status == 22);

	return data;
};

//! obtener todos los tickets comprados por una persona en todas las ruletas (filtrar por la seleccionada)
export const getBuyTurnSold = async (wallet: anchor.Wallet) => {
	const { program } = getProgram(wallet);

	const data = await program.account.turnSold.all([
		{
			memcmp: {
				offset: 41,
				bytes: wallet.publicKey.toBase58(),
			},
		},
	]);

	const turns = data.filter((turn) => !turn.account.turnSta);
	return turns;
};

//! pasarle la publicKey de la wheel
export const getBalanceWheel = async (wheelId: PublicKey) => {
	const connection = getConnection();
	const balanceSol = await connection.getBalance(wheelId);

	// const balanceToken = await getAccount(connection, wallet);

	return balanceSol;
};

export const forceCloseWheel = async (
	isYouWallet: anchor.Wallet,
	yourWheel: PublicKey,
) => {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;

	let tx = await program.methods
		.forceCloseWheel()
		.accounts({ boss: isYouWallet.publicKey, yourWheel: yourWheel })
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('🚀 ~ file: toyoufrontv2.ts:985 ~ .accounts ~ res:', res);
		})
		.catch((err: any) => {
			error = err;
			console.log('🚀 ~ file: toyoufrontv2.ts:991 ~ err:', err);
		});

	return { response, error };
};

export async function reverseAssingPrize(
	isYouWallet: anchor.Wallet,
	yourPrize: PublicKey,
) {
	const { provider, program } = getProgram(isYouWallet);
	let response;
	let error;
	const yourPrize_info = await program.account.prize.fetch(yourPrize);
	if (yourPrize_info.typePrize == 59) {
		error = 'no asignado';

		return { response, error };
	}

	const nftEditionPda = PublicKey.findProgramAddressSync(
		[
			Buffer.from('metadata'),
			TMETA_PROG_ID.toBuffer(),
			yourPrize_info.mint.toBuffer(),
			Buffer.from('edition'),
		],
		TMETA_PROG_ID,
	)[0];
	let is_Solana =
		yourPrize_info.typePrize == 54 || yourPrize_info.typePrize == 58;

	let tx = await program.methods
		.reverseAssingPrize()
		.accounts({
			boss: isYouWallet.publicKey,
			wheelId: yourPrize_info.wheelId,
			yourPrize: yourPrize,
			mint: is_Solana ? NATIVE_MINT : yourPrize_info.mint,
			mintAta: is_Solana ? isYouWallet.publicKey : yourPrize_info.mintAta,
			edition: is_Solana ? isYouWallet.publicKey : nftEditionPda,
			mplTokenMetadataProgram: TMETA_PROG_ID,
		})
		.rpc()
		.then((res: any) => {
			response = res;
			console.log('Your transaction signature', res);
		})
		.catch((err: any) => {
			error = err;
			console.error('Your transaction error', err);
		});

	return { response, error };
}
