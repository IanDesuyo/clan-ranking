import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Flex,
  Skeleton,
  useColorModeValue,
  Button,
  Center,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { scoreToText } from "../utils";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { Config } from "../app";

export default function RankingTable(props) {
  const { setConfig } = useContext(Config);
  const { data, isLoading } = props;
  const history = useHistory();

  const bgHoverColor = useColorModeValue("gray.100", "gray.900");

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>排名</Th>
            <Th>戰隊名稱</Th>
            <Th d={{ base: "none", md: "table-cell" }}>隊長</Th>
            <Th d={{ base: "none", md: "table-cell" }}>成員數</Th>
            <Th>分數 (狀態)</Th>
          </Tr>
        </Thead>

        <Tbody>
          {data.map((clan, index) => (
            <Tr
              onClick={() => history.push(`/clan/${clan.server}/${clan.leaderHash}`)}
              sx={{ transition: "background 0.2s ease;", cursor: "pointer" }}
              _hover={{
                background: bgHoverColor,
                transition: "background 0.2s ease;",
              }}
              key={index}
            >
              <Td>{clan.records.rank}</Td>
              <Td>
                <Flex alignItems="center">
                  <Image
                    src={`https://randosoru.me/static/assets/character_unit/${clan.leaderFavoriteUnit}.webp`}
                    boxSize="32px"
                    mr={1}
                  />
                  {clan.clanName}
                </Flex>
              </Td>
              <Td d={{ base: "none", md: "table-cell" }}>{clan.leaderName}</Td>
              <Td d={{ base: "none", md: "table-cell" }}>{clan.members}</Td>
              <Td isNumeric>{scoreToText(clan.records.score)}</Td>
            </Tr>
          ))}
        </Tbody>

        <Tbody d={isLoading ? "table-row-group" : "none"}>
          {[...Array(15).keys()].map(index => (
            <Tr key={index}>
              <Td>
                <Skeleton h="20px" maxW="100px" />
              </Td>
              <Td>
                <Skeleton h="20px" />
              </Td>
              <Td d={{ base: "none", md: "table-cell" }}>
                <Skeleton h="20px" />
              </Td>
              <Td d={{ base: "none", md: "table-cell" }}>
                <Skeleton h="20px" />
              </Td>
              <Td>
                <Skeleton h="20px" />
              </Td>
            </Tr>
          ))}
        </Tbody>

        {!isLoading && data.length === 0 && (
          <Tbody>
            <Tr>
              <Td colSpan={5}>暫無資料... (ﾟДﾟ;)</Td>
            </Tr>
          </Tbody>
        )}
      </Table>

      {!isLoading && data.length !== 0 && (
        <Center m={4}>
          <Button leftIcon={<RepeatIcon />} onClick={() => setConfig("loadMore", null)}>
            載入更多
          </Button>
        </Center>
      )}
    </>
  );
}
