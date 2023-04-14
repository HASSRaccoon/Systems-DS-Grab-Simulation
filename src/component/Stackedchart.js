import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

export function StackedChart(props) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [test, setTest] = useState(50);

  setInterval(() => {
    const random = (Math.random() * 100).toFixed(2);
    setTest(random);
  }, 3000);

  setInterval(() => {
    // console.log(props.variable, "update?");
    // console.log(props.variable[0], "update?");
    // setVariable(props.variable[0]);
  }, 3000);

  const [variable, setVariable] = useState(0);

  const labels = ["You", "Type A Driver", "Type B Driver", "Type C Driver"];

  let data = {
    labels,
    datasets: [
      {
        label: "temp",
        data: [variable, 60, 70, 80],
        backgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  //   const [profit, setProfit] = useState(0);
  //   setInterval(() => {
  //     let currentProfit = props.profits;
  //     setProfit(currentProfit);
  //     console.log(profit, "check");
  //   }, 1000);
  //   useEffect(() => {
  //     setProfit(props.profitdata[0]);
  //   }, [props.profitdata]);
  //   console.log(props.profitdata, "hiiffffi");
  //   console.log(profit, "hiii");
  //   useEffect(() => {
  //   setProfit(props.profitdata[0]);
  //     console.log(props);
  //     console.log(props.profits);
  //   }, [props]);

  return <Bar options={options} data={data} />;
}
