import { Box, chakra, Image, Stack, Flex, Text, useColorModeValue, Center } from "@chakra-ui/react";
import { version } from "../../package.json";

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      as="footer"
      sx={{
        top: "100vh",
        position: "sticky",
      }}
    >
      <Stack
        mx={{ base: 4, md: 12 }}
        py={4}
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Flex alignItems="center">
          <Image
            boxSize="40px"
            src="./static/favicon.ico"
            borderRadius="md"
            mr={2}
            sx={{ transition: "transform 1.5s ease-in-out" }}
            _hover={{ transform: "rotate(360deg)", transition: "transform 1.5s ease-in-out" }}
          />
          <Text fontSize="sm">Ver {version} &copy; 2021 IanDesuyo. All rights reserved.</Text>
        </Flex>
        <Stack direction={"row"} spacing={6}>
          <Box
            bgColor="black"
            p={2}
            borderRadius="full"
            as={chakra.button}
            onClick={() => window.open("https://github.com/IanDesuyo/clan-ranking")}
          >
            <Image src="./static/GitHub-Mark-Light-64px.png" boxSize="30px" />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
