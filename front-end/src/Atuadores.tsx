import { MouseEvent, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightModeIcon from "@mui/icons-material/LightMode";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import axios from 'axios';
import { useAppSelector } from "./hooks/redux-hooks";

interface BasicUserInfo {
    access: string;
}

interface AtuadorProps {
    id: number; // O id agora é um número
}

export default function Atuadores({ id }: AtuadorProps) {
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo) as BasicUserInfo | null;
    const [luz, setLuz] = useState(false);

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
            // Verifica se led é vazio e define como false se for
            setLuz(response.data.led !== undefined && response.data.led !== "" ? response.data.led : false);
        } catch (error) {
            console.error("Erro ao buscar dispositivos:", error);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [basicUserInfo, id]);

    const handleClickActuate = async (actuator: string) => {
        const params = {
            actuator: actuator,
            state: 1,
            device_id: "hian123", // Substitua pelo ID do dispositivo real
            id: "esp32" // Substitua pelo ID real
        };

        if (!basicUserInfo || !basicUserInfo.access) {
            console.error('User is not authenticated');
            return; // Exit the function if user info is not available
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACK_END_API_URL}/readings/actuation/`, params, {
                headers: {
                    Authorization: `Bearer ${basicUserInfo.access}`, // Use access token for JWT authentication
                },
            });
            // Após a ação, atualize a variável luz fazendo uma nova requisição GET
            await fetchDevices(); // Chama a função para atualizar o estado da luz
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
                        bgcolor: luz === true ? "primary.dark" : "primary.main" ,
                    }}
                    disableElevation={luz === true}
                    onClick={() => handleClickActuate(luz === true ? "led_off" : "led_on")}
                >
                    <div style={{ textAlign: "center" }}>
                        <LightModeIcon sx={iconTheme} />
                        <h3 style={{ color: "white", marginTop: "5px" }}>{`${luz === true ? "Desligar" : "Ligar"} Luz`}</h3>
                    </div>
                </Button>

                <Button sx={boxTheme} onClick={() => handleClickActuate("light")}>
                    <div style={{ textAlign: "center" }}>
                        <LocalDiningIcon sx={iconTheme} />
                        <h3 style={{ color: "white", marginTop: "5px" }}>Adubar</h3>
                    </div>
                </Button>
            </Box>
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
};