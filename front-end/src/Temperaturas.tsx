import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

interface Reading {
    id: number,
    soil_moisture: number,
    air_humidity: number,
    air_temperature: number,
    luminosity: number,
    water_level: boolean,
    created_at: string
}

export default function Temperatura(props: Reading) {
	return (
		<Box
			sx={{
				width: "100%"
			}}
		>
			<h1>Minha planta</h1>
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					"& > :not(style)": {
						m: 1,
						width: 190,
						height: 100,
					},
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box sx={{width: '55px', height:'55px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<DeviceThermostatIcon sx={{color: 'white', fontSize: '25px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Temperatura
						</p>
						<h1 style={{ margin: 0, fontSize: "2.1em" , color: '#689f38'}}>
							{props.air_temperature}ºC
						</h1>
					</div>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box sx={{width: '55px', height:'55px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<WaterDropIcon sx={{color: 'white', fontSize: '25px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Umidade
						</p>
						<h1 style={{ margin: 0, fontSize: "2.1em", color: '#689f38' }}>
							{props.air_humidity}%
						</h1>
					</div>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box sx={{width: '55px', height:'55px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<LightModeIcon sx={{color: 'white', fontSize: '25px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Luminosidade
						</p>
						<h1 style={{ margin: 0, fontSize: "2.1em" , color: '#689f38'}}>
							{props.luminosity}%
						</h1>
					</div>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Box sx={{width: '55px', height:'55px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<OpacityIcon sx={{color: 'white', fontSize: '25px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Umidade Solo
						</p>
						<h1 style={{ margin: 0, fontSize: "2.1em", color: '#689f38' }}>
							{props.soil_moisture}%
						</h1>
					</div>
				</Box>
			</Box>
			<p style={{ fontSize: "0.8em", color: "#616161", marginTop: 0 }}>
				Ultima atualização: {formatDateString(props.created_at)}
			</p>
			{/* {data["water_level"] === "Baixo" && <Box sx={{ display: 'flex', alignItems: 'center', width: "100%", justifyContent: 'center' }}>
				<Box sx={{height: '100px', bgcolor: "#FFE3E2", borderRadius: 5, display: 'flex', alignItems: 'center' }}>
					<InvertColorsOffIcon sx={{ margin: '30px', fontSize: '40px', color: "#F67461" }} />
					<h2 style={{marginRight: "35px", color: "#F67461"}}>Nível de água do reservatório baixo</h2>
				</Box>
			</Box>} */}
		</Box>
	);
}



function formatDateString(dateString: string): string {
	console.log(dateString)
    const date = new Date(dateString);

    // Configurações para o formato desejado
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Para usar o formato 24 horas
    };

    // Formata a data
    const formattedDate = date.toLocaleString('pt-BR', options);

    // Ajusta a formatação para o padrão desejado
    const [datePart, timePart] = formattedDate.split(', ');
    const finalFormat = `${datePart.replace(/\//g, '/')}, ${timePart}`;

    return finalFormat; // Retorna a string formatada
}