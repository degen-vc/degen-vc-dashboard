import { HStack, Text, Spacer, NumberInput, Heading, Box, NumberInputField, Button, useToast, InputRightElement } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatNumber, toDecimal } from "../../utils";
import { targetNetwork } from "./ConnectWallet";
import { Contract, ethers, BigNumber, utils } from "ethers";
import { Web3Provider, Signer } from "../../types";
import { MaxUint256 } from "@ethersproject/constants";

function DGVCPrice({signer, provider}: {signer: Signer | undefined, provider: any}) {
  const { tokenSwapAddress, dgvc1Address, dgvcAddress } = targetNetwork;

  const toast = useToast();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const TokenSwapABI = require("../../abi/TokenSwap.json");
  const ERC20ABI = require("../../abi/ERC20.json");

  const [tokenSwap, setTokenSwap] = useState<Contract>();
  const [v1Token, setDgvc1Contract] = useState<Contract>();
  const [dgvcToken, setDgvcToken] = useState<Contract>();

  const [dgvcBalance, setDgvcBalance] = useState<BigNumber>(BigNumber.from(0));
  const [dgvcV2Balance, setDgvcV2Balance] = useState<BigNumber>(BigNumber.from(0));
  const [swapBalance, setSwapBalance] = useState<BigNumber>(BigNumber.from(0));

  useEffect(() => {
    if (provider) {
      setTokenSwap(new ethers.Contract(tokenSwapAddress, TokenSwapABI, provider));
      setDgvc1Contract(new ethers.Contract(dgvc1Address, ERC20ABI, provider));
      setDgvcToken(new ethers.Contract(dgvcAddress, ERC20ABI, provider));
    }
  }, [provider]);

  const fetchBalances = async () => {
    if (signer) {
      setDgvcBalance(await v1Token!.balanceOf(signer.getAddress()));
      setSwapBalance(await dgvcToken!.balanceOf(tokenSwapAddress));
    }
  }

  useEffect(() => {
    if (v1Token && dgvcToken) {
      fetchBalances();
    }
  }, [v1Token]);

  const bridge = async () => {
    setLoading(true);
    if (signer) {
      const allowance = await v1Token!.allowance(signer.getAddress(), tokenSwapAddress);
      
      if (allowance.lt(utils.parseUnits(value, 18))) {
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
        const tx = await tokenSwap!.connect(signer!).bridge(utils.parseUnits(value, 18));
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
    <Text color="gray.300">DGVCv1 Balance: {formatNumber(dgvcBalance, 18)}</Text>
      <NumberInput
      onChange={(valueString) => setValue(valueString)}
      value={value}>
        <InputRightElement w="4.5rem" mr="0.1rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setValue(formatNumber(swapBalance, 18))}
            isDisabled={!signer}
          >
            Max
          </Button>
        </InputRightElement>
        <NumberInputField />
      </NumberInput>
      <Spacer />
      <Button
      isLoading={loading}
      pl="1rem"
      mt="1rem"
      isDisabled={!signer}
      onClick={() => {
        bridge();
      }}>Migrate</Button>
    </HStack>
    </Box>
    </Box>
  );
}

export default DGVCPrice;
