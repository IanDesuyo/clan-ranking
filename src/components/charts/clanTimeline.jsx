import React from "react";
import { Line, Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { formatDate } from "../../utils";
import { useMemo } from "react";

Chart.register(zoomPlugin);

const options = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    score: {
      type: "linear",
      display: true,
      position: "left",
    },
    ranks: {
      type: "linear",
      display: true,
      position: "right",
      reverse: true,
      gridLines: {
        drawOnChartArea: false,
      },
    },
  },
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: "x",
        speed: 100,
      },
      pan: {
        enabled: true,
        mode: "xy",
        speed: 100,
      },
    },
  },
};

export default function ClanTimelimeChart(props) {
  const { records } = props;

  return useMemo(() => {
    const data = {
      labels: records.map(x => formatDate(new Date(x.ts * 1000))),
      datasets: [
        {
          label: "分數",
          data: records.map(x => x.score),
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
          yAxisID: "score",
        },
        {
          label: "排名",
          data: records.map(x => x.rank),
          fill: false,
          backgroundColor: "rgb(54, 162, 235)",
          borderColor: "rgba(54, 162, 235, 0.2)",
          yAxisID: "ranks",
        },
      ],
    };
    return <Line data={data} options={options} />;
  }, [records]);
}
