import React, { useEffect, useState } from 'react';
import { Container } from "@mui/material";
import Leitura from "./Leitura";
import Temperatura from "./Temperaturas";
import Atuadores from "./Atuadores";
import axios from 'axios';
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";
import { useParams } from 'react-router-dom';


interface Reading {
    id: number,
    soil_moisture: number,
    air_humidity: number,
    air_temperature: number,
    luminosity: number,
    water_level: boolean,
    created_at: string
}

interface BasicUserInfo {
    access: string;
}

export default function Historico() {
    const { id } = useParams<{ id?: string }>(); // Definindo id como opcional
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo) as BasicUserInfo | null;
    const [readings, setReadings] = useState<Reading[]>([]);

    useEffect(() => {
        if (!basicUserInfo || !basicUserInfo.access) {
            console.error('User is not authenticated');
            return; // Exit the function if user info is not available
        }
        const fetchDevices = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_API_URL}/readings/${id}`,
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
    }, [basicUserInfo, id]);

    return (
        <Container maxWidth="md" sx={{ justifyContent: 'center' }}>
              <p>
                {readings.length > 0 ? ( // Verifica se existem readings
                    <Temperatura {...readings[readings.length -1]} />
                ) : (
                    <span>Nenhuma leitura disponível.</span> // Mensagem caso não haja readings
                )}
            </p>
            <Atuadores id={Number(id)}/>
            <p>
                {readings.length > 0 ? ( // Verifica se existem readings
                    <Leitura  readings={readings} id={Number(id)}/>
                ) : (
                    <span>Nenhuma leitura disponível.</span> // Mensagem caso não haja readings
                )}
            </p>
        </Container>
    );
}