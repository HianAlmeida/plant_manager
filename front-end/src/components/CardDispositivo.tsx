import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { Link } from 'react-router-dom';
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';

interface dataDevice {
    device_key: number;
    deviceName: string;
    deviceTempo: string;
    deviceAdubo: string;
    deviceLuz: string;
    water_level: boolean | null
}
export default function CardDispositivo(props: dataDevice) {
    return (
        <Card sx={{ maxWidth: 260 }}>
            {props.water_level ? ( // Verifica se existem readings
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: 60, bgcolor: "#ae615f", padding: "3px" }}>
                    <InvertColorsOffIcon sx={{ fontSize: 30, color: "white" }} /> {/* Ícone dentro de uma div */}

                    <Typography variant="subtitle2" sx={{ color: 'white', width: "170px" }}>
                        <b>Nível crítico de água no reservatório</b>
                    </Typography>

                </Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, bgcolor: "primary.main", padding: "3px" }}>
                    <GrassRoundedIcon sx={{ fontSize: 40, color: "white" }} />
                </Box>
            )
            }




            <CardContent>
                <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    Nome:
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    {props.deviceName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Tempo entre leituras: {props.deviceTempo}
                    <br />
                    Intervalo entre adubações: {props.deviceAdubo}
                    <br />
                    Tempo de iluminação por dia: {props.deviceLuz}
                </Typography>


            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/historico/${props.device_key}`}>Ver</Button>
                <Button size="small" component={Link} to="/editar_dispositivo" >Editar</Button>
            </CardActions>
        </Card >
    )
};