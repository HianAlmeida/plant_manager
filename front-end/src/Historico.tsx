import { Container } from "@mui/material";
import Leitura from "./Leitura";

export default function () {
    return (
        <Container maxWidth="md" sx={{ justifyContent: 'center', display: 'flex' }}>
            <Leitura/>
        </Container>
    );
}