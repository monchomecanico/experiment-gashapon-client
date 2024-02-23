export type Toyou = {
  version: "0.1.0";
  name: "toyou";
  instructions: [
    {
      name: "createWheel";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "base";
          isMut: true;
          isSigner: true;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                path: "base";
              },
              {
                kind: "const";
                type: "string";
                value: "wheel_id";
              }
            ];
          };
        },
        {
          name: "feeCollectorSc";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeServiceSc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "prizeAuth";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "maxPrizes";
          type: "u32";
        },
        {
          name: "serviceAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "depositWheel";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "sourceTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                account: "Wheel";
                path: "your_wheel.base";
              },
              {
                kind: "const";
                type: "string";
                value: "wheel_id";
              }
            ];
          };
          relations: ["boss"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "depositAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "buyTurn";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
        },
        {
          name: "turnSold";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                account: "Wheel";
                path: "wheel_id";
              },
              {
                kind: "const";
                type: "string";
                value: "turn-sold";
              },
              {
                kind: "account";
                type: "publicKey";
                path: "buyer";
              },
              {
                kind: "arg";
                type: "string";
                path: "_turn_num";
              }
            ];
          };
        },
        {
          name: "sourceTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeCollectorSc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "turnNum";
          type: "string";
        },
        {
          name: "turnPrice";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawWheel";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "sourceTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                account: "Wheel";
                path: "your_wheel.base";
              },
              {
                kind: "const";
                type: "string";
                value: "wheel_id";
              }
            ];
          };
          relations: ["boss"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "activeWheel";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          relations: ["boss"];
        }
      ];
      args: [];
    },
    {
      name: "closeWheel";
      accounts: [
        {
          name: "prizeAuth";
          isMut: true;
          isSigner: true;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          relations: ["prize_auth"];
        }
      ];
      args: [];
    },
    {
      name: "changeFee";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          relations: ["boss"];
        },
        {
          name: "feeCollectorSc";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "changeCtrl";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          relations: ["boss"];
        },
        {
          name: "prizeAuth";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createInitPrize";
      accounts: [
        {
          name: "prizeAuth";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
          relations: ["prize_auth"];
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                account: "Wheel";
                path: "wheel_id";
              },
              {
                kind: "arg";
                type: "string";
                path: "prize_num";
              }
            ];
          };
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "prizeNum";
          type: "string";
        }
      ];
    },
    {
      name: "assignPrize";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
          relations: ["boss"];
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
          relations: ["wheel_id"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mplTokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "typePrize";
          type: "u8";
        },
        {
          name: "quantity";
          type: "u64";
        },
        {
          name: "decimals";
          type: "u8";
        }
      ];
    },
    {
      name: "assingPrizeBkend";
      accounts: [
        {
          name: "prizeAuth";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
          relations: ["prize_auth"];
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
          relations: ["wheel_id"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "typePrize";
          type: "u8";
        },
        {
          name: "quantity";
          type: "u64";
        },
        {
          name: "decimals";
          type: "u8";
        }
      ];
    },
    {
      name: "reverseAssingPrize";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
          relations: ["boss"];
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
          relations: ["wheel_id"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mplTokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "assignWinner";
      accounts: [
        {
          name: "prizeAuth";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
          relations: ["prize_auth"];
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
        },
        {
          name: "turnSold";
          isMut: true;
          isSigner: false;
          relations: ["wheel_id"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "retrivePrize";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mplTokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "retrivePrizeSol";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wheelId";
          isMut: true;
          isSigner: false;
        },
        {
          name: "yourPrize";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "forceCloseWheel";
      accounts: [
        {
          name: "boss";
          isMut: true;
          isSigner: true;
        },
        {
          name: "yourWheel";
          isMut: true;
          isSigner: false;
          relations: ["boss"];
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "wheel";
      type: {
        kind: "struct";
        fields: [
          {
            name: "base";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "boss";
            type: "publicKey";
          },
          {
            name: "dateCreated";
            type: "i64";
          },
          {
            name: "turnsSold";
            type: "u64";
          },
          {
            name: "maxPrizes";
            type: "u64";
          },
          {
            name: "asgPrizes";
            type: "u64";
          },
          {
            name: "status";
            type: {
              defined: "WheelStatus";
            };
          },
          {
            name: "prizeAuth";
            type: "publicKey";
          },
          {
            name: "feeCollectorSc";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "turnSold";
      type: {
        kind: "struct";
        fields: [
          {
            name: "wheelId";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "buyer";
            type: "publicKey";
          },
          {
            name: "turnSta";
            type: "bool";
          },
          {
            name: "turnPrice";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "prize";
      type: {
        kind: "struct";
        fields: [
          {
            name: "wheelId";
            type: "publicKey";
          },
          {
            name: "typePrize";
            type: "u8";
          },
          {
            name: "winner";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "mintAta";
            type: "publicKey";
          },
          {
            name: "prizeQuantity";
            type: "u64";
          },
          {
            name: "prizeDecimals";
            type: "u8";
          },
          {
            name: "prizeNum";
            type: "string";
          },
          {
            name: "prizeSta";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "status";
            type: {
              defined: "PrizeStatus";
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "WheelReward";
      type: {
        kind: "struct";
        fields: [
          {
            name: "prizeType";
            type: {
              defined: "PrizeType";
            };
          },
          {
            name: "prizeQuantity";
            type: "u64";
          },
          {
            name: "prizeDecimals";
            type: "u8";
          },
          {
            name: "numPrizeA";
            type: "u64";
          },
          {
            name: "regPrizeA";
            type: "u64";
          },
          {
            name: "dlvPrizeA";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "WheelStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Open";
          },
          {
            name: "Active";
          },
          {
            name: "Closed";
          },
          {
            name: "Initial";
          }
        ];
      };
    },
    {
      name: "PrizeStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Open";
          },
          {
            name: "Active";
          },
          {
            name: "Repaid";
          },
          {
            name: "Defaulted";
          }
        ];
      };
    },
    {
      name: "PrizeType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Native";
          },
          {
            name: "Token";
          },
          {
            name: "Nft";
          },
          {
            name: "Tryagain";
          },
          {
            name: "Freeslot";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "CreateWheel";
      fields: [
        {
          name: "wheel";
          type: "publicKey";
          index: false;
        },
        {
          name: "boss";
          type: "publicKey";
          index: false;
        },
        {
          name: "user";
          type: "publicKey";
          index: false;
        },
        {
          name: "prizes";
          type: "u32";
          index: false;
        },
        {
          name: "label";
          type: "string";
          index: true;
        }
      ];
    },
    {
      name: "UseTurnSold";
      fields: [
        {
          name: "wheel";
          type: "publicKey";
          index: false;
        },
        {
          name: "turnsold";
          type: "publicKey";
          index: false;
        },
        {
          name: "user";
          type: "publicKey";
          index: false;
        },
        {
          name: "label";
          type: "string";
          index: true;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidTokenAccount";
      msg: "Invalid Token Account";
    },
    {
      code: 6001;
      name: "InvalidOwnerTokenAccount";
      msg: "Invalid Owner Token Account";
    },
    {
      code: 6002;
      name: "AccountAlreadyInitialized";
      msg: "Account Already Initialized ";
    },
    {
      code: 6003;
      name: "ClaimAmountIsZero";
      msg: "Claim is Empty ask for new amout";
    },
    {
      code: 6004;
      name: "SuspiciousTransaction";
      msg: "Suspicious transaction detected";
    },
    {
      code: 6005;
      name: "SymbolTooLong";
      msg: "Symbol too long";
    },
    {
      code: 6006;
      name: "ArithmeticError";
      msg: "Arithmetic Error";
    },
    {
      code: 6007;
      name: "NotEnoughBalance";
      msg: "Not Enough Balance";
    },
    {
      code: 6008;
      name: "WrongStatus";
      msg: "Wrong Status";
    },
    {
      code: 6009;
      name: "AlreadyClaim";
      msg: "Already Claim";
    },
    {
      code: 6010;
      name: "PrizesNotAssign";
      msg: "Prizes Not Assign";
    },
    {
      code: 6011;
      name: "PrizesSoldOut";
      msg: "Prizes Sold Out";
    },
    {
      code: 6012;
      name: "WrongTypePrize";
      msg: "Wrong Type";
    }
  ];
};

export const IDL: Toyou = {
  version: "0.1.0",
  name: "toyou",
  instructions: [
    {
      name: "createWheel",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "base",
          isMut: true,
          isSigner: true,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "account",
                type: "publicKey",
                path: "base",
              },
              {
                kind: "const",
                type: "string",
                value: "wheel_id",
              },
            ],
          },
        },
        {
          name: "feeCollectorSc",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeServiceSc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "prizeAuth",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "maxPrizes",
          type: "u32",
        },
        {
          name: "serviceAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "depositWheel",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "sourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "account",
                type: "publicKey",
                account: "Wheel",
                path: "your_wheel.base",
              },
              {
                kind: "const",
                type: "string",
                value: "wheel_id",
              },
            ],
          },
          relations: ["boss"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "depositAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "buyTurn",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "turnSold",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "account",
                type: "publicKey",
                account: "Wheel",
                path: "wheel_id",
              },
              {
                kind: "const",
                type: "string",
                value: "turn-sold",
              },
              {
                kind: "account",
                type: "publicKey",
                path: "buyer",
              },
              {
                kind: "arg",
                type: "string",
                path: "_turn_num",
              },
            ],
          },
        },
        {
          name: "sourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeCollectorSc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "turnNum",
          type: "string",
        },
        {
          name: "turnPrice",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawWheel",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "sourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "account",
                type: "publicKey",
                account: "Wheel",
                path: "your_wheel.base",
              },
              {
                kind: "const",
                type: "string",
                value: "wheel_id",
              },
            ],
          },
          relations: ["boss"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "activeWheel",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          relations: ["boss"],
        },
      ],
      args: [],
    },
    {
      name: "closeWheel",
      accounts: [
        {
          name: "prizeAuth",
          isMut: true,
          isSigner: true,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          relations: ["prize_auth"],
        },
      ],
      args: [],
    },
    {
      name: "changeFee",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          relations: ["boss"],
        },
        {
          name: "feeCollectorSc",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "changeCtrl",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          relations: ["boss"],
        },
        {
          name: "prizeAuth",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createInitPrize",
      accounts: [
        {
          name: "prizeAuth",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
          relations: ["prize_auth"],
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "account",
                type: "publicKey",
                account: "Wheel",
                path: "wheel_id",
              },
              {
                kind: "arg",
                type: "string",
                path: "prize_num",
              },
            ],
          },
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "prizeNum",
          type: "string",
        },
      ],
    },
    {
      name: "assignPrize",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
          relations: ["boss"],
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
          relations: ["wheel_id"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mplTokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "typePrize",
          type: "u8",
        },
        {
          name: "quantity",
          type: "u64",
        },
        {
          name: "decimals",
          type: "u8",
        },
      ],
    },
    {
      name: "assingPrizeBkend",
      accounts: [
        {
          name: "prizeAuth",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
          relations: ["prize_auth"],
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
          relations: ["wheel_id"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "typePrize",
          type: "u8",
        },
        {
          name: "quantity",
          type: "u64",
        },
        {
          name: "decimals",
          type: "u8",
        },
      ],
    },
    {
      name: "reverseAssingPrize",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
          relations: ["boss"],
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
          relations: ["wheel_id"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mplTokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "assignWinner",
      accounts: [
        {
          name: "prizeAuth",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
          relations: ["prize_auth"],
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
        },
        {
          name: "turnSold",
          isMut: true,
          isSigner: false,
          relations: ["wheel_id"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "retrivePrize",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mplTokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "retrivePrizeSol",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "wheelId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "yourPrize",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "forceCloseWheel",
      accounts: [
        {
          name: "boss",
          isMut: true,
          isSigner: true,
        },
        {
          name: "yourWheel",
          isMut: true,
          isSigner: false,
          relations: ["boss"],
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "wheel",
      type: {
        kind: "struct",
        fields: [
          {
            name: "base",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "boss",
            type: "publicKey",
          },
          {
            name: "dateCreated",
            type: "i64",
          },
          {
            name: "turnsSold",
            type: "u64",
          },
          {
            name: "maxPrizes",
            type: "u64",
          },
          {
            name: "asgPrizes",
            type: "u64",
          },
          {
            name: "status",
            type: {
              defined: "WheelStatus",
            },
          },
          {
            name: "prizeAuth",
            type: "publicKey",
          },
          {
            name: "feeCollectorSc",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "turnSold",
      type: {
        kind: "struct",
        fields: [
          {
            name: "wheelId",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "buyer",
            type: "publicKey",
          },
          {
            name: "turnSta",
            type: "bool",
          },
          {
            name: "turnPrice",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "prize",
      type: {
        kind: "struct",
        fields: [
          {
            name: "wheelId",
            type: "publicKey",
          },
          {
            name: "typePrize",
            type: "u8",
          },
          {
            name: "winner",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "mintAta",
            type: "publicKey",
          },
          {
            name: "prizeQuantity",
            type: "u64",
          },
          {
            name: "prizeDecimals",
            type: "u8",
          },
          {
            name: "prizeNum",
            type: "string",
          },
          {
            name: "prizeSta",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "status",
            type: {
              defined: "PrizeStatus",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "WheelReward",
      type: {
        kind: "struct",
        fields: [
          {
            name: "prizeType",
            type: {
              defined: "PrizeType",
            },
          },
          {
            name: "prizeQuantity",
            type: "u64",
          },
          {
            name: "prizeDecimals",
            type: "u8",
          },
          {
            name: "numPrizeA",
            type: "u64",
          },
          {
            name: "regPrizeA",
            type: "u64",
          },
          {
            name: "dlvPrizeA",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "WheelStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Open",
          },
          {
            name: "Active",
          },
          {
            name: "Closed",
          },
          {
            name: "Initial",
          },
        ],
      },
    },
    {
      name: "PrizeStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Open",
          },
          {
            name: "Active",
          },
          {
            name: "Repaid",
          },
          {
            name: "Defaulted",
          },
        ],
      },
    },
    {
      name: "PrizeType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Native",
          },
          {
            name: "Token",
          },
          {
            name: "Nft",
          },
          {
            name: "Tryagain",
          },
          {
            name: "Freeslot",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "CreateWheel",
      fields: [
        {
          name: "wheel",
          type: "publicKey",
          index: false,
        },
        {
          name: "boss",
          type: "publicKey",
          index: false,
        },
        {
          name: "user",
          type: "publicKey",
          index: false,
        },
        {
          name: "prizes",
          type: "u32",
          index: false,
        },
        {
          name: "label",
          type: "string",
          index: true,
        },
      ],
    },
    {
      name: "UseTurnSold",
      fields: [
        {
          name: "wheel",
          type: "publicKey",
          index: false,
        },
        {
          name: "turnsold",
          type: "publicKey",
          index: false,
        },
        {
          name: "user",
          type: "publicKey",
          index: false,
        },
        {
          name: "label",
          type: "string",
          index: true,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidTokenAccount",
      msg: "Invalid Token Account",
    },
    {
      code: 6001,
      name: "InvalidOwnerTokenAccount",
      msg: "Invalid Owner Token Account",
    },
    {
      code: 6002,
      name: "AccountAlreadyInitialized",
      msg: "Account Already Initialized ",
    },
    {
      code: 6003,
      name: "ClaimAmountIsZero",
      msg: "Claim is Empty ask for new amout",
    },
    {
      code: 6004,
      name: "SuspiciousTransaction",
      msg: "Suspicious transaction detected",
    },
    {
      code: 6005,
      name: "SymbolTooLong",
      msg: "Symbol too long",
    },
    {
      code: 6006,
      name: "ArithmeticError",
      msg: "Arithmetic Error",
    },
    {
      code: 6007,
      name: "NotEnoughBalance",
      msg: "Not Enough Balance",
    },
    {
      code: 6008,
      name: "WrongStatus",
      msg: "Wrong Status",
    },
    {
      code: 6009,
      name: "AlreadyClaim",
      msg: "Already Claim",
    },
    {
      code: 6010,
      name: "PrizesNotAssign",
      msg: "Prizes Not Assign",
    },
    {
      code: 6011,
      name: "PrizesSoldOut",
      msg: "Prizes Sold Out",
    },
    {
      code: 6012,
      name: "WrongTypePrize",
      msg: "Wrong Type",
    },
  ],
};
