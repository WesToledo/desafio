import { Box, Center, Container, Flex, Heading, Stack } from "@chakra-ui/react";
import { Page } from "../components/Page";
import UploadComponent from "../components/UploadComponent";

const UploadPage = () => {
  return (
    <Center height="100vh">
      <Container maxW="5xl">
        <Stack spacing="8" width="100%">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading fontSize="3xl">Upload</Heading>
            </Stack>
          </Stack>
          <Box
            boxShadow="2xl"
            borderRadius={{ base: "none", sm: "xl" }}
            height={"100%"}
          >
            <UploadComponent />
          </Box>
        </Stack>
      </Container>
    </Center>
  );
};

export default UploadPage;
