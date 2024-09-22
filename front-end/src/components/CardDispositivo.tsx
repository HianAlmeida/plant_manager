import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { Link } from 'react-router-dom';

interface dataDevice {
    deviceName: string;
    deviceTempo: string;
    deviceAdubo: string;
    deviceLuz: string;
}
export default function CardDispositivo(props: dataDevice) {
    return (
        <Card sx={{ maxWidth: 260 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, bgcolor: "primary.main", }}>
                <GrassRoundedIcon sx={{ fontSize: 40, color: "white" }} /> {/* Ícone dentro de uma div */}
            </Box>
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
                <Button size="small" component={Link} to="/historico">Ver</Button>
                <Button size="small" component={Link} to="/editar_dispositivo" >Editar</Button>
            </CardActions>
        </Card>
    )
};