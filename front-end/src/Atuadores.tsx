import { MouseEvent, useEffect, useState } from "react";
import { Box, ThemeProvider, Button } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightModeIcon from "@mui/icons-material/LightMode";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { SxProps } from "@mui/material";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	child,
	get,
	set,
	onChildAdded,
	update,
	onChildChanged,
	onValue,
} from "firebase/database";
import { on } from "events";

const boxTheme: SxProps = {
	width: 100,
	height: 100,
	borderRadius: 5,
	bgcolor: "primary.main",
	"&:hover": {
		bgcolor: "primary.dark",
	},
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const boxContainer: SxProps = {
	display: "flex",
	flexWrap: "wrap",
	"& > :not(style)": {
		m: 1,
		width: 150,
		height: 150,
	},
	justifyContent: "space-evenly",
	bgcolor: "#f1f8e9",
	width: "60%",
	margin: "auto",
	borderRadius: 5,
	padding: 1.5,
};

const iconTheme: SxProps = {
	display: { xs: "none", md: "flex" },
	mr: 1,
	color: "white",
	fontSize: "50px",
	margin: "auto",
};

export default function Atuadores() {
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
	const database = getDatabase(app);

	const dbRef = ref(getDatabase());

	const handleClickRegar = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		saveDataRegar();
	};

	const [luz, setLuz] = useState(0);

	const luzRef = ref(database, "/leitura/luz");

	useEffect(() => {
		onValue(luzRef, (snapshot) => {
			setLuz(snapshot.val());
		});
	}, []);

	const saveDataRegar = async () => {
		get(child(dbRef, `/leitura`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					let data = {
						agua: 1,
						luz: snapshot.val().luz,
						fertilizante: snapshot.val().fertilizante,
					};
					set(ref(database, "/leitura"), data);
				} else {
					console.log("No data available");
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleClickLuz = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		saveDataLuz();
	};

	const saveDataLuz = async () => {
		get(child(dbRef, `/leitura`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const { agua, luz, fertilizante } = snapshot.val();
					const data = {
						agua,
						luz: luz === 1 ? 0 : 1,
						fertilizante,
					};
					set(ref(database, "/leitura"), data);
				} else {
					console.log("No data available");
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleClickFertilizante = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		saveDataFertilizante();
	};

	const saveDataFertilizante = async () => {
		get(child(dbRef, `/leitura`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					let data = {
						agua: snapshot.val().agua,
						luz: snapshot.val().luz,
						fertilizante: 1,
					};
					set(ref(database, "/leitura"), data);
				} else {
					console.log("No data available");
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// useEffect(() => {
	//   const interval = setInterval(() => {
	//     get(child(dbRef, `/leitura`))
	//       .then((snapshot) => {
	//         if (snapshot.exists()) {
	//           const { agua, fertilizante } = snapshot.val();
	//           if (agua === 1) {
	//             set(ref(database, "/leitura/agua"), 0);
	//           }
	//           if (fertilizante === 1) {
	//             set(ref(database, "/leitura/fertilizante"), 0);
	//           }
	//         } else {
	//           console.log("No data available");
	//         }
	//       })
	//       .catch((error) => {
	//         console.error(error);
	//       });
	//   }, 10000);
	//   return () => clearInterval(interval);
	// }, [database, dbRef]);

	// useEffect(() => {
	//   const getLuz = async () => {
	//     const luzInitial = await get(child(dbRef, `/leitura/luz`));
	//     if (luzInitial.exists() && luz !== luzInitial.val()) {
	//       setLuz(luzInitial.val());
	//     } else if (!luzInitial.exists()) {
	//       set(ref(database, "/leitura/luz"), 0);
	//       setLuz(0);
	//     }
	//   };
	//   getLuz();
	// }, [database, dbRef, luz]);

	return (
		<Box sx={{ width: "100%", marginTop: 5, marginBottom: 20 }}>
			<h1>Cuidados Essenciais</h1>
			<Box sx={boxContainer}>
				<Button sx={boxTheme} onClick={handleClickRegar}>
					<div>
						<WaterDropIcon sx={iconTheme} />
						<h3 style={{ color: "white", marginTop: "5px" }}>
							Regar
						</h3>
					</div>
				</Button>

				<Button
					sx={{
						...boxTheme,
						bgcolor: luz === 0 ? "primary.main" : "primary.dark",
					}}
					disableElevation={luz === 1}
					onClick={handleClickLuz}
				>
					<div style={{ textAlign: "center" }}>
						<LightModeIcon sx={iconTheme} />
						<h3 style={{ color: "white", marginTop: "5px" }}>
							{`${luz === 1 ? "Desligar" : "Ligar"}`} Luz
						</h3>
					</div>
				</Button>

				<Button sx={boxTheme} onClick={handleClickFertilizante}>
					<div style={{ textAlign: "center" }}>
						<LocalDiningIcon sx={iconTheme} />
						<h3 style={{ color: "white", marginTop: "5px" }}>
							Adubar
						</h3>
					</div>
				</Button>
			</Box>
		</Box>
	);
}
