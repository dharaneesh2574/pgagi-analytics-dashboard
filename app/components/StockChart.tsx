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
      <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
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
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    };

    return (
      <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
        <Line data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow flex items-center justify-center">
        <p className="text-gray-500">Error displaying chart data</p>
      </div>
    );
  }
} 