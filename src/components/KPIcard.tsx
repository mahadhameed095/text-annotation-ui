

interface Props {
    color: string,
    value: number,
    title: string
}

const colors = {
    red : "text-red-600",
    yellow : "text-yellow-700",
    blue : "text-blue-500",
    green : "text-green-600",
    brown : "text-brown-600",
    black : "text-black-500",
}

const KPIcard = ({color, value, title}) => {
    return (
        <div className={`bg-[#f7f7f7] w-60 h-60 p-3 m-2 rounded-lg shadow-xl border flex flex-col`}>
            <h2 className={`${colors[color as keyof typeof colors]} text-center text-4xl font-bold`}>{title}</h2>
            <div className="m-auto">
                <p className={`${colors[color as keyof typeof colors]} text-center font-bold text-5xl m-auto`}>{value}</p>
            </div>
        </div>
     );
}
 
export default KPIcard;