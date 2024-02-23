// components
import { Spinner } from "@nextui-org/react";
import { Row } from "@/components/atoms/row";
import { Col } from "@/components/atoms/col";

// commons
import { base58ToString } from "@/commons";

//styles
import classes from "./styles.module.css";

// types
import { SetStateType } from "@/types";
import { FC } from "react";
import Image from "next/image";

type SelectWheelProps = {
  loading: boolean;
  wheelsList?: any[];
  selectedWheel: any;
  setSelectedWheel: SetStateType<any>;
};

export const SelectWheel: FC<SelectWheelProps> = ({
  loading,
  wheelsList,
  selectedWheel,
  setSelectedWheel,
}) => {
  const handleSelectedWheel = (item: any) => {
    setSelectedWheel(item);
  };

  return (
    <div className={classes.container}>
      {loading ? (
        <Spinner />
      ) : (
        <Row className="h-100 justify-center md:justify-start">
          {wheelsList?.length! > 0 ? (
            wheelsList?.map((item) => (
              <Col
                className="mb-5"
                key={base58ToString(item.publicKey)}
                width="w-full sm:w-2/4 md:w-3/4 lg:w-2/4 xl:w-2/4"
              >
                <div
                  role="button"
                  onClick={() => handleSelectedWheel(item)}
                  className={classes.wheelCard}
                >
                  <Image
                    width={150}
                    height={200}
                    alt="wheelIcon"
                    className="z-10 object-cover"
                    src="/assets/roulette/wheel.png"
                  />
                  <div
                    className={
                      selectedWheel?.publicKey.toBase58() ===
                      base58ToString(item.publicKey)
                        ? classes.wrapText_selected
                        : classes.wrapText
                    }
                  >
                    <span className={classes.textCard}>
                      {base58ToString(item.publicKey)}
                    </span>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <div>
              <span className={classes.text}>
                There are no roulettes created
              </span>
            </div>
          )}
        </Row>
      )}
    </div>
  );
};
