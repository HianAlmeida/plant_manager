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
import { useAppDispatch } from "./hooks/redux-hooks";
import { login } from "./slices/authSlice";

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


export default function Login() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o recarregamento da página
    try {
      await dispatch(
        login({
          username,
          password,
        })
      ).unwrap();
    } catch (e) {
      console.error(e);
    }
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
          <form onSubmit={handleSubmit}>
            <div>
              <p style={{ fontSize: "30px", margin: 0, marginBottom: "10px" }}><b>Login</b></p>

              <FormLabel
                labelName="Username:"
                labelText='Digite seu username aqui'
                onChange={(e) => setUsername(e.target.value)}
                name='username' />
              <FormLabel
                labelName="Senha:"
                labelText='Digite sua senha aqui'
                onChange={(e) => { setPassword(e.target.value); }}
                name='password' 
                type="password"
                />


              <div style={{ color: "#76797E", marginTop: "10px", fontSize: "13px" }}>
                <p style={{ display: "inline", marginRight: "15px" }}><Link to="/redefinir_senha"> Redefinir senha</Link></p>
                <p style={{ display: "inline" }}><Link to="/novo_user"> Criar nova conta</Link></p>
              </div>


              <div style={{ marginTop: "20px" }}>
                <ButtonStyled buttonText="Acessar" type="submit" />
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

