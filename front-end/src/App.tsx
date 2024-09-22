// import { Routes, Route, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';

import Historico from './Historico';
import Initial from './Login';
import Home from './Home';
import DefinedRoutes from './DefinedRoutes';
import { Route, BrowserRouter, Routes } from "react-router-dom";


export default function App() {    
    return (
        <BrowserRouter>
            <DefinedRoutes/>
        </BrowserRouter>
    );
}