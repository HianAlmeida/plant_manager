import { Route, Routes } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import Login from "./Login";
import Home from "./Home";
import Historico from "./Historico";
import CreateUser from "./CreateUser";
import AppBarComponent from "./components/AppBarComponent";
import FormDispositivo from "./FormDispositivo";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";


const DefinedRoutes = () => {
    const location = useLocation();
    const path_name = ['/', '/redefinir_senha', '/novo_user']
    return (
        <div>
            {!path_name.includes(location.pathname) && <AppBarComponent />}
            <Routes>
                {/* telas iniciais sem cabeçalho e sem autenticação*/}
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<Login />} />
                    <Route path="/novo_user" element={<CreateUser />} />
                     {/* <Route path="/redefinir_senha" element={<Login pageName="Redefinir Senha" buttonText="Salvar" seeOptions={false} cadastro={false} onSubmit={handleRegisterSubmit}/>} /> */}
                </Route>

                {/* telas após login com autenticação*/}
                <Route element={<ProtectedLayout />}>
                    <Route path="/novo_dispositivo" element={<FormDispositivo pageName="Cadastrar Dispositivo" pageText="Novo dispositivo" edit={false} />} />
                    <Route path="/editar_dispositivo" element={<FormDispositivo pageName="Editar Dispositivo" pageText="Dados dispositivo" edit={true} />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/historico/:id" element={<Historico />} />
                </Route>
            </Routes>
        </div>
    )
}

export default DefinedRoutes;
