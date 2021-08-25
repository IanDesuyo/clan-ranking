import { Table, Thead, Tbody, Tr, Th, Td, useColorModeValue } from "@chakra-ui/react";
import { MinusIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { formatDate, scoreToText } from "../../utils";
import { useMemo } from "react";

export default function RankingDiff(props) {
  const { records } = props;

  const bgHoverColor = useColorModeValue("gray.100", "gray.900");

  const getDiff = (current, previous) => {
    if (current === previous) {
      return <MinusIcon color="gray" mr={2} />;
    }

    if (current < previous) {
      return <TriangleUpIcon color="green" mr={2} />;
    }

    if (current > previous) {
      return <TriangleDownIcon color="red" mr={2} />;
    }
  };

  return useMemo(() => {
    const reversed = records.slice().reverse();
    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>時間</Th>
            <Th>排名</Th>
            <Th>分數 (狀態)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reversed.map((record, index) => {
            return (
              <Tr
                sx={{ transition: "background 0.2s ease;" }}
                _hover={{
                  background: bgHoverColor,
                  transition: "background 0.2s ease;",
                }}
                key={index}
              >
                <Td>{formatDate(new Date(record.ts * 1000))}</Td>
                <Td>
                  {getDiff(
                    record.rank,
                    index !== reversed.length - 1 ? reversed[index + 1].rank : record.rank
                  )}
                  {record.rank}
                </Td>
                <Td>{scoreToText(record.score)}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }, [records, bgHoverColor]);
}
