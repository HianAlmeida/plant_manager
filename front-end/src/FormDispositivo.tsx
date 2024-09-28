import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';
import { SxProps } from "@mui/material";
import FormLabel from './components/FormLabel';
import ButtonStyled from './components/ButtonStyled';
import FormSelect from "./components/FormSelect";


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
    return (
        <Container maxWidth="md" sx={{ justifyContent: 'center', display: 'flex' }}>
            <Box
                sx={{
                    width: "100%"
                }}
            >
                <h1>{props.pageName}</h1>
                <Grid sx={boxForms}>
                    <div>
                        <p style={{ fontSize: "20px", margin: 0, marginBottom: "10px" }}><b>{props.pageText} </b></p>

                        {!props.edit &&
                            <FormLabel labelName="Id do dispositivo" labelText='Digite os 4 valores do dispositivo' />   
                        }
                        <FormLabel labelName="Nome" labelText='Como gostaria de chamar esse dispositivo? ' />
                        <FormSelect labelText="Qual o intervalo de tempo que as leituras e atuações devem ser feitas?" fields={tempos} />
                        <FormSelect labelText="Qual o intervalo de tempo que as adubações devem ser feitas?" fields={tempos_adubacao} />
                        <FormSelect labelText="Qual a quantidade de horas que a planta deve receber luz por dia?" fields={tempos_iluminacao} />


                        <div style={{ marginTop: "20px" }}>
                            <ButtonStyled buttonText="Salvar" />
                        </div>
                    </div>
                </Grid>

            </Box>
        </Container>

    );
}




const tempos = {
    "5": "5 minutos",
    "10": "10 minutos",
    "15": "15 minutos",
    "30": "30 minutos",
    "45": "45 minutos",
    "60": "1 hora",
    "90": "1 hora e 30 minutos",
    "120": "2 horas",
    "180": "3 horas"
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
    "8": "8 horas",
    "9": "9 horas",
    "10": "10 horas",
    "11": "11 horas",
    "12": "12 horas",
    "13": "13 horas",
    "14": "14 horas",
    "15": "15 horas",
    "16": "16 horas",
    "17": "17 horas",
    "18": "18 horas",
    "19": "19 horas",
    "20": "20 horas",
    "21": "21 horas",
    "22": "22 horas",
    "23": "23 horas",
    "24": "24 horas"
}