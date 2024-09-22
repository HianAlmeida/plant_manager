import { Container } from "@mui/material";
import Leitura from "./Leitura";
import Temperatura from "./Temperaturas";
import Atuadores from "./Atuadores";

export default function () {
    return (
        <Container maxWidth="md" sx={{ justifyContent: 'center' }}>
            <Temperatura />
            <Atuadores />
            <Leitura/>
        </Container>
    );
}