import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
  Text,
  Collapse,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon, ChevronDownIcon } from "@chakra-ui/icons";
import SelectTime from "./selectTime";
import { Config } from "../app";
import { useContext } from "react";
import Search from "./search";

export default function Navbar() {
  const { config, setConfig } = useContext(Config);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const servers = [
    { id: 1, name: "美食殿堂", color: ["#ffe7cd", "#998167"] },
    { id: 2, name: "真步真步王國", color: ["#f4d2cd", "#775a56"] },
    { id: 3, name: "破曉之星", color: ["#9caff8", "#172660"] },
    { id: 4, name: "小小甜心", color: ["#f3cedf", "#744f60"] },
  ];

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            d={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box d={{ base: "none", md: "flex" }} alignItems="center">
              <Image
                boxSize="40px"
                src="./static/favicon.ico"
                borderRadius="md"
                mr={2}
                sx={{ transition: "transform 1.5s ease-in-out" }}
                _hover={{ transform: "rotate(360deg)", transition: "transform 1.5s ease-in-out" }}
              />
              <Text fontSize="md">戰隊排行榜</Text>
            </Box>
            <HStack as="nav" spacing={4} d={{ base: "none", md: "flex" }}>
              <Search />
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <HStack spacing={2} alignItems="center">
              <SelectTime />
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  bgColor={useColorModeValue(...servers[config.server - 1].color)}
                >
                  {servers[config.server - 1].name}
                </MenuButton>
                <MenuList>
                  {servers.map((server, index) => (
                    <MenuItem key={index} onClick={() => setConfig("server", server.id)}>
                      {server.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <IconButton
                d={{ base: "none", md: "flex" }}
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </HStack>
          </Flex>
        </Flex>
        <Collapse direction="top" in={isOpen}>
          <Box pb={4} d={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              <Search />
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="space-between">
                  <Image
                    boxSize="32px"
                    src="./static/favicon.ico"
                    borderRadius="md"
                    mr={2}
                    sx={{ transition: "transform 1.5s ease-in-out" }}
                    _hover={{
                      transform: "rotate(360deg)",
                      transition: "transform 1.5s ease-in-out",
                    }}
                  />
                  <Text fontSize="sm">戰隊排行榜</Text>
                </Flex>
                <IconButton
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                />
              </Flex>
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </>
  );
}
