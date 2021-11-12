import { useState, useEffect } from "react";

import { Flex, Text, Link, HStack, Box} from "@chakra-ui/react";
import ConnectWallet, { targetNetwork } from "./ConnectWallet";
import { Web3Provider, Signer } from "../../types";

function TopLinks() {
  const [provider, setProvider] = useState<Web3Provider>();
  const [signer, setSigner] = useState<Signer>();
  const [signerAddress, setSignerAddress] = useState<string>();

  useEffect(() => {
    if (provider) {
      setSigner(provider.getSigner(0));
    }
  }, [provider]);

  // Get signer address
  useEffect(() => {
    const getSignerAddress = async () => {
      if (signer) {
        setSignerAddress(await signer.getAddress());
      }
    };

    getSignerAddress();
  }, [signer]);

  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <Text>Degen VC: Allocate to venture -&nbsp;</Text>
      <HStack fontSize={{ base: "sm", md: "lg" }}>
        <Link href="" isExternal>
          Buy DGVC
        </Link>
        <Text>|</Text>
        <Link href="" isExternal>
          Pool DGVC
        </Link>
        <Text>|</Text>
        <Link href="" isExternal>
          Receive Alphadrops
        </Link>
      </HStack>
    </Flex>
  );
}

export default TopLinks;
