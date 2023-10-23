

interface Props {
    color: string,
    value: number,
    title: string
}

const colors = {
    red : "bg-red-600",
    yellow : "bg-yellow-700",
    blue : "bg-blue-500",
    green : "bg-green-600",
    brown : "bg-brown-600",
    black : "bg-black-500",
}

const KPIcard = ({color, value, title} : Props) => {
    return (
        <div className="m-2">
            <div className={`${colors[color as keyof typeof colors]} w-60 h-48 sm:w-60 sm:h-60 p-3 m-auto sm:m-0 rounded-lg shadow-xl border flex flex-col`}>
                <h2 className={`text-white text-center text-4xl`}>{title}</h2>
                <div className="m-auto">
                    <p className={`text-white text-center text-4xl sm:text-5xl m-auto`}>{value}</p>
                </div>
            </div>
        </div>
     );
}
 
export default KPIcard;