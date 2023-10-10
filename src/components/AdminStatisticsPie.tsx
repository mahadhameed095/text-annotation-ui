import { PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';

const document_data = [
    {
        "name": "Annotated",
        "value": 350
    },
    {
        "name": "Unannotated",
        "value": 600
    }
]

const document_detailed_data = [
    {
        "name": "Raahim",
        "value": 150
    },
    {
        "name": "Mahad",
        "value": 100
    },
    {
        "name": "Ahmed",
        "value": 100
    },
]

const annotation_data = [
    {
        "name": "Islamic",
        "value": 700
    },
    {
        "name": "Non-Islamic",
        "value": 800
    }
]

const annotation_detailed_data = [
    {
        "name": "Non-Hate",
        "value": 500
    },
    {
        "name": "Hate",
        "value": 200
    }
]


const AdminStatisticsPie = (props: any) => {
    const INNER_COLORS = ["#82ca9d", "#8884d8"]
    const OUTER_COLORS = ["#82ca9d", "#8884d8", "#808080"]
    const OUTER_ANNOTATION_COLORS = ["#82ca9d", "#db0909"]

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ type, cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          { type === "1" ? document_data[index].name :  type === "2" ? annotation_data[index].name : ""}
        </text>
      );
    };

    const renderLabel = (entry) => {
        return entry.name;
    }

    return ( 
        <>
            <div className='w-full md:w-6/12 lg:w-96'>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie style={{outline: 'none'}} labelLine={false} data={document_data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={115} fill="#8884d8" label={(props) => renderCustomizedLabel({...props, type: "1"})}>
                            {document_data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={INNER_COLORS[index % INNER_COLORS.length]} />
                            ))}
                        </Pie>
                        <Pie style={{outline: 'none'}} label={renderLabel}  data={document_detailed_data} dataKey="value" cx="50%" cy="50%" innerRadius={120} outerRadius={140} endAngle={document_data[0].value / (document_data[0].value + document_data[1].value) * 360}>
                            {document_data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={OUTER_COLORS[index % OUTER_COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className='w-full md:w-6/12 lg:w-96'>
            <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie style={{outline: 'none'}} labelLine={false} data={annotation_data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={115} fill="#8884d8" label={(props) => renderCustomizedLabel({...props, type: "2"})}>
                            {annotation_data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={INNER_COLORS[index % INNER_COLORS.length]} />
                            ))}
                        </Pie>
                        <Pie style={{outline: 'none'}} label={renderLabel}  data={annotation_detailed_data} dataKey="value" cx="50%" cy="50%" innerRadius={120} outerRadius={140} fill="#db0909" endAngle={annotation_data[0].value / (annotation_data[0].value + annotation_data[1].value) * 360}>
                            {annotation_data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={OUTER_ANNOTATION_COLORS[index % OUTER_ANNOTATION_COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
     );
}
 
export default AdminStatisticsPie;