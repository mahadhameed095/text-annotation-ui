import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


type Props = {
    colors: string[],
    data: {
        name: string,
        value: number
    }
}
 
const StatisticsBar = ({colors, data}: Props) => {
    return ( 
        <div className="w-80 sm:w-96 mx-auto sm:mx-0">
            <ResponsiveContainer height={400}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                        {
                            data.map((entry, index: number) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
     );
}
 
export default StatisticsBar;