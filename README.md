# Guía Frontend Angular - Sistema de Gestión de Usuarios

Este proyecto es una aplicación frontend moderna desarrollada con **Angular 21**. Proporciona una interfaz robusta y escalable para la gestión de usuarios, implementando una arquitectura basada en componentes, reactividad con Signals, diseño modular con SCSS y consumo de una API RESTful.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

*   **Node.js** (versión 18.x o superior recomendada). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager), que generalmente viene incluido con Node.js.
*   **Angular CLI** (opcional pero recomendado de forma global). Puedes instalarlo con el comando:
    ```bash
    npm install -g @angular/cli@21
    ```

## 🚀 Instalación

Sigue estos pasos para instalar y configurar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/CHIMIgb/guia-frontend-angular.git
    ```

2.  **Navegar al directorio del proyecto:**
    ```bash
    cd guia-frontend-angular
    ```

3.  **Instalar las dependencias del proyecto:**
    ```bash
    npm install
    ```

## ⚙️ Configuración del Entorno

La aplicación necesita comunicarse con un backend (API REST). Las URLs de la API están definidas en los archivos de entorno ubicados en `src/environments/`.

*   **Entorno de Desarrollo (`src/environments/environment.development.ts`):**
    Por defecto, la API local apunta a `http://localhost:8080/api/v1`.
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:8080/api/v1' // Asegúrate de que coincida con tu backend
    };
    ```
*   **Entorno de Producción (`src/environments/environment.ts`):**
    Aquí debes configurar la URL de tu API de producción antes de desplegar.

Si tu backend está corriendo en un puerto diferente, ajusta la propiedad `apiUrl` según corresponda.

## 💻 Ejecución en Modo Desarrollo

Para iniciar el servidor de desarrollo local, ejecuta el siguiente comando:

```bash
npm start
```
*(O alternativamente: `ng serve` si tienes Angular CLI global)*

Una vez que el servidor haya compilado la aplicación, abre tu navegador web y visita:
**[http://localhost:4200/](http://localhost:4200/)**

La aplicación se recargará automáticamente en el navegador cada vez que guardes cambios en los archivos fuente.

## 🛠️ Construcción para Producción (Build)

Para compilar la aplicación para un entorno de producción, ejecuta:

```bash
npm run build
```
*(O alternativamente: `ng build`)*

Este comando compilará la aplicación de forma optimizada y depositará los archivos estáticos resultantes en el directorio `dist/`. Estos archivos están listos para ser servidos por cualquier servidor web (como Nginx, Apache, o un servicio en la nube).

## 🧪 Pruebas Unitarias

Este proyecto está configurado para usar **Vitest** en lugar de Karma/Jasmine para mayor velocidad de ejecución.

Para correr las pruebas unitarias, ejecuta:

```bash
npm test
```
*(O alternativamente: `ng test`)*

## 🏗️ Tecnologías Utilizadas

*   **Framework:** [Angular 21](https://angular.dev/)
*   **Lenguaje principal:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [SCSS (Sass)](https://sass-lang.com/)
*   **Manejo de estados y asincronía:** [RxJS](https://rxjs.dev/) y Angular Signals
*   **Testing:** [Vitest](https://vitest.dev/)
