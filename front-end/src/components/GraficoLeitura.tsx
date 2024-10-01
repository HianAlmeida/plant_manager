import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

interface Props {
    tempo: string[];
    temperatura: number[],
    umidade: number[]
}

const GraficoLeitura: React.FC<Props> = ({ tempo, temperatura, umidade }) => {

    return (
        <LineChart
            series={[
                { data: temperatura, label: 'Temperatura °C', yAxisKey: 'leftAxisId', color: '#33691e' },
                { data: umidade, label: 'Umidade (%)', yAxisKey: 'rightAxisId', color: '#9ccc65' },
            ]}
            height={300}
            sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translateX(-20px)'
                },
                [`& .${axisClasses.right} .${axisClasses.label}`]: {
                    transform: 'translateX(20px)'
                },
                [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                    transform: 'translateY(10px)'
                }
            }}
            margin={{
                left: 80,
                right: 80
            }}
            xAxis={[{ scaleType: 'point', data: tempo, label: "Data / Hora"  }]}
            yAxis={[{ id: 'leftAxisId', label: "Temperatura °C" }, { id: 'rightAxisId', label: "Umidade %" }]}
            rightAxis="rightAxisId"
        />
    );
}

export default GraficoLeitura;