import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';


export default function Home() {
    return (
        <Container maxWidth="md">
            <Box sx={{ width: "100%" }}>
                <h1>Meus dispositivos</h1>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        "& > :not(style)": {
                            m: 1
                        }
                    }}
                >
                    {/* grid para todos os dispositivos */}
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
                                Primeiro dispositivo
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Tempo entre leituras: 1 hora
                                <br />
                                Intervalo entre adubações: 1 mês
                                <br />
                                Tempo de iluminação por dia: 14 horas
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" component={Link} to="/historico">Ver</Button>
                            <Button size="small" component={Link} to="/editar_dispositivo" >Editar</Button>
                        </CardActions>
                    </Card>
                    <Button
                        variant="contained"
                        component={Link} to="/novo_dispositivo"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', // Alinha o ícone acima do texto
                            alignItems: 'center', // Centraliza horizontalmente
                            justifyContent: 'center', // Centraliza verticalmente
                            width: '130px',
                            textAlign: 'center'
                        }}
                    >
                        <AddIcon sx={{fontSize: "35px"}}/>
                         <b style={{lineHeight: 1}}>Novo Dispositivo</b>
                    </Button>
                </Box>



            </Box>
        </Container>
    )
}



{/* <Container maxWidth="md">
<Temperatura />
<Atuadores />
</Container>
Antiga home  */}