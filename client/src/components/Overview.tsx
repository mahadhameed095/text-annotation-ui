import { ClientInferResponseBody } from "@ts-rest/core";
import { ApiContract } from "api";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";


type AnnotationContractType = ClientInferResponseBody<typeof ApiContract['annotation']['getAnnotatedCountOverTime'], 200> 

interface Props {
  data: AnnotationContractType | undefined
}

export function Overview({data} : Props) {

  const formattedData = data?.map((item) => ({
    day: new Date(item.day).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <XAxis
          dataKey="day"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <Tooltip cursor={false}/>
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Line dataKey="count" fill="#adfa1d" />
      </LineChart>
    </ResponsiveContainer>
  )
}