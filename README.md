<img width="1857" height="565" alt="Image" src="https://github.com/user-attachments/assets/5dc72cc8-71c2-480a-8441-41a8cfe7c282" />

## 📘 Calculadora AGE – Estimación de Reducción de Cargas Administrativas

Esta aplicación permite calcular el ahorro administrativo mediante el Método Simplificado (MS) aprobado por el Consejo de Ministros el 19/09/2014, conforme al Manual oficial de la AGE (págs. 77–80). Está diseñada para facilitar la generación de solicitudes personalizadas desde administraciones públicas, alineando la experiencia institucional con los estándares de innovación de GoBLab Gran Canaria.

## 🧭 Objetivo

Facilitar a equipos municipales y de la administración pública una herramienta accesible para estimar el **ahorro económico** generado por la digitalización de trámites. La arquitectura es modular y replicable.

## 🚀 Despliegue y entornos

- Frontend institucional:
https://calculadoragrancanariagoblab.netlify.app/
Desplegado en Netlify, con diseño adaptado a la estética de GoBLab Gran Canaria.

- Automatización de flujos (n8n):
Subdominio activo en producción:
grancanaria.goblab.com
Instancia dockerizada y validada por el equipo técnico.

## 🧪 Flujo funcional
- Ingreso de datos del usuario
- Nombre completo
- Correo electrónico
- Servicio o departamento
- Análisis de cargas administrativas
- Paso 1: Cargas iniciales
- Paso 2: Cargas finales
- Paso 3: Parámetros anuales (PB, FR, CU)
- Cálculo automático del ahorro
- Fórmula: CA = CU × FR × PB
- Ahorro = Costo Inicial − Costo Final
- Generación de PDF institucional
- Integración con n8n vía webhook
- Descarga disponible tras validación

## 🎨 Estética institucional
- Paleta de colores basada en GoBLab Gran Canaria:
- Azul oscuro: #003366
- Azul claro: #00AEEF
- Blanco: #FFFFFF
- Amarillo institucional: #FFCC00
- Tipografía: 'Segoe UI', 'Arial', sans-serif
- Logo institucional integrado en el encabezado


🏛️ Institución
Este proyecto forma parte del ecosistema de innovación pública impulsado por GoBLab Gran Canaria, con enfoque en la replicabilidad técnica y la transferencia institucional entre municipios.


