import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

function formatarDatas(datas: number[]): string[] {
    const datasFormatadas: string[] = [];

    datas.forEach(data_number => {
        let data = new Date(data_number);
        const day = data.getDate().toString().padStart(2, '0');
        const month = (data.getMonth() + 1).toString().padStart(2, '0');
        const hours = data.getHours().toString().padStart(2, '0');
        const minutes = data.getMinutes().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}\n${hours}:${minutes}`;
        datasFormatadas.push(formattedDate);
    });

    return datasFormatadas;
}

interface Props {
    tempo: number[];
    temperatura: number[],
    umidade: number[]
}

const GraficoLeitura: React.FC<Props> = ({ tempo, temperatura, umidade }) => {

    const timeDataFormated = formatarDatas(tempo)

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
            xAxis={[{ scaleType: 'point', data: timeDataFormated, label: "Data / Hora"  }]}
            yAxis={[{ id: 'leftAxisId', label: "Temperatura °C" }, { id: 'rightAxisId', label: "Umidade %" }]}
            rightAxis="rightAxisId"
        />
    );
}

export default GraficoLeitura;