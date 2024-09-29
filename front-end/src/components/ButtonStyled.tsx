import { Button as BaseButton } from '@mui/base/Button';
import { styled } from '@mui/system';

interface ButtonProps {
  buttonText: string;
  onClick?: () => void; // Função opcional para o clique
  type?: "button" | "submit"; // Tipo do botão
}

export default function ButtonStyled(props: ButtonProps) {
  return (
    <Button variant="contained" color="primary" onClick={props.onClick} type={props.type}>
            {props.buttonText}
        </Button>
    );
};

// estilização do material ui
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