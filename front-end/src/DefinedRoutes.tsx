import { Route, Routes } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import Login from "./Login";
import Home from "./Home";
import Historico from "./Historico";
import AppBarComponent from "./AppBarComponent";

const DefinedRoutes = () => {
    const location = useLocation();
    return (
        <div>
            {location.pathname !== '/' && <AppBarComponent />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    )
}

export default DefinedRoutes;
