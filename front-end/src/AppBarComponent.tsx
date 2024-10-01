import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch } from "./hooks/redux-hooks";
import { logout } from "./slices/authSlice";
import { useNavigate } from 'react-router-dom';

const AppBarComponent = () => {
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          await dispatch(logout()).unwrap();
          navigate("/");
        } catch (e) {
          console.error(e);
        }
      };

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
                    <Button size="large" endIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppBarComponent;