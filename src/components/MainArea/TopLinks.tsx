import { useState, useEffect } from "react";

import { Flex, Text, Link, HStack, Box} from "@chakra-ui/react";
import ConnectWallet, { targetNetwork } from "./ConnectWallet";
import { Web3Provider, Signer } from "../../types";

function TopLinks({setProvider, signerAddress}: {setProvider: any, signerAddress: string | undefined}) {

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
        <Box mt="5rem">
          {!signerAddress ? (
            <ConnectWallet setProvider={setProvider} />
          ) : (
              <HStack>
                <Text>Your Address: </Text>
                <Text fontWeight="semibold">{signerAddress}</Text>
              </HStack>
          )}
        </Box>
      </HStack>
    </Flex>
  );
}

export default TopLinks;
