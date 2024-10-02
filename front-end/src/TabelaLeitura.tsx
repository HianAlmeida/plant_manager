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
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";

interface Action {
  id: number,
  actuator: string,
  state: boolean,
  created_at: string,
  executed_at: string
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
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_API_URL}/readings/actuation/${id}`,
          {
            headers: {
              Authorization: `Bearer ${basicUserInfo.access}`, // Use access token for JWT authentication
            },
          }
        );
        setReadings(response.data);
        console.log(readings);
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
      }
    };

    fetchDevices();
  }, []);

  //corrija a partir aqui
  const rows = readings.map(reading => createData(reading.created_at, reading.actuator, reading.state));
  
  return (
    <TableContainer component={Paper} style={{ maxWidth: '400px' }}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Data - Hora</StyledTableCell>
            <StyledTableCell align="right">Tipo</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.tempo_formatado}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row.tempo_formatado}
              </StyledTableCell>
              <StyledTableCell align="right">{row.umidade_solo}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



const formatarDatas = (datas: string[]): string[] => {
  return datas.map(data_string => {
    let data = new Date(data_string);
    const day = data.getDate().toString().padStart(2, '0');
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const hours = data.getHours().toString().padStart(2, '0');
    const minutes = data.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}\n${hours}:${minutes}`;
  });
};


function createData(
  tempo: string[],
  umidade_solo: string,
  luminosidade: string
) {
  const tempo_formatado = formatarDatas(tempo)
  return { umidade_solo, luminosidade, tempo_formatado }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#33691e',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f4faee',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
