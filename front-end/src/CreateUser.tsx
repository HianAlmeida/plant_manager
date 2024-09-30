import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { SxProps } from "@mui/material";
import { Link } from 'react-router-dom';
import FormLabel from './components/FormLabel';
import ButtonStyled from './components/ButtonStyled';
import { useState } from "react";
import { Password } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from "./hooks/redux-hooks";
import { register } from "./slices/authSlice";
import axios from 'axios';
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";


const boxTexto: SxProps = {
    padding: 12,
    bgcolor: "primary.main",
    color: "white",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: "15px",
    borderBottomLeftRadius: "15px"
};

const boxForms: SxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#f1f8e9",
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px"
};



export default function CreateUser() {
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo); //@ts-ignore

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: ''
    });


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        // try {
        //     const response = await axios.post(`${process.env.REACT_APP_BACK_END_API_URL}/auth/register/`, formData);
        //     console.log('Registro bem-sucedido:', response.data);
        //     navigate('/'); 
        // } catch (error) {
        //     console.error('Erro ao registrar:', error);
        //     // adicionar alguma lógica de erro
        // }
        try {
            await dispatch(
              register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
              })
            ).unwrap();
            console.log("A MORENA ESTA VIVA")
            console.log(basicUserInfo)

            navigate('/'); 
          } catch (e) {
            console.error(e);
          }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    return (
        <Container maxWidth="md"
            style={{
                height: '100vh', // Ocupa toda a altura da viewport
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

            <Grid container style={{ height: "520px" }}>

                <Grid item xs={12} sm={6} sx={boxTexto}>
                    <div>
                        <GrassRoundedIcon sx={{ fontSize: "70px" }} />
                        <p style={{ fontSize: "30px", margin: 0, marginBottom: "10px" }}><b>Plantinhas</b>Felizes</p>
                        <p style={{ fontSize: "18px" }}>Monitore e Melhore a Saúde das Suas Plantas</p>
                    </div>
                </Grid>

                <Grid item xs={12} sm={6} sx={boxForms}>
                    <form onSubmit={handleSubmit}> {/* Adiciona o evento de submit */}
                        <div>
                            <p style={{ fontSize: "30px", margin: 0, marginBottom: "10px" }}><b>Cadastrar Usuário</b></p>
                            <FormLabel
                                labelName="Nome:"
                                labelText='Digite seu nome aqui'
                                onChange={handleChange}
                                name='first_name' />
                            <FormLabel
                                labelName="Sobrenome:"
                                labelText='Digite seu sobrenome aqui'

                                onChange={handleChange}
                                name='last_name' />
                            <FormLabel
                                labelName="Email:"
                                labelText='Digite seu email aqui'

                                onChange={handleChange}
                                name='email' />


                            <FormLabel
                                labelName="Username:"
                                labelText='Digite seu username aqui'
                                onChange={handleChange}
                                name='username' />
                            <FormLabel
                                labelName="Senha:"
                                labelText='Digite sua senha aqui'
                                onChange={handleChange}
                                name='password' />

                            <div style={{ marginTop: "20px" }}>
                                <ButtonStyled buttonText="Cadastrar" type="submit" />
                            </div>
                        </div>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}

