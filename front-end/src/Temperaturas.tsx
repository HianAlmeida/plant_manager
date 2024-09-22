import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
///// FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	child,
	get,
	onChildAdded,
	query,
	limitToLast,
	startAt,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

function formatDate(millis: string): string {
	let date = new Date(parseInt(millis) * 1000);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear().toString().padStart(2, "0");
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");

	const formattedDate = `${day}/${month}/${year}\n${hours}:${minutes}`;

	return formattedDate;
}

const firebaseConfig = {
	apiKey: "AIzaSyBuYJBVxjxoaaa2wfwVXsFzKUNOWim5KWw",
	authDomain: "plantinhas-felizes.firebaseapp.com",
	databaseURL: "https://plantinhas-felizes-default-rtdb.firebaseio.com",
	projectId: "plantinhas-felizes",
	storageBucket: "plantinhas-felizes.appspot.com",
	messagingSenderId: "1064436465805",
	appId: "1:1064436465805:web:5df16381c00fc0e6d1e2c4",
	measurementId: "G-C8YB3LQ1JZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

////
const database = getDatabase(app);
const queryRef = query(
	ref(database, "/UsersData/J2L4vksigQc2E5xj2vxEQ9lOxOm2/readings//"),
	limitToLast(1)
);

export default function Temperatura() {
	const [data, setData] = useState({
		fertilizer: "",
		humidity: "",
		humidity_soil: "",
		light: "",
		temperature: "",
		timestamp: "",
		water_level: "Alto",
	});

	const [lastUpdated, setLastUpdated] = useState(Date());

	useEffect(() => {
		onChildAdded(queryRef, (snapshot) => {
			const tempData = snapshot.val();
			setData(tempData);
			setLastUpdated(formatDate(tempData["timestamp"]));
		});
	}, []);

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
					<Box sx={{width: '52px', height:'52px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<DeviceThermostatIcon sx={{color: 'white', fontSize: '30px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Temperatura
						</p>
						<h1 style={{ margin: 0, fontSize: "1.9em" , color: '#689f38'}}>
							{data["temperature"]}ºC
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
					<Box sx={{width: '52px', height:'52px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<WaterDropIcon sx={{color: 'white', fontSize: '30px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Umidade
						</p>
						<h1 style={{ margin: 0, fontSize: "1.9em", color: '#689f38' }}>
							{data["humidity"]}%
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
					<Box sx={{width: '52px', height:'52px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<LightModeIcon sx={{color: 'white', fontSize: '30px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Luminosidade
						</p>
						<h1 style={{ margin: 0, fontSize: "1.9em" , color: '#689f38'}}>
							{data["light"]}
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
					<Box sx={{width: '52px', height:'52px', bgcolor: '#4d4d4d', margin: '10px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<OpacityIcon sx={{color: 'white', fontSize: '30px'}}/>
					</Box>
					<div>
						<p style={{ margin: 0, color: "#616161" }}>
							Umidade Solo
						</p>
						<h1 style={{ margin: 0, fontSize: "1.9em", color: '#689f38' }}>
							{data["humidity_soil"]}
						</h1>
					</div>
				</Box>
			</Box>
			<p style={{ fontSize: "0.8em", color: "#616161", marginTop: 0 }}>
				Ultima atualização: {lastUpdated}
			</p>
			{data["water_level"] === "Baixo" && <Box sx={{ display: 'flex', alignItems: 'center', width: "100%", justifyContent: 'center' }}>
				<Box sx={{height: '100px', bgcolor: "#FFE3E2", borderRadius: 5, display: 'flex', alignItems: 'center' }}>
					<InvertColorsOffIcon sx={{ margin: '30px', fontSize: '40px', color: "#F67461" }} />
					<h2 style={{marginRight: "35px", color: "#F67461"}}>Nível de água do reservatório baixo</h2>
				</Box>
			</Box>}
		</Box>
	);
}
