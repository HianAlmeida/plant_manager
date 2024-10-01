import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

interface Props {
    tempo: string[];
    umidade: number[];
}

const GraficoSolo: React.FC<Props> = ({ tempo, umidade }) => {
    return (
        <LineChart
            series={[
                { data: umidade, label: 'Umidade (%)', yAxisKey: 'umidadeAxisId', color: '#9ccc65' },
            ]}
            height={300}
            sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translateX(-20px)',
                },
                [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                    transform: 'translateY(10px)',
                },
            }}
            margin={{
                left: 80,
                right: 80,
            }}
            xAxis={[{ scaleType: 'point', data: tempo, label: "Data / Hora" }]}
            yAxis={[{ id: 'umidadeAxisId', label: "Umidade (%)" }]} // Apenas um eixo para umidade
        />
    );
}

export default GraficoSolo;