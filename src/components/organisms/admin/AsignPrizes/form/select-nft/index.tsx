// main tools

import { useState, useCallback, useEffect } from "react";

//components
import { Row } from "@/components/atoms/row";
import { Col } from "@/components/atoms/col";

//next ui
import {
  Avatar,
  AvatarGroup,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
} from "@nextui-org/react";

// styles
import classes from "./styles.module.css";

// types
import { NftDataType } from "@/types/models/nft";
import { SetStateType } from "@/types";
import { FC } from "react";

type selectNftProps = {
  loading: boolean;
  nftList?: NftDataType[];
  nftSelected: NftDataType[];
  getNfts: () => Promise<void>;
  setNftSelected: SetStateType<NftDataType[]>;
};

export const SelectNft: FC<selectNftProps> = ({
  getNfts,
  nftList,
  loading,
  nftSelected,
  setNftSelected,
}) => {
  const [shownftList, setShownftList] = useState(false);
  const handleShowNftList = () => setShownftList(!shownftList);

  const handleSelectNft = useCallback(
    (nft: NftDataType) => {
      if (nftSelected.some((i) => i.address === nft.address)) {
        setNftSelected((prev) => prev.filter((i) => i.address !== nft.address));
      } else {
        setNftSelected((prev) => [...prev, nft]);
      }
    },
    [nftSelected, setNftSelected]
  );

  useEffect(() => {
    if (shownftList) getNfts();
  }, [shownftList, getNfts]);

  return (
    <>
      {nftSelected.length > 0 ? (
        <div
          onClick={() => handleShowNftList()}
          className="w-full flex justify-center"
        >
          <AvatarGroup>
            {nftSelected.map((item) => (
              <Avatar size="lg" radius="lg" key={item.image} src={item.image} />
            ))}
          </AvatarGroup>
        </div>
      ) : (
        <div
          role="button"
          className={classes.nftCard}
          onClick={() => handleShowNftList()}
        ></div>
      )}

      <Modal
        size="xl"
        closeButton
        isDismissable
        isOpen={shownftList}
        onOpenChange={() => handleShowNftList()}
      >
        <ModalContent className={classes.selectNft_base}>
          <ModalBody className={classes.selectNft_body}>
            <Row>
              {loading ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                nftList?.map((nft: NftDataType) => {
                  return (
                    <Col
                      key={nft.address}
                      width="w-2/4 md:w-1/4"
                      className="flex justify-center"
                    >
                      <div
                        onClick={() => handleSelectNft(nft)}
                        className={
                          nftSelected.some((i) => i.address === nft.address)
                            ? classes.nftSelected
                            : classes.nftCard
                        }
                      >
                        <Image
                          removeWrapper
                          alt={nft?.name}
                          src={nft?.image}
                          className={`w-full h-full object-cover ${classes.img}`}
                        />
                      </div>
                    </Col>
                  );
                })
              )}
            </Row>
            <div className="flex justify-center">
              <Button onClick={handleShowNftList}>Accept</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
