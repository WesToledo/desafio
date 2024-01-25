import {
  Box,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "../components/Page";
import { api } from "../shared/api";
import { getMonthNameByNumber } from "../shared/utils";

interface InfoCardProps {
  value: string;
  type: string;
  text: string;
}

interface IChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [dataMRR, setDataMRR] = useState();
  const [dataChurn, setDataChurn] = useState();

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  const [MRRChartData, setMRRChartData] = useState<IChartData>();
  const [churnChartData, setChurnChartData] = useState<IChartData>();

  const [totalMRR, setTotalMRR] = useState(0);
  const [totalChurn, setTotalChurn] = useState(0);

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          // fontColor: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          // color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          // color: textColorSecondary,
        },
        grid: {
          // color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };

  useEffect(() => {
    if (dataMRR) {
      const datasets = [];

      for (const month of Object.keys(dataMRR[selectedYear])) {
        datasets.push(dataMRR[selectedYear][month].value);
      }

      setTotalMRR(datasets.reduce((a, b) => a + b, 0));

      const MRRChartData: IChartData = {
        labels: Object.keys(dataMRR[selectedYear]).map((monthNumber) =>
          getMonthNameByNumber(+monthNumber)
        ),
        datasets: [
          {
            label: "MRR by Month",
            data: datasets,
          },
        ],
      };
      setMRRChartData(MRRChartData);
    }
    if (dataChurn) {
      const datasets = [];

      for (const month of Object.keys(dataChurn[selectedYear])) {
        datasets.push(+dataChurn[selectedYear][month]);
      }

      setTotalChurn(datasets.reduce((a, b) => a + b, 0) / 12);

      const churnChartData: IChartData = {
        labels: Object.keys(dataChurn[selectedYear]).map((monthNumber) =>
          getMonthNameByNumber(+monthNumber)
        ),
        datasets: [
          {
            label: "Churn Rate",
            data: datasets,
          },
        ],
      };
      setChurnChartData(churnChartData);
    }
  }, [selectedYear]);

  useEffect(() => {
    async function fetchMRRGraphData() {
      try {
        const { data } = await api.get("/transaction/mrr");

        const years = Object.keys(data);

        setYears(years);
        setSelectedYear(!!years.length ? years[0] : "");
        setDataMRR(data);
      } catch (err) {
        toast({
          title: "Erro ao gerar gráfico MRR",
          status: "error",
          isClosable: true,
        });
      }
    }
    async function fetchChurnGraphData() {
      try {
        const { data } = await api.get("/transaction/churn");

        setDataChurn(data);
      } catch (err) {
        toast({
          title: "Erro ao gerar gráfico MRR",
          status: "error",
          isClosable: true,
        });
      }
    }
    fetchMRRGraphData();
    fetchChurnGraphData();
  }, []);

  const InfoCard = ({ value, type, text }: InfoCardProps) => {
    return (
      <Card pt={0} px={5}>
        <CardBody justifyContent="center" alignItems="center">
          {/* <Flex direction="column" spacing={1}> */}
          <Text as="span" fontSize="xx-large" fontWeight="bold" mr={1}>
            {value}
          </Text>
          <Text as="span" fontSize="larger" fontWeight="bold">
            {type}
          </Text>

          <Flex justifyContent="center">
            <Text>{text}</Text>
          </Flex>
        </CardBody>
      </Card>
    );
  };

  return (
    <Center height="100vh">
      <Box p={4}>
        <Container w="100%" py={5} maxW={"100vw"} centerContent>
          <Stack mb={6} textAlign="left">
            <Heading fontSize="4xl">Métricas</Heading>
          </Stack>

          <Flex m={3} mb={6}>
            <HStack spacing={6}>
              <InfoCard
                value={"" + totalMRR.toFixed(2)}
                type="R$"
                text="Anual"
              />
              <InfoCard
                value={"" + totalChurn.toFixed(2)}
                type="%"
                text="Média anual"
              />
            </HStack>
          </Flex>
          <Flex justifyContent={"center"} m={3} mb={6}>
            {/* {!isLoadingClientNumbers ? ( */}
            <FormControl>
              <FormLabel fontWeight="bold" fontSize="sm">
                Filtre por ano
              </FormLabel>
              <Select
                value={selectedYear}
                // w={300}
                name="client_number"
                placeholder="Ṇº do Cliente"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((number) => {
                  return (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </Flex>

          <HStack
            spacing={5}
            width="100%"
            justifyContent="space-around"
            alignItems="center"
          >
            <Box
              w={"45vw"}
              boxShadow="2xl"
              borderRadius={{ base: "none", sm: "xl" }}
              height={"100%"}
              p={10}
            >
              <Stack spacing={4}>
                <Heading as="h4" size="md">
                  MRR
                </Heading>
                <Chart type="bar" data={MRRChartData} options={chartOptions} />
              </Stack>
            </Box>
            <Box
              w={"45vw"}
              p={10}
              boxShadow="2xl"
              borderRadius={{ base: "none", sm: "xl" }}
              height={"100%"}
            >
              <Stack spacing={4}>
                <Heading as="h4" size="md">
                  Churn Rate
                </Heading>
                <Chart
                  type="bar"
                  data={churnChartData}
                  options={chartOptions}
                />
              </Stack>
            </Box>
          </HStack>
        </Container>
      </Box>
    </Center>
  );
};
