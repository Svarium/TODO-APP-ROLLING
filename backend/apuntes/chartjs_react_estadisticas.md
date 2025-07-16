# 📊 Uso de Chart.js en React para Mostrar Estadísticas

Este documento explica cómo utilizar la librería [Chart.js](https://www.chartjs.org/) dentro de una aplicación React para crear gráficos visuales e interactivos. Veremos primero cómo implementar Chart.js de forma **genérica**, y luego cómo aplicarlo en un componente real que muestra estadísticas de tareas.

---

## 🧩 ¿Qué es Chart.js?

**Chart.js** es una librería JavaScript que permite generar gráficos interactivos mediante el elemento `<canvas>` de HTML5. Es liviana, fácil de usar y permite representar datos de manera clara.

---

## 🚀 Instalación

Para agregarla a tu proyecto React:

```bash
npm install chart.js
```

---

## ⚙️ Implementación Genérica en React

Chart.js no está diseñado exclusivamente para React, por lo que usamos `useRef` y `useEffect` para integrarlo con el ciclo de vida de los componentes.

### 🧱 Estructura básica

```jsx
import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // importante para registrar todos los gráficos y plugins

const MiGrafico = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destruir instancia previa si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Crear gráfico
    chartInstance.current = new Chart(ctx, {
      type: 'bar', // o 'line', 'pie', etc.
      data: {
        labels: ['Enero', 'Febrero', 'Marzo'],
        datasets: [{
          label: 'Ventas',
          data: [12, 19, 3],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Limpiar al desmontar
    return () => chartInstance.current?.destroy();
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default MiGrafico;
```

### 📌 Puntos clave
- **`useRef`**: permite acceder al elemento `<canvas>`.
- **`useEffect`**: crea el gráfico al montar el componente.
- **`chartInstance.current.destroy()`**: limpia el gráfico anterior antes de crear uno nuevo, evitando superposiciones.

---

## 📋 Aplicación en un Componente de Estadísticas de Tareas

Una vez entendida la base, se puede usar Chart.js en una app real. Por ejemplo, para mostrar estadísticas de tareas por mes.

### 🧠 Qué mostramos en este componente
- Cantidad de tareas en los últimos 6 meses (gráfico de barras).
- Total de tareas.
- Tareas del mes actual.
- Tareas con archivos.
- Total de archivos.
- Tipo de archivo más común.

### 🛠️ Estructura del gráfico

1. Procesamos las tareas para agruparlas por mes.
2. Renderizamos el gráfico con `Chart.js` usando `canvas`.
3. Mostramos otras estadísticas en tarjetas visuales.

### 🧩 Código resumido del gráfico

```js
useEffect(() => {
  if (!tasks.length) return;

  const monthsData = getLastSixMonthsData(tasks);
  const ctx = chartRef.current.getContext('2d');

  chartInstance.current?.destroy();

  chartInstance.current = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(monthsData),
      datasets: [{
        label: 'Tareas',
        data: Object.values(monthsData),
        backgroundColor: '#3B82F6',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });

  return () => chartInstance.current?.destroy();
}, [tasks]);
```

```jsx
<div className="h-48">
  <canvas ref={chartRef}></canvas>
</div>
```

---

## 🧠 Recomendaciones

- Siempre destruir el gráfico anterior con `.destroy()` para evitar errores.
- Asegurarse de que el `canvas` tenga altura definida (`h-48` en Tailwind funciona bien).
- Los datos deben estar bien preparados antes de pasar al gráfico.

---

Con esta estructura, podés reutilizar Chart.js en cualquier otro componente de tu aplicación React. Ya sea para estadísticas, dashboards o visualizaciones más complejas.