// main tools
import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// components
import { Row } from "@/components/atoms/row";
import { Col } from "@/components/atoms/col";
import { SelectNft } from "./select-nft";

// nextui
import { Button, Input, Spinner } from "@nextui-org/react";

// solana
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { NATIVE_MINT } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

// utils
import { PrizeType, assignPrize } from "@/utils/toyoufrontv2";
import { base_url } from "@/utils/fetch";
import { INITIAL_STATE } from "../utils";

// style
import classes from "./style.module.css";

// types
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { PrizeDataType } from "@/types/models/prize";
import { NftDataType } from "@/types/models/nft";
import { SetStateType } from "@/types";
import { FC } from "react";

type FormProps = {
  flag: boolean;
  selectedWheel: any;
  wheelPrizesList: any[];
  setFlag: SetStateType<boolean>;
  getAllPrizeWheel: () => Promise<void>;
};

export const Form: FC<FormProps> = ({
  flag,
  setFlag,
  selectedWheel,
  wheelPrizesList,
  getAllPrizeWheel,
}) => {
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [nftList, setNftList] = useState<NftDataType[]>();
  const [nftSelected, setNftSelected] = useState<NftDataType[]>([]);
  const [prizeData, setprizeData] = useState<PrizeDataType>(INITIAL_STATE);

  const handleInputNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setprizeData({ ...prizeData, [name]: Number(value) });
  };

  const getNfts = useCallback(async () => {
    try {
      setLoading(true);
      const address = publicKey?.toBase58();
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_UTILS_NFT_URL}`,
        {
          tokenAddress: address,
          firstCreators: [
            "6b8tDmPWAkzDQycQS6hnVxLxBjr3vWBWnQgABPMv8PeK",
            "Ht1xMXnSYyHsHSXcqjkkvPKkcLEuRgdySow9wkJ9Dfwz",
          ],
        }
      );
      console.log("🚀 ~ file: index.tsx:85 ~ getNfts ~ data:", data);
      setNftList(data);
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:66 ~ getNfts ~ error:", error);
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  const handleSelection = (selection: PrizeType) => {
    switch (selection) {
      case PrizeType.Sol:
        setprizeData({
          ...INITIAL_STATE,
          decimals: "9",
          tipo: PrizeType.Sol,
          mint: NATIVE_MINT.toBase58(),
        });
        break;
      case PrizeType.Token:
        setprizeData({
          ...INITIAL_STATE,
          tipo: PrizeType.Token,
        });
        break;

      case PrizeType.Nft:
        setNftSelected([]);

        setprizeData({
          ...INITIAL_STATE,
          tipo: PrizeType.Nft,
        });
        break;

      case PrizeType.Tryagain:
        setprizeData({
          ...INITIAL_STATE,
          tipo: PrizeType.Tryagain,
          mint: NATIVE_MINT.toBase58(),
        });
        break;

      default:
        setprizeData({
          ...INITIAL_STATE,
        });
        break;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("first", prizeData);

    try {
      setLoading(true);
      if (![PrizeType.Nft].includes(prizeData.tipo!)) {
        const { data } = await axios.post(`${base_url}/assign-prize`, {
          ...prizeData,
          monto: Number(prizeData.monto) * 10 ** Number(prizeData.decimals),
          wheelId: selectedWheel.publicKey.toBase58(),
        });
        console.log("🚀 ~ file: index.tsx:104 ~ handleSubmit ~ data:", data);
      } else {
        if (nftSelected.length > wheelPrizesList.length)
          return toast.error(
            `	You can only assign a maximum of ${wheelPrizesList.length} prizes,`
          );

        let arrData: any[] = [];

        wheelPrizesList.forEach((item, index) => {
          if (index < nftSelected.length) {
            if (!nftSelected[index].tokenStandard)
              arrData.push({
                prizequantity: 1,
                prizedecimals: 0,
                is_Solana: false,
                prizetype: PrizeType.Nft,
                yourPrize: item.publicKey,
                isYouWallet: wallet as NodeWallet,
                yourWheel: selectedWheel.publicKey,
                tokenIDWheel: new PublicKey(nftSelected[index].address),
              });
          }
        });

        console.log(
          "🚀 ~ file: index.tsx:142 ~ handleSubmit ~ arrData:",
          arrData
        );

        for (const item of arrData) {
          console.log("entro a for of ");
          console.log("🚀 ~ DENTRO DE FOR OF item:", item);
          const { response, error } = await assignPrize({ ...item });

          if (error) {
            console.log(
              "🚀 ~ file: index.tsx:148 ~ handleSubmit ~ error:",
              error
            );
            toast.error(`Fail one Assign Nft: ${String(error)}`);
            return;
          }

          console.log(
            "🚀 ~ file: index.tsx:178 ~ handleSubmit ~ response:",
            response
          );
        }
      }

      await getAllPrizeWheel();
      setFlag(!flag);
      toast.success("Prize assigned successfully");
    } catch (err) {
      console.log("🚀 ~ file: index.tsx:130 ~ handleSubmit ~ err:", err);
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5 text-center">
        <span className={classes.text}>Select a pryze type</span>
      </div>
      <Row className="mb-3">
        <Col width="w-1/2 md:w-1/4" className="flex justify-center">
          <Button
            color="primary"
            onClick={() => handleSelection(PrizeType.Sol)}
            variant={prizeData.tipo !== PrizeType.Sol ? "bordered" : "solid"}
          >
            SOLANA
          </Button>
        </Col>
        <Col width="w-1/2 md:w-1/4" className="flex justify-center">
          <Button
            color="primary"
            onClick={() => handleSelection(PrizeType.Token)}
            variant={prizeData.tipo !== PrizeType.Token ? "bordered" : "solid"}
          >
            TOKEN
          </Button>
        </Col>
        <Col width="w-1/2 md:w-1/4" className="flex justify-center">
          <Button
            color="primary"
            onClick={() => handleSelection(PrizeType.Nft)}
            variant={prizeData.tipo !== PrizeType.Nft ? "bordered" : "solid"}
          >
            NFT
          </Button>
        </Col>

        <Col width="w-1/2 md:w-1/4" className="flex justify-center">
          <Button
            color="primary"
            onClick={() => handleSelection(PrizeType.Tryagain)}
            variant={
              prizeData.tipo !== PrizeType.Tryagain ? "bordered" : "solid"
            }
          >
            &quot;TRY AGAIN&quot;
          </Button>
        </Col>
      </Row>

      <form onSubmit={handleSubmit}>
        <Row className="justify-center items-center">
          <Col width="w-full" className="text-center mb-3">
            <span className={classes.text}>Assign each prize</span>
            <p className={classes.text}>
              (remaining: {wheelPrizesList.length})
            </p>
          </Col>

          {[PrizeType.Sol, PrizeType.Token].includes(prizeData.tipo!) && (
            <>
              <Col
                width="w-full/ lg:w-1/3"
                className="flex gap-3 justify-center"
              >
                <div>
                  <label htmlFor="monto" className={classes.label}>
                    Assigns the amount the player will receive with this prize
                  </label>
                  <Input
                    min={0}
                    step="any"
                    id="monto"
                    type="number"
                    name="monto"
                    placeholder="0.2"
                    value={prizeData.monto as string}
                    onChange={(e) => handleInputNumberChange(e)}
                  />
                </div>
              </Col>
              <Col
                width="w-full/ lg:w-1/3"
                className="flex gap-3 justify-center"
              >
                <div>
                  <label htmlFor="cuantos" className={classes.label}>
                    Assigns how many prizes have this amount
                  </label>
                  <Input
                    min={0}
                    step="any"
                    id="cuantos"
                    type="number"
                    name="cuantos"
                    placeholder="10"
                    value={prizeData.cuantos as string}
                    onChange={(e) => handleInputNumberChange(e)}
                  />
                </div>
              </Col>
            </>
          )}
          {prizeData.tipo === PrizeType.Token && (
            <>
              <Col width="w-full/ lg:w-1/3" className="flex justify-center">
                <div>
                  <label htmlFor="decimals" className={classes.label}>
                    type the number of decimal places in the token that you will
                    use as a prize
                  </label>

                  <Input
                    min={0}
                    id="decimals"
                    type="number"
                    placeholder="9"
                    name="decimals"
                    value={prizeData.decimals as string}
                    onChange={(e) => handleInputNumberChange(e)}
                  />
                </div>
              </Col>

              <Col width="w-full" className="mt-3 flex justify-center">
                <div className="w-full lg:w-3/4">
                  <label htmlFor="mint" className={classes.label}>
                    Enter the address of the token or NFT you want to use
                  </label>
                  <Input
                    isClearable
                    name="mint"
                    value={prizeData.mint}
                    placeholder="Token Address"
                    onClear={() => setprizeData({ ...prizeData, mint: "" })}
                    onChange={(e) =>
                      setprizeData({
                        ...prizeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
              </Col>
            </>
          )}

          {prizeData.tipo === PrizeType.Nft && (
            <SelectNft
              loading={loading}
              getNfts={getNfts}
              nftList={nftList}
              nftSelected={nftSelected}
              setNftSelected={setNftSelected}
            />
          )}

          {prizeData.tipo === PrizeType.Tryagain && (
            <Col width="w-full md:w-1/3">
              <div className="w-full ">
                <label htmlFor="cuantos" className={classes.label}>
                  Assigns how many prizes have this amount
                </label>
                <Input
                  min={0}
                  step="any"
                  id="cuantos"
                  type="number"
                  name="cuantos"
                  placeholder="10"
                  value={prizeData.cuantos as string}
                  onChange={(e) => handleInputNumberChange(e)}
                />
              </div>
            </Col>
          )}

          <div className="mt-3 w-full flex justify-center gap-3">
            <Button
              type="submit"
              variant="shadow"
              className={classes.button_green_gradient}
              disabled={loading}
            >
              {loading ? <Spinner color="danger" /> : "Assign prize"}
            </Button>
          </div>
        </Row>
      </form>
    </div>
  );
};
