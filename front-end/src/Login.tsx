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
  seeOptions: boolean;
  cadastro: boolean;
  onSubmit: (formData: any, navigate: any) => void; // Função de submit
}

export default function Login(props: LoginProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: ''
  });


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o recarregamento da página
    props.onSubmit(formData, navigate); // Chama a função passada como prop
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
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
              <p style={{ fontSize: "30px", margin: 0, marginBottom: "10px" }}><b>{props.pageName}</b></p>

              {props.cadastro &&
                <div>
                  <FormLabel
                    labelName="Nome:"
                    labelText='Digite seu nome aqui'
                    onChange={handleChange} 
                    name='first_name'/>
                  <FormLabel
                    labelName="Sobrenome:"
                    labelText='Digite seu sobrenome aqui'
    
                    onChange={handleChange} 
                    name= 'last_name'/>
                  <FormLabel
                    labelName="Email:"
                    labelText='Digite seu email aqui'
    
                    onChange={handleChange}
                    name='email' />
                </div>
              }

              <FormLabel
                labelName="Username:"
                labelText='Digite seu username aqui'
                onChange={handleChange} 
                name='username'/>
              <FormLabel
                labelName="Senha:"
                labelText='Digite sua senha aqui'
                onChange={handleChange} 
                name='password'/>

              {props.seeOptions &&
                <div style={{ color: "#76797E", marginTop: "10px", fontSize: "13px" }}>
                  <p style={{ display: "inline", marginRight: "15px" }}><Link to="/redefinir_senha"> Redefinir senha</Link></p>
                  <p style={{ display: "inline" }}><Link to="/novo_user"> Criar nova conta</Link></p>
                </div>
              }

              <div style={{ marginTop: "20px" }}>
                <ButtonStyled buttonText={props.buttonText} type="submit" />
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

