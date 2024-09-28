import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

function formatarData(data_number: number): string{
  const datasFormatadas: string = "";
  let data = new Date(data_number);
  const day = data.getDate().toString().padStart(2, '0');
  const month = (data.getMonth() + 1).toString().padStart(2, '0');
  const hours = data.getHours().toString().padStart(2, '0');
  const minutes = data.getMinutes().toString().padStart(2, '0');
  const year = data.getFullYear().toString();

  const formattedDate = `${day}/${month}/${year} - ${hours}:${minutes}`;
  return formattedDate;
}

function createData(
  tempo: number,
  umidade_solo: string,
  luminosidade: string
) {
  const tempo_formatado = formatarData(tempo)
  return { umidade_solo, luminosidade , tempo_formatado}
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

interface Props {
  tempo: number[];
  umidade_solo: string[],
  luminosidade: string[]
}

const TabelaLeitura: React.FC<Props> = ({ tempo, umidade_solo, luminosidade }) => {
  const rows = []
  for (let i in tempo) {
    rows.push(createData(tempo[i], umidade_solo[i], luminosidade[i]))
  }
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

export default TabelaLeitura;