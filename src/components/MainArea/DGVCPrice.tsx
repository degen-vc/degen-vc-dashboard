import { HStack, Text, Spacer, NumberInput, Heading, Box, NumberInputField, Button, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatNumber, toDecimal } from "../../utils";
import { targetNetwork } from "./ConnectWallet";
import { Contract, ethers, BigNumber } from "ethers";
import { Web3Provider, Signer } from "../../types";
import { MaxUint256 } from "@ethersproject/constants";

function DGVCPrice({signer, provider}: {signer: Signer | undefined, provider: any}) {
  const { tokenSwapAddress, dgvc1Address } = targetNetwork;

  const toast = useToast();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const TokenSwapABI = require("../../abi/TokenSwap.json");
  const ERC20ABI = require("../../abi/ERC20.json");

  const [tokenSwap, setTokenSwap] = useState<Contract>();
  const [v1Token, setDgvc1Swap] = useState<Contract>();

  useEffect(() => {
    if (provider) {
      setTokenSwap(new ethers.Contract(tokenSwapAddress, TokenSwapABI, provider));
      setDgvc1Swap(new ethers.Contract(dgvc1Address, ERC20ABI, provider));
    }
  }, [provider]);

  const bridge = async () => {
    setLoading(true);
    if (signer) {
      const allowance = await v1Token!.allowance(signer.getAddress(), tokenSwapAddress);
      console.log(allowance);
      console.log(value);
      console.log();
      
      if (allowance.lt(value)) {
        try {
          const approveTxn = await v1Token!
            .connect(signer!)
            .approve(tokenSwapAddress, MaxUint256);
          await approveTxn.wait();
        } catch {
          errorToast("Can't Approve");
          setLoading(false);
          return;
        }
      }
      try {
        const tx = await tokenSwap!.connect(signer!).bridge(value);
        await tx.wait();
        // await fetchUserBalance();
      } catch {
        errorToast("Can't Bridge");
      }
      setLoading(false);
    }
  };

  const errorToast = (title: string, description: string = "") => {
    toast({
      title,
      description,
      status: "error",
      isClosable: true,
      duration: 3000,
    });
  };

  return (
    <Box pt={{ base: "1.5rem", md: "2rem" }}>
      <Box border="1.5px solid white" p="1.5rem" px="2rem" rounded="xl">
      <Heading fontSize="2xl" pb="1rem">
          Migrate to DGVCv2
        </Heading>
    <HStack>
      <NumberInput
      onChange={(valueString) => setValue(valueString)}
      value={value}>
      <NumberInputField />
      </NumberInput>
      {/* <Text>$DGVC</Text> */}
      <Spacer />
      <Button
      isLoading={loading}
      pl="1rem"
      mt="1rem"
      onClick={() => {
        bridge();
      }}>Migrate</Button>
      {/* <Text>XX</Text> */}
    </HStack>
    </Box>
    </Box>
  );
}

export default DGVCPrice;
