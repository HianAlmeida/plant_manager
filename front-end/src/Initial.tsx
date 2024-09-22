import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { SxProps } from "@mui/material";
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';
import clsx from 'clsx';
import { Button as BaseButton } from '@mui/base/Button';

const boxTexto: SxProps = {
  padding: 12,
  bgcolor: "primary.main",
  color: "white",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const boxForms: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "#f1f8e9",
};

export default function Initial() {

  return (
    <Container maxWidth="md">

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
            <FormControl defaultValue="" required>
              <Label>Email</Label>
              <StyledInput placeholder="Digite seu email aqui" />
              <HelperText />
            </FormControl>

            <FormControl defaultValue="" required>
              <Label>Senha</Label>
              <StyledInput placeholder="Digite seu email aqui" />
              <HelperText />
            </FormControl>

            <div style={{ color: "#76797E", marginTop: "10px", fontSize: "13px" }}>
              <p style={{ display: "inline", marginRight: "15px" }}><a href="">Redefinir senha</a></p>
              <p style={{ display: "inline" }}><a href="">Criar nova conta</a></p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <Button>Acessar</Button>
            </div>



          </div>
        </Grid>
      </Grid>
    </Container>
  );
}


// estilização do material ui
const StyledInput = styled(Input)(
  ({ theme }) => `

  .${inputClasses.input} {
    width: 280px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  }
`,
);

const Label = styled(
  ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const formControlContext = useFormControlContext();
    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
      if (formControlContext?.filled) {
        setDirty(true);
      }
    }, [formControlContext]);

    if (formControlContext === undefined) {
      return <p>{children}</p>;
    }

    const { error, required, filled } = formControlContext;
    const showRequiredError = dirty && required && !filled;

    return (
      <p className={clsx(className, error || showRequiredError ? 'invalid' : '')}>
        {children}
        {required ? ' *' : ''}
      </p>
    );
  },
)`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  margin-bottom: 4px;

  &.invalid {
    color: red;
  }
`;

const HelperText = styled((props: {}) => {
  const formControlContext = useFormControlContext();
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (formControlContext?.filled) {
      setDirty(true);
    }
  }, [formControlContext]);

  if (formControlContext === undefined) {
    return null;
  }

  const { required, filled } = formControlContext;
  const showRequiredError = dirty && required && !filled;

  return showRequiredError ? <p {...props}>Esse campo é obrigatório.</p> : null;
})`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;



const green = {
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#689f38",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20"
}
const blue = {
  100: '#DAECFF',
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Button = styled(BaseButton)(
  ({ theme }) => `
  width: 306px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${green[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${green[500]};
  box-shadow: 0 2px 1px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
    }, inset 0 1.5px 1px ${green[400]}, inset 0 -2px 1px ${green[600]};

  &:hover {
    background-color: ${green[600]};
  }

  &:active {
    background-color: ${green[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? green[300] : green[200]};
    outline: none;
  }

  &.base--disabled {
    background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
    transform: scale(1);
  }
`,
);

