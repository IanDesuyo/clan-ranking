import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Config } from "../app";
import { handleError } from "../utils";

export default function Search(props) {
  const { config } = useContext(Config);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchType, setSearchType] = useState("clan_name");
  const [searchValue, setSearchValue] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const toast = useToast();

  const vaildate = () => {
    const _error = {};
    if (searchType === "leader_uid") {
      if (searchValue.length !== 9) {
        _error.searchValue = "應為9位數遊戲ID";
      } else {
        const uid = parseInt(searchValue, 10);
        if (isNaN(uid) || uid < 0) {
          _error.searchValue = "無效的遊戲ID";
        }
      }
    } else if (searchValue.length < 2 || searchValue.length > 20) {
      _error.searchValue = "應為2~20個字";
    }

    if (Object.keys(_error).length > 0) {
      return setErrors(_error);
    }

    setErrors({});

    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/ranking/${config.server}/search` +
          `?month=${config.datetime.getFullYear()}` +
          String(config.datetime.getMonth() + 1).padStart(2, 0) +
          `&${searchType}=${searchValue}`
      )
      .then(res => {
        if (res.data !== null) {
          history.push(`/clan/${res.data.server}/${res.data.leaderHash}`);
        } else {
          toast({
            title: "404",
            description: "找不到相關戰隊...",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      })
      .catch(error => {
        toast(handleError(error));
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <div>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        as={Button}
        leftIcon={<SearchIcon />}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        onClick={onOpen}
      >
        戰隊搜尋
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              vaildate();
            }}
          >
            <ModalHeader>戰隊搜尋</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <FormControl id="searchType">
                  <FormLabel htmlFor="searchType">搜尋方式</FormLabel>
                  <Select
                    defaultValue={searchType}
                    onChange={e => {
                      setSearchType(e.target.value);
                      setSearchValue("");
                    }}
                  >
                    <option value="clan_name">戰隊名稱</option>
                    <option value="leader_name">隊長名稱</option>
                    <option value="leader_uid">隊長ID</option>
                  </Select>
                </FormControl>
                <FormControl id="searchValue" isInvalid={!!errors.searchValue}>
                  <Input
                    placeholder={searchType}
                    defaultValue={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                  />
                  <FormErrorMessage>{errors.searchValue}</FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                搜尋
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
