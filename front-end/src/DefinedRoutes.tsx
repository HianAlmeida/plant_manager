import { Route, Routes } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import Login from "./Login";
import Home from "./Home";
import Historico from "./Historico";
import AppBarComponent from "./AppBarComponent";

const DefinedRoutes = () => {
    const location = useLocation();
    const path_name = ['/', '/redefinir_senha', '/novo_user']
    return (
        <div>
            {!path_name.includes(location.pathname) && <AppBarComponent />}
            <Routes>
                <Route path="/" element={<Login pageName="Login" buttonText="Acessar" seeOptions={true} />} />
                <Route path="/redefinir_senha" element={<Login pageName="Redefinir Senha" buttonText="Salvar" seeOptions={false} />} />
                <Route path="/novo_user" element={<Login pageName="Cadastro de usuário" buttonText="Salvar" seeOptions={false} />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    )
}

export default DefinedRoutes;
