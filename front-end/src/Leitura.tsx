import React, { useEffect, useState } from 'react';
import GraficoLeitura from "./GraficoLeitura";
import Box from '@mui/material/Box';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import TabelaLeitura from './TabelaLeitura';


export default function () {
    const takeRight = (arr: string[] = [], n = 1) => n === 0 ? [] : arr.slice(-n);

    const [tempo, setTempo] = useState<number[]>([]);
    const [temperatura, setTemperatura] = useState<number[]>([]);
    const [umidade_ambiente, setUmidadeAmbiente] = useState<number[]>([]);
    const [umidade_solo, setUmidadeSolo] = useState<string[]>([]);
    const [luz, setLuz] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const firebaseConfig = {
            apiKey: "AIzaSyBuYJBVxjxoaaa2wfwVXsFzKUNOWim5KWw",
            authDomain: "plantinhas-felizes.firebaseapp.com",
            databaseURL: "https://plantinhas-felizes-default-rtdb.firebaseio.com",
            projectId: "plantinhas-felizes",
            storageBucket: "plantinhas-felizes.appspot.com",
            messagingSenderId: "1064436465805",
            appId: "1:1064436465805:web:5df16381c00fc0e6d1e2c4",
            measurementId: "G-C8YB3LQ1JZ"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const database = getDatabase(app);

        const dbRef = ref(getDatabase());

        try {
            get(child(dbRef, `/UsersData/J2L4vksigQc2E5xj2vxEQ9lOxOm2/readings`)).then((snapshot) => {
                if (snapshot.exists()) {
                    //pega todas as keys da hash consultada
                    const data_read = snapshot.val();
                    var data_keys = Object.keys(data_read)
                    //pegar as 10 ultimas keys
                    data_keys = takeRight(data_keys, 10);

                    data_keys.forEach((key) => {
                        setTempo(tempo => [...tempo, parseInt(key) * 1000]);
                        setTemperatura(temperatura => [...temperatura, parseFloat(data_read[key]["temperature"])]);
                        setUmidadeAmbiente(umidade_ambiente => [...umidade_ambiente, parseFloat(data_read[key]["humidity"])]);
                        setUmidadeSolo(umidade_solo => [...umidade_solo, data_read[key]["humidity_soil"]]);
                        setLuz(luz => [...luz, data_read[key]["light"]]);
                    });

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
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
                    <GraficoLeitura tempo={tempo} temperatura={temperatura} umidade={umidade_ambiente} />
                </Box>
                <h3>Umidade do solo e luminosidade</h3>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <TabelaLeitura tempo={tempo} umidade_solo={umidade_solo} luminosidade={luz}/>
                </Box>
            </Box>


        </Box>
    );
}