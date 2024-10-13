import { MouseEvent, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightModeIcon from "@mui/icons-material/LightMode";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import axios from 'axios';
import { useAppSelector } from "./hooks/redux-hooks";
import Typography from '@mui/material/Typography';
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';

interface BasicUserInfo {
    access: string;
}

interface AtuadorProps {
    id: number; // O id agora é um número
}

export default function Atuadores({ id }: AtuadorProps) {
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo) as BasicUserInfo | null;
    const [luz, setLuz] = useState(false);
    const [water, setWater] = useState(true);

    const fetchDevices = async () => {
        if (!basicUserInfo || !basicUserInfo.access) {
            console.error('User is not authenticated');
            return; // Exit the function if user info is not available
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_API_URL}/devices/${id}`, {
                headers: {
                    Authorization: `Bearer ${basicUserInfo.access}`, // Use access token for JWT authentication
                },
            });
            setLuz(response.data.led !== undefined && response.data.led !== "" ? response.data.led : false);
            setWater(response.data.water_level !== undefined && response.data.water_level !== "" ? response.data.water_level : false);
        } catch (error) {
            console.error("Erro ao buscar dispositivos:", error);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [basicUserInfo, id]);

    const handleClickActuate = async (actuator: string) => {
        let newLuzState = luz; // Store current luz state

        if (actuator === "led_on") {
            newLuzState = true; // Set luz to true when turning it on
        } else if (actuator === "led_off") {
            newLuzState = false; // Set luz to false when turning it off
        }

        const params = {
            actuator: actuator,
            state: 1,
            device_id: id,
        };

        if (!basicUserInfo || !basicUserInfo.access) {
            console.error('User is not authenticated');
            return; // Exit the function if user info is not available
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACK_END_API_URL}/readings/actuation/`, params, {
                headers: {
                    Authorization: `Bearer ${basicUserInfo.access}`,
                },
            });
            setLuz(newLuzState); // Update luz state based on action
            await fetchDevices(); // Fetch devices to ensure state is accurate
        } catch (error) {
            console.error("Erro ao executar a ação:", error);
        }
    };

    return (
        <Box sx={{ width: "100%", marginTop: 5 }}>
            <h1>Cuidados Essenciais</h1>
            <Box sx={boxContainer}>
                <Button sx={boxTheme} onClick={() => handleClickActuate("water")}>
                    <div>
                        <WaterDropIcon sx={iconTheme} />
                        <h3 style={{ color: "white", marginTop: "5px" }}>Regar</h3>
                    </div>
                </Button>

                <Button
                    sx={{
                        ...boxTheme,
                        bgcolor: luz === true ? "primary.dark" : "primary.main",
                    }}
                    disableElevation={luz === true}
                    onClick={() => handleClickActuate(luz === true ? "led_off" : "led_on")}
                >
                    <div style={{ textAlign: "center" }}>
                        <LightModeIcon sx={iconTheme} />
                        <h3 style={{ color: "white", marginTop: "5px" }}>{`${luz === true ? "Desligar" : "Ligar"} Luz`}</h3>
                    </div>
                </Button>

                <Button sx={boxTheme} onClick={() => handleClickActuate("fertilizer")}>
                    <div style={{ textAlign: "center" }}>
                        <LocalDiningIcon sx={iconTheme} />
                        <h3 style={{ color: "white", marginTop: "5px" }}>Adubar</h3>
                    </div>
                </Button>
            </Box>

            {!water && (
                 <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 60,
                    bgcolor: "#FFE3E2",
                    padding: "3px",
                    width: "62%",
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: "15px",
                    marginTop: "10px"
                }}>
                    <InvertColorsOffIcon sx={{ fontSize: 30, color: "#F67360", marginRight: "20px" }} />
    
                    <Typography variant="h6" sx={{ color: '#F67360', textAlign: 'center' }}>
                        <b>Nível crítico de água no reservatório</b>
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

const boxTheme = {
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

const boxContainer = {
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

const iconTheme = {
    display: { xs: "none", md: "flex" },
    mr: 1,
    color: "white",
    fontSize: "50px",
    margin: "auto",
}