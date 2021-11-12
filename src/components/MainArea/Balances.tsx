import { useState, useEffect } from "react";
import { HStack, Text, Spacer, Box, Heading, Button } from "@chakra-ui/react";
import { Contract, ethers, BigNumber } from "ethers";
import { Web3Provider, Signer } from "../../types";
import ConnectWallet, { targetNetwork } from "./ConnectWallet";

const TokenBalance = ({
  tokenName,
  balance,
}: {
  tokenName: string;
  balance: string;
}) => (
  <HStack fontSize="xl" pb="0.5rem">
    <Text textTransform="uppercase">{tokenName}</Text>
    <Spacer />
    <Text>{balance}</Text>
  </HStack>
);

function Balances({address, provider}: {address: string | undefined, provider: any} ) {
  const { dgvcAddress } = targetNetwork;
  console.log('first', address);
  
  const DGVC2ABI = require("../../abi/DGVC2.json");

  const [dgvcToken, setDgvcToken] = useState<Contract>();
  const [dgvcBalance, setDgvcBalance] = useState<BigNumber>(BigNumber.from(0));
  // const [provider, setProvider] = useState<Web3Provider>();

  useEffect(() => {
    if (provider) {
      setDgvcToken(new ethers.Contract(dgvcAddress, DGVC2ABI, provider));
    }
  }, [provider]);

  useEffect(() => {
    if (address) {
      fetchUserBalance();
    }
  }, [address]);

  const fetchUserBalance = async () => {
    console.log('fetchUserBalance', address);
    console.log(dgvcToken);
    
    const bal = await dgvcToken!.balanceOf(address?.toString())
    console.log(bal);
    
    setDgvcBalance(await dgvcToken!.balanceOf(address));
  };

  return (
    <Box pt={{ base: "1.5rem", md: "2rem" }}>
      <Box border="1.5px solid white" p="1.5rem" px="2rem" rounded="xl">
        <Heading fontSize="2xl" pb="1rem">
          Balances
        </Heading>
        <TokenBalance tokenName="DGVC" balance={dgvcBalance.toString()} />
        <TokenBalance tokenName="DGVC LP" balance="XX"/>
        <TokenBalance tokenName="Matic" balance="XX"/>
        <TokenBalance tokenName="Usdc" balance="XX"/>
        <TokenBalance tokenName="Wbtc" balance="XX"/>
      </Box>
    </Box>
  );
}

export default Balances;
