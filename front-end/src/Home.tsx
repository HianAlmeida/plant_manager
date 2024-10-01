import React, { useEffect, useState } from 'react';
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import CardDispositivo from "./components/CardDispositivo";
import axios from 'axios';
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";

interface Device {
    id: number;
    device_name: string;
    reading_interval: number;
    fertilizing_interval: number;
    soil_humidity: number;
    sunlight_hours: number;
    led: number | null;
    water_level: number | null;
}

interface BasicUserInfo {
    access: string; // ou o tipo apropriado
    // adicione outras propriedades conforme necessário
}



export default function Home() {
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo) as BasicUserInfo | null;
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        if (!basicUserInfo || !basicUserInfo.access) {
            console.error('User is not authenticated');
            return; // Exit the function if user info is not available
        }
        const fetchDevices = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_API_URL}/devices`,
                    {
                        headers: {
                            Authorization: `Bearer ${basicUserInfo.access}`, // Use access token for JWT authentication
                        },
                    }
                );
                setDevices(response.data);
            } catch (error) {
                console.error("Erro ao buscar dispositivos:", error);
            }
        };

        fetchDevices();
    }, []);

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
                    {/* Renderiza cada dispositivo usando CardDispositivo */}
                    {devices.map(device => (
                        <CardDispositivo
                            key={device.id}
                            deviceName={`${device.device_name}`} // Nome do dispositivo
                            deviceTempo={`${device.reading_interval} minutos`} // Intervalo de leitura
                            deviceAdubo={`${device.fertilizing_interval} meses`} // Intervalo de adubação
                            deviceLuz={`${device.sunlight_hours} horas`} // Horas de luz
                            device_key={device.id}
                        />
                    ))}

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