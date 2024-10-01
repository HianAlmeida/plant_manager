import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

interface Props {
    tempo: string[];
    luz: number[];
}

const GraficoLuz: React.FC<Props> = ({ tempo, luz }) => {
    const [isDataReady, setIsDataReady] = useState<boolean>(false);

    // Verifica se os dados estão prontos
    useEffect(() => {
        if (tempo.length > 0 && luz.length > 0) {
            setIsDataReady(true);
        } else {
            setIsDataReady(false);
        }
    }, [tempo, luz]); // Dependências para verificar quando os dados mudam

    // Se os dados não estiverem prontos, não renderiza o gráfico
    if (!isDataReady) {
        return <p>Aguardando dados para exibir o gráfico...</p>; // Mensagem ou carregamento
    }

    return (
        <BarChart
            sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translateX(-20px)',
                },
                [`& .${axisClasses.right} .${axisClasses.label}`]: {
                    transform: 'translateX(20px)',
                },
                [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                    transform: 'translateY(10px)',
                },
            }}
            xAxis={[{ scaleType: 'band', data: tempo, label: "Data / Hora" }]}
            series={[
                {
                    data: luz,
                    label: 'Luminosidade (%)',
                    color: '#9ccc65',
                },
            ]}
            width={500}
            height={300}
            yAxis={[{ id: 'luminosidadeAxisId', label: "Luminosidade (%)" }]} // Apenas um eixo para luminosidade
        />
    );
}

export default GraficoLuz;