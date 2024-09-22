import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { SxProps } from "@mui/material";
import { Link } from 'react-router-dom';
import FormLabel from './components/FormLabel';
import ButtonStyled from './components/ButtonStyled';

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

interface LoginProps {
  pageName: string;
  buttonText: string;
  seeOptions: boolean
}

export default function Login(props: LoginProps) {

  return (
    <Container maxWidth="md"
      style={{
        height: '100vh', // Ocupa toda a altura da viewport
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

      <Grid container style={{ height: "400px" }}>

        <Grid item xs={12} sm={6} sx={boxTexto}>
          <div>
            <GrassRoundedIcon sx={{ fontSize: "70px" }} />
            <p style={{ fontSize: "30px", margin: 0, marginBottom: "10px" }}><b>Plantinhas</b>Felizes</p>
            <p style={{ fontSize: "18px" }}>Monitore e Melhore a Saúde das Suas Plantas</p>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} sx={boxForms}>
          <div>
          <p style={{ fontSize: "30px", margin: 0, marginBottom: "10px" }}><b>{props.pageName}</b></p>

            <FormLabel labelName="Email" labelText='Digite seu email aqui'/>
            <FormLabel labelName="Senha" labelText='Digite sua senha aqui'/>

            {props.seeOptions &&
            <div style={{ color: "#76797E", marginTop: "10px", fontSize: "13px" }}>
              <p style={{ display: "inline", marginRight: "15px" }}><Link to="/redefinir_senha"> Redefinir senha</Link></p>
              <p style={{ display: "inline" }}><Link to="/novo_user"> Criar nova conta</Link></p>
            </div>
            }

            <div style={{ marginTop: "20px" }}>
              <ButtonStyled buttonText={props.buttonText}/>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

