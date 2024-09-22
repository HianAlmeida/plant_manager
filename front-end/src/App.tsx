import { Routes, Route, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';

import Historico from './Historico';
import Agendamento from './Agendamento';
import Initial from './Initial';
import Home from './Home';


export default function App() {
    const { pathname } = useLocation();
    
    return (
        <div className="App">
            <AppBar position="static" sx={{ bgcolor: '#ffffff' }} elevation={0}>
                <Container maxWidth="xl" >
                    <Toolbar disableGutters >
                        <GrassRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black' }} />
                        <p style={{ color: "black" }}><b>Plantinhas</b>Felizes</p>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', height: 64, alignItems: 'center' }}>
                            <Tabs value={pathname} aria-label="basic tabs example"
                                TabIndicatorProps={{ style: { color: 'green' } }}>
                                <Tab label="Início" component={Link} to="/" value="/" sx={{height: 64}}/>
                                <Tab label="Histórico" component={Link} to="/historico" value="/historico" />
                                {/* <Tab label="Agendamento" component={Link} to="/agendamento" value="/agendamento" /> */}
                            </Tabs>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/home" element={<Initial />} />
                {/* <Route path="/agendamento" element={<Agendamento />} /> */}
            </Routes>
        </div>
    );
}