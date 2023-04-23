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

  const [test1, setTest1] = useState(0);
  const [test2, setTest2] = useState(0);
  const [test3, setTest3] = useState(0);
  const [test4, setTest4] = useState(0);
  const [profit, setProfit] = useState(0);

  setInterval(() => {
    //  + test,
    // + (Math.random() * 100).toFixed(1)

    const random1 = Math.floor(Math.random() * 10 + 1);
    const random2 = Math.floor(Math.random() * 10 + 1);
    const random3 = Math.floor(Math.random() * 10 + 1);
    const random4 = Math.floor(Math.random() * 10 + 1);
    // const increase = (Math.random() * 100).toFixed(1);
    setTest1(test1 + random1);
    setTest2(test2 + random2);
    setTest3(test3 + random3);
    setTest4(test4 + random4);
    // console.log(random);
  }, 1000);

  //   setInterval(() => {
  //     const currentProfit = props.profitlist[0];
  //     setProfit(currentProfit);
  //     console.log(profit, "checking");
  //   }, 3000);

  //   setInterval(() => {
  //     setData({
  //       labels: ["You", "Type A Driver", "Type B Driver", "Type C Driver"],
  //       datasets: [
  //         {
  //           label: "Profit",
  //           data: [props.profitlist[0], 10, 60, 50],
  //           backgroundColor: "rgb(53, 162, 235)",
  //         },
  //         //   {
  //         //     label: props.variable,
  //         //     data: [10, 20, 30, 40],
  //         //     backgroundColor: "rgb(255, 99, 132)",
  //         //   },
  //       ],
  //     });
  //   }, 1000);

  const [variable, setVariable] = useState(0);

  const labels = ["You", "Type A Driver", "Type B Driver", "Type C Driver"];
  // Math.floor(Math.random() * 10 + 1) + test,
  // Math.floor(Math.random() * 10 + 1) + test,
  // Math.floor(Math.random() * 10 + 1) + test,
  // Math.floor(Math.random() * 10 + 1) + test,
  let data = {
    labels,
    datasets: [
      {
        label: props.label,
        data: [test1, test2, test3, test4],
        backgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };

  // const [data, setData] = useState({
  //   labels: ["You", "Type A Driver", "Type B Driver", "Type C Driver"],
  //   datasets: [
  //     {
  //       label: "Profit",
  //       data: [test, 100, 45, 70],
  //       backgroundColor: "rgb(53, 162, 235)",
  //     },
  //     //   {
  //     //     label: props.variable,
  //     //     data: [10, 20, 30, 40],
  //     //     backgroundColor: "rgb(255, 99, 132)",
  //     //   },
  //   ],
  // });

  const options = {
    plugins: {
      title: {
        display: true,
        // text: "Chart.js Bar Chart - Stacked",
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
