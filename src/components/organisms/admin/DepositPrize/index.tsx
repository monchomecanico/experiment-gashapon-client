// main tools
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

// components
import { Row } from "@/components/atoms/row";
import { Col } from "@/components/atoms/col";

// nextui
import { Button, Spinner } from "@nextui-org/react";

// utils
import {
  PrizeType,
  depositWheel,
  getPrizeWheel,
  getBalanceWheel,
} from "@/utils/toyoufrontv2";

// solana
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { NATIVE_MINT } from "@solana/spl-token";

//styles
import classes from "./styles.module.css";

// types
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { FC } from "react";

type DepositPrizeProps = {
  flag: boolean;
  selectedWheel: any;
};

interface DepositWheelParams {
  isYouWallet: anchor.Wallet;
  yourWheel: PublicKey;
  is_Solana: boolean;
  deposit_amount: number;
  tokenIDWheel: PublicKey;
}

type AmountsDataType = {
  sol: number | null;
  token: {
    amount: number;
    decimals: number;
    mintAta: PublicKey;
    tokenIDWheel: PublicKey; // mint
  }[];
};

export const DepositPrize: FC<DepositPrizeProps> = ({
  flag,
  selectedWheel,
}) => {
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [blockDepoist, setBlockDepoist] = useState(false);
  const [amounts, setAmounts] = useState<AmountsDataType>({
    sol: null,
    token: [],
  });

  const depositSol = async () => {
    const depositAmount = amounts.sol;
    const depositParams: DepositWheelParams = {
      is_Solana: true,
      tokenIDWheel: NATIVE_MINT,
      isYouWallet: wallet as NodeWallet,
      yourWheel: selectedWheel.publicKey,
      deposit_amount: depositAmount!,
    };

    const { response, error } = await depositWheel(depositParams);
    console.log("🚀 handleDeposit ~ response:", response, error);

    return {
      response,
      error,
    };
  };

  const depositToken = async () => {
    try {
      for (const item of amounts.token) {
        const depositParams: DepositWheelParams = {
          is_Solana: false,
          tokenIDWheel: item.tokenIDWheel,
          isYouWallet: wallet as NodeWallet,
          yourWheel: selectedWheel.publicKey,
          deposit_amount: item.amount!,
        };

        const { response, error } = await depositWheel(depositParams);
      }

      return {
        response: "Deposit Successfully",
      };
    } catch (error) {
      return { error };
    }
  };

  const handleDeposit = async (is_solana: boolean) => {
    try {
      setLoading(true);
      let res;
      let err;

      if (is_solana) {
        const { error, response } = await depositSol();

        setAmounts((prev) => ({
          ...prev,
          sol: null,
        }));

        res = response;
        err = error;
      } else {
        const { response, error } = await depositToken();

        setAmounts((prev) => ({
          ...prev,
          token: [],
        }));

        res = response;
        err = error;
      }

      console.log("🚀 handleDeposit ~ response:", res, err);

      if (res) {
        await getAmountsToDeposit();
        toast.success("Successful Transaction");
      } else toast.error(String(err));
    } catch (err) {
      console.log("🚀 ~ file: index.tsx:77 ~ handleDeposit ~ err:", err);
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  const getAmountsToDeposit = useCallback(async () => {
    try {
      let tokenPrizesAmounts: any[] = [];
      const data = await getPrizeWheel(
        wallet as NodeWallet,
        selectedWheel.publicKey
      );
      const solBalanceWheel = await getBalanceWheel(selectedWheel.publicKey);

      const solTotal = data
        .filter((prize) => prize.account.typePrize === PrizeType.Sol)
        .reduce(
          (total, prize) => total + prize.account.prizeQuantity.toNumber(),
          0
        );

      const tokenPrizes = data.filter(
        (prize) => prize.account.typePrize === PrizeType.Token
      );

      tokenPrizes.forEach((item) => {
        const prizesExist = tokenPrizesAmounts.find(
          (i) => i?.tokenIDWheel.toBase58() === item?.account?.mint?.toBase58()
        );

        if (!prizesExist)
          tokenPrizesAmounts.push({
            mintAta: item.account.mintAta,
            tokenIDWheel: item.account.mint,
            decimals: item.account.prizeDecimals,
            amount: item.account.prizeQuantity.toNumber(),
          });
        else {
          const index = tokenPrizesAmounts.findIndex(
            (i) => i.tokenIDWheel.toBase58() === item.account.mint.toBase58()
          );
          tokenPrizesAmounts[index].amount +=
            item.account.prizeQuantity.toNumber();
        }
      });

      if (solBalanceWheel > solTotal) setBlockDepoist(true);
      else setBlockDepoist(false);
      setAmounts({ sol: solTotal, token: tokenPrizesAmounts });
    } catch (error) {
      console.log(error);
      toast.error(String(error));
    }
  }, [selectedWheel, wallet]);

  useEffect(() => {
    getAmountsToDeposit();
  }, [getAmountsToDeposit, flag, selectedWheel]);

  return (
    <div className={classes.container}>
      <div className="my-3 text-center">
        <h1 className={classes.text}>
          3. Deposit the total value for the newly assigned solana and token
          prizes
        </h1>
      </div>
      <Row className="justify-center">
        {!blockDepoist && (
          <Col width="w-full md:w-1/4" className="flex justify-center">
            <Button
              variant="shadow"
              className={classes.button_green_gradient}
              disabled={loading}
              onClick={() => handleDeposit(true)}
            >
              {loading ? <Spinner color="danger" /> : "Deposit Sol"}
            </Button>
          </Col>
        )}

        {amounts.token.length > 0 && (
          <Col width="w-full md:w-1/4" className="flex justify-center">
            <Button
              variant="shadow"
              color="secondary"
              disabled={loading}
              onClick={() => handleDeposit(false)}
            >
              {loading ? <Spinner color="danger" /> : "Deposit Token"}
            </Button>
          </Col>
        )}
      </Row>

      {blockDepoist && amounts.token.length === 0 && (
        <div className="mb-3 text-center ">
          <h1 className={classes.text}>There are no prizes to deposit</h1>
        </div>
      )}

      <div className="text-center">
        <p className={classes.text}>
          After you have made sure to deposit the tokens into the roulette
          wheel, you can proceed to activate it.
        </p>
      </div>
    </div>
  );
};
