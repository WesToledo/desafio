import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import Navbar from "./Navbar";

export const Page = ({ children }) => {
  return (
    <Container height="100vh" width="100vw">
      {children}
    </Container>
  );
};
