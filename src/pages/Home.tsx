import { Link } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";


const document_data = [
    {
        "name": "Annotated",
        "value": 400
    },
    {
        "name": "Unannotated",
        "value": 600
    }
]

const document_detailed_data = [
    {
        "name": "Raahim",
        "value": 200
    },
    {
        "name": "Mahad",
        "value": 180
    },
    {
        "name": "Ahmed",
        "value": 220
    },
]

const annotation_data = [
    {
        "name": "Islamic",
        "value": 520
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
        "value": 100
    }
]


const Home = () => {
    const [user, setUser] = useState<typeof auth.currentUser>(null);
    const INNER_COLORS = ["#82ca9d", "#8884d8"]
    const OUTER_COLORS = ["#82ca9d", "#8884d8", "#808080"]
    const OUTER_ANNOTATION_COLORS = ["#82ca9d", "#db0909"]

    onAuthStateChanged(auth, (user) => {
        console.log(user);
        setUser(user);
    });

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
        <header className="bg-blue-500 py-4 flex">
            <div className="container my-auto mx-auto">
                <h1 className="text-white text-2xl px-8 font-semibold">AnnoText</h1>
            </div>
            <div className="pr-4 md:pr-12">
                <Link to="/tool">
                    <button className="btn bg-white rounded shadow w-44 h-12 hover:bg-gray-200">To Annotation Tool</button>
                </Link>
            </div>
        </header>
        <div className='container mx-auto p-8'>
            <h2 className="text-lg font-style: italic">Hello {auth.currentUser?.email}!</h2>
            <div className='mt-8'>
                <h2 className='text-xl font-bold'>Statistics</h2>
                <div className='md:flex'>
                    <PieChart width={420} height={420}>
                        <Pie style={{outline: 'none'}} labelLine={false} data={document_data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8"  label={(props) => renderCustomizedLabel({...props, type: "1"})}>
                            {document_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={INNER_COLORS[index % INNER_COLORS.length]} />
                            ))}
                        </Pie>
                        <Pie style={{outline: 'none'}} label={renderLabel}  data={document_detailed_data} dataKey="value" cx="50%" cy="50%" innerRadius={124} outerRadius={144} endAngle={document_data[0].value / (document_data[0].value + document_data[1].value) * 360}>
                            {document_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={OUTER_COLORS[index % OUTER_COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <PieChart width={420} height={420}>
                        <Pie style={{outline: 'none'}} labelLine={false} data={annotation_data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label={(props) => renderCustomizedLabel({...props, type: "2"})}>
                            {annotation_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={INNER_COLORS[index % INNER_COLORS.length]} />
                            ))}
                        </Pie>
                        <Pie style={{outline: 'none'}} label={renderLabel}  data={annotation_detailed_data} dataKey="value" cx="50%" cy="50%" innerRadius={124} outerRadius={144} fill="#db0909" endAngle={annotation_data[0].value / (annotation_data[0].value + annotation_data[1].value) * 360}>
                            {annotation_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={OUTER_ANNOTATION_COLORS[index % OUTER_ANNOTATION_COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default Home;