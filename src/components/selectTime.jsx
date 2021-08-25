import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { convertDate } from "../utils";
import DatePicker from "./datePicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { useState, useContext } from "react";
import { Config } from "../app";

export default function SelectTime(props) {
  const { config, setConfig } = useContext(Config);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cacheTime, setCacheTime] = useState();

  const notFuture = date => {
    const now = new Date();
    const dateTime = new Date(date);
    return dateTime.getTime() < now.getTime();
  };

  return (
    <div>
      <Button onClick={onOpen} leftIcon={<CalendarIcon />}>
        {String(config.datetime.getMonth() + 1).padStart(2, "0") +
          "/" +
          String(config.datetime.getDate()).padStart(2, "0") +
          " " +
          String(config.datetime.getHours()).padStart(2, "0") +
          ":" +
          String(config.datetime.getMinutes()).padStart(2, "0")}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選擇時間</ModalHeader>
          <ModalCloseButton />
          <ModalBody ml="auto" mr="auto">
            <DatePicker
              id="datetime"
              selected={cacheTime || config.datetime}
              onChange={date => setCacheTime(date)}
              showTimeSelect
              timeIntervals={20}
              filterDate={notFuture}
              injectTimes={[setHours(setMinutes(new Date(), 50), 23)]}
              inline
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (cacheTime) {
                  setConfig("datetime", convertDate(cacheTime));
                }
                onClose();
              }}
            >
              選擇
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setConfig("datetime", convertDate(new Date()));
                onClose();
              }}
            >
              自動設定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
