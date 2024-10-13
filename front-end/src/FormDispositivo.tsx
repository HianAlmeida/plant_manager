import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';
import { SxProps } from "@mui/material";
import FormLabel from './components/FormLabel';
import ButtonStyled from './components/ButtonStyled';
import FormSelect from "./components/FormSelect";
import { useState } from "react";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";

interface BasicUserInfo {
    access: string; // ou o tipo apropriado
    // adicione outras propriedades conforme necessário
}
const boxForms: SxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#f1f8e9",
    borderRadius: "15px",
    padding: "30px",
    width: "80%", // Reduzir a largura da Grid
    marginTop: "20px" // Adicionar margem superior
};

interface DispositivoProps {
    pageName: string;
    pageText: string;
    edit: Boolean
}

export default function FormDispositivo(props: DispositivoProps) {
    const navigate = useNavigate();
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo) as BasicUserInfo | null;

    const [formData, setFormData] = useState({
        token: '',
        reading_interval: '',
        fertilizing_interval: '',
        soil_humidity: '',
        sunlight_hours: '',
        nickname: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData)
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(basicUserInfo)
        e.preventDefault();

        // Convert specific fields to integers
        const updatedFormData = {
            ...formData,
            reading_interval: parseInt(formData.reading_interval as unknown as string, 10),
            fertilizing_interval: parseInt(formData.fertilizing_interval as unknown as string, 10),
            soil_humidity: parseInt(formData.soil_humidity as unknown as string, 10),
            sunlight_hours: parseInt(formData.sunlight_hours as unknown as string, 10),
        };

        // Get basic user info for authentication
        

        if (!basicUserInfo || !basicUserInfo.access) {
            console.error('User is not authenticated');
            return; // Exit the function if user info is not available
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACK_END_API_URL}/devices/register/`,
                updatedFormData,
                {
                    headers: {
                        Authorization: `Bearer ${basicUserInfo.access}`, // Use access token for JWT authentication
                    },
                }
            );

            console.log('Registro bem-sucedido:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Erro ao registrar:', error);
            // Add error handling logic here
        }
    };
    return (
        <Container maxWidth="md" sx={{ justifyContent: 'center' }}>
            <Box
                sx={{
                    width: "100%"
                }}
            >
                <h1>{props.pageName}</h1>
                <Grid sx={boxForms}>
                    <form onSubmit={handleSubmit}> {/* Adiciona o evento de submit */}
                        <div>
                            <p style={{ fontSize: "20px", margin: 0, marginBottom: "10px" }}><b>{props.pageText} </b></p>
    
                            {!props.edit &&
                                <FormLabel
                                    labelName="Id do dispositivo"
                                    labelText='Digite os 4 valores do dispositivo'
                                    onChange={handleChange}
                                    name='token'
                                />
                            }
                            <FormLabel
                                labelName="Nome"
                                labelText='Como gostaria de chamar esse dispositivo? '
                                onChange={handleChange}
                                name='nickname'
                            />
                            <FormSelect
                                labelText="Qual o intervalo de tempo que as leituras e atuações devem ser feitas?"
                                fields={tempos}
                                onChange={handleSelectChange}
                                name="reading_interval"
                            />
                            <FormSelect
                                labelText="Qual o intervalo de tempo que as adubações devem ser feitas?"
                                fields={tempos_adubacao}
                                onChange={handleSelectChange}
                                name="fertilizing_interval"
                            />
                            <FormSelect
                                labelText="Qual a quantidade de horas que a planta deve receber luz por dia?"
                                fields={tempos_iluminacao}
                                onChange={handleSelectChange}
                                name="sunlight_hours"
                            />
    
                            <FormSelect
                                labelText="Qual a porcentagem de umidade do solo minima para rega?"
                                fields={porcentagem_rega}
                                onChange={handleSelectChange}
                                name="soil_humidity"
                            />
    
    
                            <div style={{ marginTop: "20px" }}>
                                <ButtonStyled buttonText="Salvar" type="submit" />
                            </div>
                        </div>
                    </form>
                </Grid>
    
            </Box>
        </Container>
    
    );
};





const tempos = {
    1: "1 minuto",
    5: "5 minutos",
    10: "10 minutos",
    15: "15 minutos",
    30: "30 minutos",
    45: "45 minutos",
    60: "1 hora",
    90: "1 hora e 30 minutos",
    120: "2 horas",
    180: "3 horas"
}

const tempos_adubacao = {
    "1": "1 mês",
    "2": "2 meses",
    "3": "3 meses",
    "4": "4 meses",
    "5": "5 meses",
    "6": "6 meses",
    "7": "7 meses"
}


const tempos_iluminacao = {
    "1": "1 hora",
    "2": "2 horas",
    "3": "3 horas",
    "4": "4 horas",
    "5": "5 horas",
    "6": "6 horas",
    "7": "7 horas",
    "8": "8 horas"
}

const porcentagem_rega = {
    "10": "10%",
    "20": "20%",
    "30": "30%",
    "40": "40%",
    "50": "50%",
    "60": "60%",
    "70": "70%",
    "80": "80%",
    "90": "90%",
}