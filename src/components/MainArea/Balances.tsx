import { useState, useEffect } from "react";
import { HStack, Text, Spacer, Box, Heading } from "@chakra-ui/react";
import { Contract, ethers, BigNumber } from "ethers";
import { formatNumber, toDecimal } from "../../utils";
import { targetNetwork } from "./ConnectWallet";

type Balance = {
  balance: BigNumber, 
  decimals: number
}

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
  const { dgvcAddress, dgvcLpAddress, usdcAddress, wbtcAddress } = targetNetwork;
  console.log('first', address);
  
  const DGVC2ABI = require("../../abi/DGVC2.json");
  const USDCABI = require("../../abi/ERC20.json");
  const WBTCABI = require("../../abi/ERC20.json");
  const DGVCLPABI = require("../../abi/ERC20.json");

  const [dgvcToken, setDgvcToken] = useState<Contract>();
  const [usdcToken, setUsdcToken] = useState<Contract>();
  const [wbtcToken, setWbtcToken] = useState<Contract>();
  const [dgvcLpToken, setDgvcLpToken] = useState<Contract>();

  const [dgvcBalance, setDgvcBalance] = useState<Balance>({balance: BigNumber.from(0), decimals: 0});
  const [usdcBalance, setUsdcBalance] = useState<Balance>({balance: BigNumber.from(0), decimals: 0});
  const [wbtcBalance, setWbtcBalance] = useState<Balance>({balance: BigNumber.from(0), decimals: 0});
  const [maticBalance, setMaticBalance] = useState<Balance>({balance: BigNumber.from(0), decimals: 0});
  const [dgvcLpBalance, setDgvcLpBalance] = useState<Balance>({balance: BigNumber.from(0), decimals: 0});

  useEffect(() => {
    if (provider) {
      setDgvcToken(new ethers.Contract(dgvcAddress, DGVC2ABI, provider));
      setUsdcToken(new ethers.Contract(usdcAddress, USDCABI, provider));
      setWbtcToken(new ethers.Contract(wbtcAddress, WBTCABI, provider));
      setDgvcLpToken(new ethers.Contract(dgvcLpAddress, DGVCLPABI, provider));
    }
  }, [provider]);

  useEffect(() => {
    if (address) {
      fetchUserBalance();
    }
  }, [address]);

  const fetchUserBalance = async () => {
    const dgvcBalanceInfo = {
      balance: await dgvcToken!.balanceOf(address),
      decimals: await dgvcToken!.decimals()
    }
 
    const usdcBalanceInfo = {
      balance: await usdcToken!.balanceOf(address),
      decimals: await usdcToken!.decimals()
    }

    const wbtcBalanceInfo = {
      balance: await wbtcToken!.balanceOf(address),
      decimals: await wbtcToken!.decimals()
    }

    const maticBalanceInfo = {
      balance: await provider.getBalance(address),
      decimals: 18
    }

    const dgvcLpBalanceInfo = {
      balance: await dgvcLpToken!.balanceOf(address),
      decimals: await dgvcLpToken!.decimals()
    }

    setDgvcBalance(dgvcBalanceInfo);
    setUsdcBalance(usdcBalanceInfo);
    setWbtcBalance(wbtcBalanceInfo);
    setMaticBalance(maticBalanceInfo);
    setDgvcLpBalance(dgvcLpBalanceInfo);
  };

  return (
    <Box pt={{ base: "1.5rem", md: "2rem" }}>
      <Box border="1.5px solid white" p="1.5rem" px="2rem" rounded="xl">
        <Heading fontSize="2xl" pb="1rem">
          Balances
        </Heading>
        <TokenBalance tokenName="DGVC" balance={formatNumber(dgvcBalance.balance, dgvcBalance.decimals)} />
        <TokenBalance tokenName="DGVC LP" balance={formatNumber(dgvcLpBalance.balance, dgvcLpBalance.decimals)}/>
        <TokenBalance tokenName="Matic" balance={formatNumber(maticBalance.balance, maticBalance.decimals)}/>
        <TokenBalance tokenName="Usdc" balance={formatNumber(usdcBalance.balance, usdcBalance.decimals)}/>
        <TokenBalance tokenName="Wbtc" balance={formatNumber(wbtcBalance.balance, dgvcBalance.decimals)}/>
      </Box>
    </Box>
  );
}

export default Balances;
