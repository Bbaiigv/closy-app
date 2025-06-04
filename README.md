# 🌸 Closy - Tu Estilo Personal AI

> **Descubre el estilo que te hace única**

Closy es una aplicación móvil inteligente que te ayuda a descubrir y desarrollar tu estilo personal único a través de un sistema de cuestionarios personalizados y recomendaciones de moda.

## ✨ **¿Qué hace Closy?**

🎯 **Descubrimiento de estilo personal** - Cuestionarios inteligentes que analizan tus preferencias  
👗 **Recomendaciones personalizadas** - Suggestions basadas en tu perfil único  
💖 **Experiencia personalizada** - Todo adaptado a tu personalidad y gustos  
📱 **Interfaz moderna** - Diseño intuitivo y atractivo con animaciones fluidas  

## 🏗️ **Arquitectura Técnica**

- **Frontend:** React Native + Expo SDK 53
- **Navegación:** Expo Router (file-based routing)
- **Estado:** Context API con useReducer
- **Animaciones:** React Native Reanimated 3
- **Tipado:** TypeScript
- **Multimedia:** Expo AV para videos

## 🚀 **Instalación y Ejecución**

### **Requisitos previos**
- Node.js (v18 o superior)
- Expo CLI
- Dispositivo móvil con Expo Go o emulador

### **Instalación**
```bash
# Clonar el repositorio
git clone <tu-repo>
cd closy-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start
```

### **Opciones de ejecución**
```bash
# Desarrollo general
npx expo start

# Para correrlo sin caché
npx expo start --clear

# Para correrlo desde WSL2 (para conecrtarlo con el iphone) y sin caché
npx expo start --tunnel --clear
```

## 📱 **Flujo de la Aplicación**

### **1. Splash Screen** 
- Logo animado de Closy
- Transición automática a bienvenida

### **2. Pantalla de Bienvenida**
- Diseño atractivo con collage de estilos
- Opciones de **Registro** o **Ingreso**

### **3. Registro de Usuario**
- Formulario completo con validaciones
- Campos: nombre, email, contraseña, provincia, edad
- Navegación automática al descubrimiento de estilo

### **4. Login**
- Autenticación simple
- Navegación inteligente:
  - Si ya completó onboarding → Pantalla principal
  - Si no → Cuestionario de estilo

### **5. Descubrimiento de Estilo**
- Pantalla con animaciones de "respiración"
- Introducción al cuestionario personalizado

### **6. Cuestionario Interactivo**
- **9 estilos diferentes** para evaluar:
  - Básica, Boho, Cayetana -20, Cayetana +20
  - Formal Clásica, Moderna Trendy, Pija, Sexy, ST
- **Sistema de puntuación** 1-5 (No me gusta → Me encanta)
- **Progreso visual** con navegación hacia atrás
- **Persistencia** de respuestas en contexto global

### **7. Pantalla Principal**
- **Saludo personalizado** con nombre del usuario
- **Top 3 estilos favoritos** con ratings visuales
- **Acciones rápidas** para explorar y guardarropa

## 🎨 **Paleta de Colores**

- **Principal:** `#FAA6B5` (Rosa suave)
- **Secundario:** `#4D6F62` (Verde elegante)  
- **Fondo:** `#FCF6F3` (Beige cálido)
- **Texto:** `#7A142C` (Granate profundo)

## 📂 **Estructura del Proyecto**

```
closy-app/
├── 📱 app/                 # Pantallas (Expo Router)
│   ├── (tabs)/            # Navegación principal
│   ├── index.tsx          # Splash screen
│   ├── welcome.tsx        # Bienvenida
│   ├── register.tsx       # Registro
│   ├── login.tsx          # Login
│   ├── discover-style.tsx # Intro cuestionario
│   └── questionnaire-block1.tsx # Cuestionario
├── 🧩 components/         # Componentes reutilizables
├── 🎯 contexts/          # Estado global (Context API)
├── 🎨 assets/            # Imágenes, fuentes, videos
│   ├── images/Images/    # Logos y recursos
│   ├── Bloque1_onboarding/ # Imágenes del cuestionario
│   └── fonts/           # Tipografías personalizadas
├── 🎛️ constants/        # Constantes (colores, etc.)
└── 🪝 hooks/            # Hooks personalizados
```

## 🔄 **Estado Global**

La app utiliza **Context API** para manejar:

- **Usuario:** datos personales y estado de login
- **Respuestas del cuestionario:** persistidas durante la sesión
- **Progreso del onboarding:** tracking de completación
- **Navegación inteligente:** redirección basada en estado

## 🛠️ **Scripts Disponibles**

```bash
npm start          # Inicio rápido
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS  
npm run web        # Ejecutar en navegador
npm run lint       # Verificar código
```

## 🎯 **Funcionalidades Implementadas**

✅ **Sistema de registro y login completo**  
✅ **Cuestionario interactivo de 9 estilos**  
✅ **Estado global con Context API**  
✅ **Navegación inteligente basada en estado**  
✅ **Animaciones fluidas y atractivas**  
✅ **Validación de formularios robusta**  
✅ **Diseño responsive y moderno**  
✅ **Tipado completo con TypeScript**  

## 🔮 **Próximas Funcionalidades**

🔄 **Persistencia con AsyncStorage**  
🔄 **Sistema de recomendaciones avanzado**  
🔄 **Integración con catálogo de ropa**  
🔄 **Función de guardarropa personal**  
🔄 **Sistema de notificaciones**  
🔄 **Modo oscuro/claro**  



## 📧 **Contacto**

**Closy Team** - Tu estilo personal, potenciado por IA

---

*Hecho con 💖 para fashionistas que quieren descubrir su estilo único*
