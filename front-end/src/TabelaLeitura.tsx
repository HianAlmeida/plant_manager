import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAppSelector } from "./hooks/redux-hooks";

interface Action {
  id: number;
  actuator: string;
  state: boolean;
  created_at: string; // Data de criação
  executed_at: string; // Data de execução
}

interface TabelaLeituraProps {
  id: number; // O id agora é um número
}

interface BasicUserInfo {
  access: string;
}

export default function TabelaLeitura({ id }: TabelaLeituraProps) {
  const [readings, setReadings] = useState<Action[]>([]);
  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo) as BasicUserInfo | null;

  useEffect(() => {
    if (!basicUserInfo || !basicUserInfo.access) {
      console.error('User is not authenticated');
      return; // Exit the function if user info is not available
    }
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_API_URL}/readings/actuation/${id}`, {
          headers: {
            Authorization: `Bearer ${basicUserInfo.access}`, // Use access token for JWT authentication
          },
        });
        setReadings(response.data);
        console.log(response.data); // Log the response data instead of readings
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
      }
    };

    fetchDevices();
  }, [basicUserInfo, id]); // Adicione basicUserInfo e id como dependências

  // Corrigindo a criação das linhas da tabela
  const rows = readings.map(reading => createData(reading.created_at, reading.executed_at, reading.actuator));

  return (
    <TableContainer component={Paper} style={{ maxWidth: '600px' }}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Criado em</StyledTableCell>
            <StyledTableCell align="center">Executado em</StyledTableCell>
            <StyledTableCell align="center">Atuador</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.criado_em}>
              <StyledTableCell align="center">{row.criado_em}</StyledTableCell>
              <StyledTableCell align="center">{row.executado_em}</StyledTableCell>
              <StyledTableCell align="center">{row.atuador}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Função para formatar datas
const formatarDatas = (dataString: string): string => {
  const data = new Date(dataString);
  const day = data.getDate().toString().padStart(2, '0');
  const month = (data.getMonth() + 1).toString().padStart(2, '0');
  const hours = data.getHours().toString().padStart(2, '0');
  const minutes = data.getMinutes().toString().padStart(2, '0');

  return `${day}/${month} ${hours}:${minutes}`;
};

// Função para criar dados da tabela
function createData(created_at: string, executed_at: string, actuator: string) {
  const criado_em = formatarDatas(created_at);
  const executado_em = formatarDatas(executed_at);
  
  return { criado_em, executado_em, atuador: actuator };
}

// Estilização das células da tabela
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#33691e',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Estilização das linhas da tabela
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f4faee',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));