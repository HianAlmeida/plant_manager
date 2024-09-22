import React from "react";
import Temperatura from "./Temperaturas";
import { Container } from "@mui/material";
import Atuadores from "./Atuadores";


export default function Home() {
    return (
        <Container maxWidth="md">
            <Temperatura />
            <Atuadores />
        </Container>
    )
}