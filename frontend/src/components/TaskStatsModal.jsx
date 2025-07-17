import React, { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

const getLastSixMonthsData = (tasks, useCreatedAt = true) => {
  const now = new Date();
  const monthsData = {};

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString('es-ES', { month: 'short' });
    monthsData[key] = 0;
  }

  tasks.forEach((task) => {
    const dateToUse = useCreatedAt ? task.createdAt : task.dueDate;
    if (!dateToUse) return;
    
    const taskDate = new Date(dateToUse);
    const key = taskDate.toLocaleDateString('es-ES', { month: 'short' });
    if (monthsData[key] !== undefined) monthsData[key]++;
  });

  return monthsData;
};

const getFileStats = (tasks) => {
  const fileTypes = {};
  let conArchivos = 0, totalArchivos = 0;

  tasks.forEach(task => {
    const files = task.files || [];
    if (files.length) conArchivos++;
    totalArchivos += files.length;

    files.forEach(file => {
      // Detectar tipo de archivo por extensión del nombre
      const fileName = file.name || '';
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      let displayType = 'Otros';

      if (extension === 'pdf') {
        displayType = 'PDF';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
        displayType = 'Imágenes';
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) {
        displayType = 'Videos';
      } else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(extension)) {
        displayType = 'Audio';
      } else if (['doc', 'docx'].includes(extension)) {
        displayType = 'Documentos Word';
      } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
        displayType = 'Hojas de Cálculo';
      } else if (['ppt', 'pptx'].includes(extension)) {
        displayType = 'Presentaciones';
      } else if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js'].includes(extension)) {
        displayType = 'Texto';
      } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        displayType = 'Archivos Comprimidos';
      }

      fileTypes[displayType] = (fileTypes[displayType] || 0) + 1;
    });
  });

  const top = Object.entries(fileTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  return { conArchivos, totalArchivos, topFileType: top, fileTypes };
};

const StatCard = ({ value, label, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg text-center`}>
    <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    <div className={`text-sm text-${color}-800`}>{label}</div>
  </div>
);

const TaskStatsModal = ({ tasks = [], onClose }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartMode, setChartMode] = useState('created'); // 'created' o 'due'

  useEffect(() => {
    if (!tasks.length) return;
    const monthsData = getLastSixMonthsData(tasks, chartMode === 'created');
    const ctx = chartRef.current.getContext('2d');

    chartInstance.current?.destroy();

    chartInstance.current = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(monthsData),
        datasets: [{
          label: chartMode === 'created' ? 'Tareas Creadas' : 'Tareas con Vencimiento',
          data: Object.values(monthsData),
          backgroundColor: chartMode === 'created' ? '#3B82F6' : '#10B981',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (context) => {
                const month = context[0].label;
                return `${month} - ${chartMode === 'created' ? 'Creadas' : 'Vencen'}`;
              }
            }
          }
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [tasks, chartMode]);

  if (!tasks.length) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Estadísticas</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <p className="text-gray-600 text-center">No hay tareas para mostrar</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const thisMonth = tasks.filter(({ createdAt }) => {
    const d = new Date(createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Tareas vencidas
  const overdueTasks = tasks.filter(({ dueDate }) => {
    if (!dueDate) return false;
    return new Date(dueDate) < now;
  }).length;

  const { conArchivos, totalArchivos, topFileType, fileTypes } = getFileStats(tasks);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Estadísticas de Tareas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard value={tasks.length} label="Total Tareas" color="blue" />
          <StatCard value={thisMonth} label="Creadas Este Mes" color="green" />
          <StatCard value={overdueTasks} label="Vencidas" color="red" />
          <StatCard value={conArchivos} label="Con Archivos" color="purple" />
          <StatCard value={totalArchivos} label="Total Archivos" color="orange" />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Últimos 6 Meses</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartMode('created')}
                className={`px-3 py-1 rounded text-sm ${
                  chartMode === 'created' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Creadas
              </button>
              <button
                onClick={() => setChartMode('due')}
                className={`px-3 py-1 rounded text-sm ${
                  chartMode === 'due' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Vencimientos
              </button>
            </div>
          </div>
          <div className="h-48"><canvas ref={chartRef}></canvas></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Archivos</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Tipo más común:</strong> {topFileType}</p>
              <div className="mt-2">
                {Object.entries(fileTypes).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Resumen</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Promedio archivos por tarea:</strong> {(totalArchivos / tasks.length).toFixed(1)}</p>
              <p><strong>% tareas con archivos:</strong> {((conArchivos / tasks.length) * 100).toFixed(1)}%</p>
              <p><strong>% tareas vencidas:</strong> {((overdueTasks / tasks.length) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatsModal;