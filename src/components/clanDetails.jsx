import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Flex,
  Text,
  Box,
  Switch,
  HStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { handleError } from "../utils";
import ClanTimelimeChart from "./charts/clanTimeline";
import RankingDiff from "./charts/rankingDiff";

export default function ClanDetails(props) {
  const { match } = props;
  const [data, setData] = useState({});
  const [detailType, setDetailType] = useState(false);
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    const { server, leaderHash } = match.params;
    if (server && leaderHash) {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/ranking/${server}/${leaderHash}`)
        .then(res => {
          setData({ ...res.data });
        })
        .catch(error => {
          toast(handleError(error));
          history.push("/");
        });
    }

    return () => {
      setData({});
    };
  }, [match.params.server, match.params.leaderHash]);

  return (
    <Modal
      size="full"
      isOpen={match && !!data.server}
      onClose={() => {
        setData({});
        setTimeout(() => history.push("/"), 200);
      }}
      motionPreset="slideInBottom"
    >
      {match && (
        <>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{data.clanName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex alignItems="center" mb={2}>
                <Image
                  src={`https://randosoru.me/static/assets/character_unit/${data.leaderFavoriteUnit}.webp`}
                  alt="Leader Unit"
                  boxSize="64px"
                  mr={2}
                />
                <Box>
                  <Text fontSize="xl">隊長: {data.leaderName}</Text>
                  <Text fontSize="md">成員: {data.members}人</Text>
                </Box>
                <HStack ml="auto">
                  <Text>曲線圖</Text>
                  <Switch
                    colorScheme="teal"
                    size="md"
                    isChecked={detailType}
                    onChange={() => setDetailType(prev => !prev)}
                  />
                  <Text>差異表</Text>
                </HStack>
              </Flex>
              {data.records &&
                (detailType ? (
                  <RankingDiff records={data.records} />
                ) : (
                  <ClanTimelimeChart records={data.records} />
                ))}
            </ModalBody>
          </ModalContent>
        </>
      )}
    </Modal>
  );
}
