import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import AddressBook from "./AddressBook";
import SettingsStore from "@/src/store/SettingsStore";

interface AddressInputParams {}

function AddressInput({}: AddressInputParams) {
  const {
    isOpen: isAddressBookOpen,
    onOpen: openAddressBook,
    onClose: closeAddressBook,
  } = useDisclosure();

  const [showAddress, setShowAddress] = useState("");

  // TODO: make dynamic
  const selectedTabIndex: number = 0;
  const isConnected = false;
  const appUrl = "";
  const isIFrameLoading = false;
  const updateAddress = () => {};

  return (
    <FormControl>
      <FormLabel fontWeight={"bold"}>
        Enter Address or ENS to Impersonate
      </FormLabel>
      <HStack>
        <InputGroup>
          <Input
            placeholder="vitalik.eth"
            autoComplete="off"
            value={showAddress}
            onChange={(e) => {
              const _showAddress = e.target.value;
              setShowAddress(_showAddress);
              SettingsStore.setEIP155Address(_showAddress);
              // setIsEIP155AddressValid(true); // remove inValid warning when user types again
            }}
            bg={"brand.lightBlack"}
            // isInvalid={!isEIP155AddressValid}
          />
          {(selectedTabIndex === 0 && isConnected) ||
          (selectedTabIndex === 1 && appUrl && !isIFrameLoading) ? (
            <InputRightElement width="4.5rem" mr="1rem">
              <Button h="1.75rem" size="sm" onClick={updateAddress}>
                Update
              </Button>
            </InputRightElement>
          ) : (
            showAddress && (
              <InputRightElement px="1rem" mr="0.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setShowAddress("");
                    SettingsStore.setEIP155Address("");
                  }}
                >
                  <DeleteIcon />
                </Button>
              </InputRightElement>
            )
          )}
        </InputGroup>
        <Button onClick={openAddressBook}>
          <FontAwesomeIcon icon={faBook} />
        </Button>
        <AddressBook
          isAddressBookOpen={isAddressBookOpen}
          closeAddressBook={closeAddressBook}
          showAddress={showAddress}
          setShowAddress={setShowAddress}
        />
      </HStack>
    </FormControl>
  );
}

export default AddressInput;
