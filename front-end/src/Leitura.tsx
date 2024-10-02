import React, { useEffect, useState } from 'react';
import GraficoLeitura from "./components/GraficoLeitura";
import Box from '@mui/material/Box';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import TabelaLeitura from './TabelaLeitura';
import GraficoSolo from './components/GraficoSolo';
import GraficoLuz from './components/GraficoLuz';
interface Reading {
    id: number;
    soil_moisture: number;
    air_humidity: number;
    air_temperature: number;
    luminosity: number;
    water_level: boolean;
    created_at: string;
}

interface LeituraProps {
    readings: Reading[];
    id: number;
}

export default function Leitura({ readings, id }: LeituraProps) {
    const [tempo, setTempo] = useState<string[]>([]);
    const [temperatura, setTemperatura] = useState<number[]>([]);
    const [umidade_ambiente, setUmidadeAmbiente] = useState<number[]>([]);
    const [umidade_solo, setUmidadeSolo] = useState<number[]>([]);
    const [luz, setLuz] = useState<number[]>([]);

    useEffect(() => {
        // Organiza os dados recebidos
        const tempos: string[] = [];
        const temperaturas: number[] = [];
        const umidadesAmbiente: number[] = [];
        const umidadesSolo: number[] = [];
        const luz: number[] = [];

        readings.forEach((reading) => {
            tempos.push(reading.created_at);
            temperaturas.push(reading.air_temperature);
            umidadesAmbiente.push(reading.air_humidity);
            umidadesSolo.push(reading.soil_moisture);
            luz.push(reading.luminosity);
        });

        // Atualiza os estados
        setTempo(tempos);
        setTemperatura(temperaturas);
        setUmidadeAmbiente(umidadesAmbiente);
        setUmidadeSolo(umidadesSolo);
        setLuz(luz);
        console.log(luz)
    }, [readings]);

    return (
        <Box sx={{
            width: '100%'
        }} >
            <h1>Histórico de Leituras</h1>
            <Box sx={{
                padding: '5%', paddingTop: 0
            }} >
                <h3>Temperatura e umidade do ambiente</h3>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <GraficoLeitura tempo={formatarDatas(tempo)} temperatura={temperatura} umidade={umidade_ambiente} />
                </Box>

                <h3>Umidade do Solo</h3>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <GraficoSolo tempo={formatarDatas(tempo)} umidade={umidade_solo} />
                </Box>

                <h3>Luminosidade do Ambiente</h3>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <GraficoLuz tempo={formatarDatas(tempo)} luz={luz} />
                </Box>

                <h1>Histórico de atuações</h1>
                <Box sx={{
                    padding: '5%', paddingTop: 0
                }} >
                    <h3>Dados de atuação</h3>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <TabelaLeitura id={id} /> 
                    </Box>
                </Box>
            </Box>
        </Box>
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