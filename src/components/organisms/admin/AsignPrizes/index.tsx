// main tools
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

// components
import { Form } from "./form";

// nextui
import { Button, Spinner } from "@nextui-org/react";

// utils
import {
  PrizeType,
  getPrizeWheel,
  reverseAssingPrize,
} from "@/utils/toyoufrontv2";

// solana
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

// styles
import classes from "./styles.module.css";

// types
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { SetStateType } from "@/types";
import { FC } from "react";

type AsignPrizesDataType = {
  selectedWheel: any;
  flag: boolean;
  setFlag: SetStateType<boolean>;
};

export const AsignPrizes: FC<AsignPrizesDataType> = ({
  flag,
  setFlag,
  selectedWheel,
}) => {
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [prizeListAsign, setPrizeListAsign] = useState<any[]>([]);
  const [wheelPrizesList, setWheelPrizesList] = useState<any[]>([]);

  const getAllPrizeWheel = useCallback(async () => {
    try {
      const data = await getPrizeWheel(
        wallet as NodeWallet,
        selectedWheel.publicKey
      );

      setWheelPrizesList(
        data.filter((prize) => {
          return prize.account.typePrize === PrizeType.Freeslot;
        })
      );
      setPrizeListAsign(
        data.filter((prize) => {
          return prize.account.typePrize !== PrizeType.Freeslot;
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(String(error));
    }
  }, [selectedWheel, wallet]);

  const handleRevertAsignPrize = async (prizeKey: PublicKey) => {
    try {
      setLoading(true);
      const { response, error } = await reverseAssingPrize(
        wallet as NodeWallet,
        prizeKey
      );

      if (error) {
        console.log(
          "🚀 ~ file: index.tsx:81 ~ handleRevertAsignPrize ~ error:",
          error
        );
        return toast.error("Failed revert assign prize");
      }

      await getAllPrizeWheel();
      toast.success("Prize assign successfully reversed");
    } catch (err) {
      console.log(
        "🚀 ~ file: index.tsx:84 ~ handleRevertAsignPrize ~ err:",
        err
      );
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPrizeWheel();
  }, [getAllPrizeWheel]);

  return (
    <div className={classes.container}>
      <div className="my-3 text-center">
        <h1 className={classes.text}>
          2. Assigns the type of prize that will be each of the prizes of the
          selected wheel
        </h1>
      </div>
      {wheelPrizesList.length !== 0 ? (
        <Form
          flag={flag}
          setFlag={setFlag}
          selectedWheel={selectedWheel}
          wheelPrizesList={wheelPrizesList}
          getAllPrizeWheel={getAllPrizeWheel}
        />
      ) : (
        <p className={` text-center ${classes.text}`}>
          There are no prizes to assign
        </p>
      )}

      {prizeListAsign.length > 0 && (
        <div className={classes.prizeList_container}>
          <div className="my-3 text-center">
            <p className={classes.text}>
              Here you can see the prizes you have assigned, and reverse them in
              case you made a mistake. but it is only allowed as long as the
              roulette is not yet activated
            </p>
          </div>
          <ul>
            {prizeListAsign.map((item) => (
              <li key={item.publicKey.toBase58()} className={classes.prizeItem}>
                <div className="flex justify-between align-center">
                  <div className="flex flex-col">
                    <span className="text-white">
                      Type prize: <b>{PrizeType[item.account.typePrize]}</b>
                    </span>
                    <span className="text-white">
                      ID: <b>{item.publicKey.toBase58()}</b>
                    </span>
                    {[PrizeType.Nft, PrizeType.Token].includes(
                      item.account.typePrize
                    ) && (
                      <div className="flex flex-col">
                        <span className="text-white">
                          {" "}
                          mint: {item.account.mint.toBase58()}
                        </span>
                        {item.account.typePrize === PrizeType.Token && (
                          <span> Decimals: {item.account.prizeDecimals}</span>
                        )}
                        <span className="text-white">
                          quantity:{" "}
                          {item.account.prizeQuantity.toNumber() /
                            10 ** item.account.prizeDecimals}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      color="danger"
                      disabled={loading}
                      onClick={() => handleRevertAsignPrize(item.publicKey)}
                    >
                      {loading ? (
                        <Spinner color="danger" />
                      ) : (
                        "Revert assignment"
                      )}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 d-flex flex-column justify-content-center">
        <div className="text-center">
          <p className={classes.text}>
            Disclaimer: Make sure that the data is correct because this data
            cannot be changed later
          </p>
        </div>
      </div>
    </div>
  );
};
