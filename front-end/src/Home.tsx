import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import CardDispositivo from "./components/CardDispositivo";


export default function Home() {
    return (
        <Container maxWidth="md">
            <Box sx={{ width: "100%" }}>
                <h1>Meus dispositivos</h1>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        "& > :not(style)": {
                            m: 1
                        }
                    }}
                >
                    {/* grid para todos os dispositivos */}
                    <CardDispositivo
                        deviceName = "Planta da sala"
                        deviceTempo = "1 hora"
                        deviceAdubo = "3 meses"
                        deviceLuz = "5 horas"
                    />

                    <Button
                        variant="contained"
                        component={Link} to="/novo_dispositivo"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', // Alinha o ícone acima do texto
                            alignItems: 'center', // Centraliza horizontalmente
                            justifyContent: 'center', // Centraliza verticalmente
                            width: '130px',
                            height: '284px',
                            textAlign: 'center'
                        }}
                    >
                        <AddIcon sx={{ fontSize: "35px" }} />
                        <b style={{ lineHeight: 1 }}>Novo Dispositivo</b>
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}