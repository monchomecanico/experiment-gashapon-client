// main tools
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// solana
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

// nextui
import { Button, Input, Spinner } from "@nextui-org/react";

// utils
import { createWheel, pause } from "@/utils/toyoufrontv2";
import { base_url } from "@/utils/fetch";
import { verifyIsTx } from "@/commons";

// styles
import classes from "./styles.module.css";

// types
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { FC } from "react";

type CreateWheelFormProps = {
  getAllWheels: () => Promise<void>;
};

export const CreateWheelForm: FC<CreateWheelFormProps> = ({ getAllWheels }) => {
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    maxPremios: "",
    feeReciverWallet: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { response: createdWheel, error } = await createWheel(
        wallet as NodeWallet,
        Number(data.maxPremios),
        new PublicKey(data.feeReciverWallet),
        new PublicKey(process.env.NEXT_PUBLIC_BACKEND_WALLET!)
      );

      if (error) return toast.error(String(error));

      if (createdWheel) {
        toast.info(` confirming the creation of the ${data.maxPremios} prizes`);

        let listo = true;
        do {
          await pause(5000);
          const { data: resData } = await axios.post(
            `${base_url}/fail-event-check`,
            { txid: createdWheel }
          );
          console.log(
            "🚀 ~ file: form.tsx:67 ~ handleSubmit ~ resData:",
            resData
          );
          toast.info(String(resData));

          let verify;

          if (resData.length) verify = verifyIsTx(resData[0]);
          else if (typeof resData === "string") verify = verifyIsTx(resData);

          if (verify) listo = false;
        } while (listo);

        await getAllWheels();
        toast.success("CONFIRM SUCCESSFULLY");
      }
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className="text-center">
        <h2 className={`mb-3 ${classes.subtitle}`}>CREATE</h2>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex gap-5 items-center">
          <div className="text-center">
            <label htmlFor="feeReciverWallet" className={classes.label}>
              Write the wallet that receives the fee
            </label>
            <Input
              size="sm"
              isClearable
              placeholder="wallet"
              id="feeReciverWallet"
              name="feeReciverWallet"
              value={data.feeReciverWallet}
              onChange={(e) => handleChange(e)}
              onClear={() => setData({ ...data, feeReciverWallet: "" })}
            />
          </div>
          <div className="text-center">
            <label htmlFor="maxPremios" className={classes.label}>
              Assign the prizes number
            </label>
            <Input
              min={0}
              size="sm"
              type="number"
              id="maxPremios"
              name="maxPremios"
              value={data.maxPremios}
              placeholder="prizes number"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <Button
            type="submit"
            variant="shadow"
            disabled={loading}
            className={classes.button_green_gradient}
          >
            {loading ? <Spinner /> : "Create Wheel"}
          </Button>
        </div>
      </form>
    </div>
  );
};
