import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

let pieData = [];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${pieData[index].name} ${pieData[index].value}`}
    </text>
  );
};

export default function PieChartComponent(props) {
  pieData = props.pieData;

  return (
    <PieChart width={500} height={400}>
      <Pie
        data={props.pieData}
        cx="50%"
        cy="50%"
        dataKey="value"
        outerRadius={100}
        labelLine={true}
        label={renderCustomizedLabel}
        fill="#8884d8"
      >
        {props.pieData.map((entry, index) => (
          <Cell fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
