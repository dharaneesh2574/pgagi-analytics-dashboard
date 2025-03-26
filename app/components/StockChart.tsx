'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TimeSeriesData } from '../types/finance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  data: {
    [date: string]: TimeSeriesData;
  } | null | undefined;
  title: string;
}

export default function StockChart({ data, title }: StockChartProps) {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-900 p-4 rounded-lg shadow flex items-center justify-center">
        <p className="text-gray-300">No data available</p>
      </div>
    );
  }

  try {
    const dates = Object.keys(data).sort();
    const prices = dates.map(date => parseFloat(data[date]['4. close']));

    const chartData = {
      labels: dates,
      datasets: [
        {
          label: 'Stock Price',
          data: prices,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: 'white',
          },
        },
        title: {
          display: true,
          text: title,
          color: 'white',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'white',
          },
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'white',
          },
        },
      },
    };

    return (
      <div className="w-full h-[400px] bg-gray-900 p-4 rounded-lg shadow">
        <Line data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-[400px] bg-gray-900 p-4 rounded-lg shadow flex items-center justify-center">
        <p className="text-gray-300">Error displaying chart data</p>
      </div>
    );
  }
} 