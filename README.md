<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/a23c46fd-13c1-4a85-a6cf-9bca120abf85" />
# 📘 Calculadora AGE – Estimación de Reducción de Cargas Administrativas

Proyecto de arquitectura pública para el cálculo del ahorro anual derivado de la simplificación de trámites, basado en el **Método de Costes Estándar (AGE)**.

## 🧭 Objetivo

Facilitar a equipos municipales y de la administración pública una herramienta accesible para estimar el **ahorro económico** generado por la digitalización de trámites. La arquitectura es modular y replicable.

## 🔗 Demo en línea

[calculadora-age-demo.netlify.app](https://calculadora-age-demo.netlify.app)

---

## 🧱 Arquitectura

Este proyecto está construido con una arquitectura "sin servidor" (Serverless) utilizando herramientas de código abierto:

* **Frontend**: Interfaz de cálculo en **Netlify** (HTML, CSS y JavaScript).
* **Backend**: Orquestación y lógica de negocio en **n8n**, desplegado en un **VPS de DigitalOcean**.
* **Proxy Inverso**: **Traefik** para el enrutamiento y **Cloudflare Tunnel** para asegurar el tráfico con HTTPS automático.
* **Persistencia**: **Google Sheets** para el almacenamiento seguro de datos, reemplazando la escritura en un archivo local (`.csv`) por restricciones de seguridad del entorno.

---

## 📊 Flujo de Datos

El flujo de trabajo automatizado en n8n procesa la información en una secuencia de nodos:

1.  **`Webhook`**: Recibe una solicitud `POST` con los datos del formulario de la calculadora.
2.  **`Validation Data`**: Valida que los datos clave estén presentes (`procedimiento`, `ahorroAnual`) y en el formato correcto. Añade metadatos como `ID` y `timestamp` para trazabilidad.
3.  **`Clasify Impact`**: Clasifica el ahorro anual en categorías de impacto: **Alto**, **Medio** o **Bajo**.
4.  **`Google Sheets`**: Almacena cada cálculo como una nueva fila en una hoja de cálculo, garantizando la persistencia de los datos de forma segura.

---

## 📸 Interfaz
<img width="1241" height="607" alt="Image" src="https://github.com/user-attachments/assets/b49048de-504f-47b0-a185-5518b65e00c0" />
* **Interfaz de cálculo**
<img width="1171" height="777" alt="Image" src="https://github.com/user-attachments/assets/472861e6-9af0-44b4-827f-f9f557ed3987" />
* **Diagrama de flujo de n8n**
    

---

## 📌 Próximos Pasos

* Desarrollar un segundo flujo de trabajo en n8n para la **generación y envío de informes PDF** a los usuarios por correo electrónico.
* Explorar soluciones de almacenamiento alternas para la persistencia de datos (ej. bases de datos como PostgreSQL).
* Mejorar la documentación técnica para la replicación del proyecto en entornos municipales.
