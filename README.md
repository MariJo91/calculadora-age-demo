<img width="1857" height="565" alt="Image" src="https://github.com/user-attachments/assets/5dc72cc8-71c2-480a-8441-41a8cfe7c282" />

## 📘 Calculadora AGE – Estimación de Reducción de Cargas Administrativas GobLab Gran Canaria

## 🏛️ Contexto institucional  
Este proyecto es una **demo funcional de la Calculadora de Cargas Administrativas (AGE)**, desarrollada para el **GobLab Gran Canaria** (Laboratorio de Innovación Pública del Cabildo).  
Su objetivo es **medir y visualizar el impacto económico** de la simplificación administrativa, aplicando la metodología oficial AGE y automatizando el flujo completo mediante **n8n**.

👉 Demo pública: https://calculadoragrancanariagoblab.netlify.app

<img width="875" height="600" alt="Image" src="https://github.com/user-attachments/assets/9cdf354b-271a-4507-b22b-f91b60dce3d6" />

---

## 🎯 Objetivo del proyecto  
- Implementar un **MVP operativo** con branding institucional.  
- Automatizar la recepción de solicitudes, generación de informes y notificaciones.  
- Proveer un **dashboard institucional en tiempo real** con métricas clave.  
- Facilitar la trazabilidad mediante almacenamiento en Google Sheets.  

---

## 🛠️ Stack tecnológico  
- **Frontend**:  
  - HTML5, CSS3, JavaScript Vanilla  
  - Bootstrap 5 (UI responsive)  
  - Chart.js (visualizaciones)  
- **Automatización Backend**:  
  - [n8n](https://n8n.io/) (Docker)  
  - Workflows: *Calculadora* + *Dashboard*  
  - Integración con Google Sheets y Gmail API  
  - Generación de PDFs vía [PDF.co](https://pdf.co/)  
- **Infraestructura**:  
  - Nginx (servidor estático + proxy)  
  - VPS (4 GB RAM / 2 CPU)  
  - Certificados SSL con Let’s Encrypt  

---

## 📂 Estructura del repositorio

```
calculadora-age-demo/
├── frontend/
│   ├── index.html                  # Calculadora principal
│   ├── dashboard.html              # Dashboard institucional
│   ├── about.html                  # Información metodológica
│   ├── css/styles.css              # Estilos personalizados
│   ├── js/
│   │   ├── calculadora.js          # Lógica principal de cálculo
│   │   ├── dashboard.js            # Visualización de métricas
│   │   └── utils.js                # Funciones auxiliares
│   └── assets/                     # Logo e insumos

├── n8n/
│   ├── workflows/
│   │   ├── Calculadora Institucional AGE goblab.json
│   │   └── Dashboard Institucional AGE goblab.json
│   └── docker-compose.yml         # Orquestación n8n

├── docs/
│   ├── README.md                   # Este archivo
│   ├── API.md                      # Referencia técnica
│   └── TROUBLESHOOTING.md          # Guía de soporte

```

---

## 🤖 Workflows n8n

### 1. **Calculadora Institucional AGE goblab**
Flujo completo de recepción, validación y notificación:  
- `Webhook` → recibe datos del formulario.  
- `Validación Data` → normaliza email, agrega ID y timestamp.  
- `Clasificar por Impacto` → Bajo, Medio o Alto (según ahorro).  
- `DB_Google Sheets` → registra cada cálculo en una hoja compartida.  
- `Function Node` → genera texto y define destinatarios.  
- `HTML + PDF.co` → construye informe oficial y lo convierte en PDF.  
- `Envio de Correo (Gmail)` → notificación automática con adjunto institucional.  

📄 Resultado: **Informe oficial PDF + email automático a solicitante e institución**.  

---

### 2. **Dashboard Institucional AGE goblab**
Flujo para servir métricas dinámicas en JSON al dashboard web:  
- `Webhook` → endpoint `/dashboard`.  
- `Google Sheets` → lectura de registros históricos.  
- `Procesar Métricas` → cálculos agregados:  
  - Total de análisis realizados  
  - Ahorro acumulado  
  - Gráfico temporal (ahorros por día)  
  - Top 5 servicios  
  - Últimos 10 análisis  
  - Clasificación impacto (positivos vs negativos)  
- `Respond to Webhook` → API JSON lista para consumo por frontend.  

📊 Resultado: **Visualización institucional en tiempo real**.  

---

## 📊 Flujos n8n

![Workflows Calculadora y Dashboard]

Flujo Principal Calculadora AGE
<img width="1307" height="482" alt="Image" src="https://github.com/user-attachments/assets/98478262-d307-4896-bf1a-bf854da5e079" />

Flujo Dashboard Calculadora AGE
<img width="607" height="181" alt="Image" src="https://github.com/user-attachments/assets/815356db-06d6-458a-bc4e-8cb9e48f6910" />

---

## 📑 Metodología AGE
Basada en el **Manual oficial de simplificación administrativa y reducción de cargas de la AGE**:  
- Fórmula: `CA = CU × FR × PB`  
- Clasificación automática por impacto:  
  - **Alto** > 50.000 €  
  - **Medio** > 10.000 €  
  - **Bajo** ≤ 10.000 €  

Referencia oficial: [Manual AGE PDF](https://digital.gob.es/content/dam/portal-mtdfp/funcion-publica/gobernanza-publica/simplificacion/manual-simplificacion/14_Manual_Simplificacion_Administrativa_y_reduccion_de_cargas_AGE.pdf)  

---

## 🚀 Deploy rápido

### Frontend (Netlify)
1. Fork del repositorio.  
2. Conectar con Netlify.  
3. Configurar dominio institucional.  

### n8n (Docker Compose)
```bash
docker-compose up -d

Variables principales:

N8N_HOST, N8N_PORT, WEBHOOK_URL
Credenciales Gmail + Google Sheets + PDF.co

✅ Criterios de éxito

Cálculo exacto según metodología AGE.
Flujo completo: Formulario → n8n → PDF + Email → Dashboard.
Tiempos de respuesta:
< 3s carga inicial
< 30s notificación con PDF
Uptime: 99%.
Responsive y mobile-first.

📌 Casos de uso de demo

Licencia de obras menores.
Tramitación de subvenciones.
Gestión de expedientes internos.

📖 Documentación adicional
Demo pública