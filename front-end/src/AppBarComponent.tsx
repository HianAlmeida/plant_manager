import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';

const AppBarComponent = () => {
    const { pathname } = useLocation();
    return (

        <AppBar position="static" sx={{ bgcolor: '#ffffff' }} elevation={0}>
            <Container maxWidth="xl" >
                <Toolbar disableGutters >
                    <GrassRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black' }} />
                    <p style={{ color: "black" }}><b>Plantinhas</b>Felizes</p>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', height: 64, alignItems: 'center' }}>
                        <Tabs value={pathname} aria-label="basic tabs example"
                            TabIndicatorProps={{ style: { color: 'green' } }}>
                            <Tab label="Início" component={Link} to="/home" value="/home" sx={{ height: 64 }} />
                            <Tab label="Novo Dispositivo" component={Link} to="/novo_dispositivo" value="/novo_dispositivo" />
                        </Tabs>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppBarComponent;