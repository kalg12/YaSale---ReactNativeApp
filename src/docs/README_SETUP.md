# YaSale - MVP React Native Expo App

Aplicación de cocina y gestión de órdenes para street food (comida de calle) construida con Expo, React Native y TypeScript.

## 📱 Plataformas Soportadas

- iOS (iPad + iPhone)
- Android (tablets + phones)
- Web (experimental)

## 🎯 Características Principales

- **Autenticación con PIN**: Login seguro con 4-6 dígitos
- **Roles de Usuario**: ADMIN, MANAGER, KITCHEN, WAITER, CASHIER
- **Sistema de Órdenes en Tiempo Real**: Socket.IO para actualizaciones instantáneas
- **Cocina (KDS)**: Vista de órdenes sin precios, estado PENDING → IN_PROGRESS → READY
- **Mesero/Caja**: Crear órdenes, gestionar cuentas, procesar pagos
- **Admin**: Dashboard de estadísticas y configuración
- **Multiidioma**: Español (default) e Inglés con i18n
- **Offline Support**: Banner de conectividad
- **Caché Persistente**: TanStack Query con AsyncStorage para menu

## 🏗 Estructura del Proyecto

```
src/
├── app/                      # Routing con Expo Router (file-based)
│   ├── _layout.tsx          # Root layout con providers
│   ├── index.tsx
│   ├── (auth)/
│   │   └── login.tsx
│   ├── (kitchen)/
│   │   ├── index.tsx        # KDS list/grid
│   │   └── order-[id].tsx   # Detalles de orden
│   ├── (waiter)/
│   │   ├── index.tsx
│   │   ├── order.tsx
│   │   ├── checks.tsx
│   │   └── close-check.tsx
│   └── (admin)/
│       ├── index.tsx
│       ├── dashboard.tsx
│       └── settings-printer.tsx
│
├── components/              # React components reutilizables
│   ├── ui/
│   │   └── OfflineBanner.tsx
│   ├── layout/
│   ├── kitchen/
│   │   ├── OrderCard.tsx
│   │   └── OrderDetailView.tsx
│   ├── order/
│   └── checks/
│
├── features/               # Lógica de negocio (API, hooks, tipos)
│   ├── auth/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   ├── orders/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── socket.ts
│   │   └── types.ts
│   ├── menu/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   ├── checks/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   └── reports/
│       ├── api.ts
│       ├── hooks.ts
│       └── types.ts
│
├── lib/                    # Librerías y configuración
│   ├── api/
│   │   └── client.ts      # Axios instance con interceptores
│   ├── config/
│   │   └── env.ts         # Variables de entorno
│   ├── query/
│   │   ├── keys.ts        # Query key factory
│   │   ├── client.ts      # QueryClient config
│   │   ├── persist.ts     # AsyncStorage persister
│   │   └── provider.tsx   # QueryClientProvider
│   ├── socket/
│   │   ├── client.ts      # Socket.IO singleton
│   │   └── events.ts      # Tipos y eventos
│   ├── storage/
│   │   └── index.ts       # AsyncStorage helpers
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── es.json
│   │   └── en.json
│   └── utils/
│       ├── money.ts       # Funciones de dinero/moneda
│       └── dates.ts       # Funciones de fechas
│
└── stores/                 # Zustand stores (estado global)
    ├── auth.store.ts      # Autenticación y usuario
    ├── ui.store.ts        # Estado de UI
    ├── orderDraft.store.ts # Orden siendo creada
    └── ordersLive.store.ts # Órdenes en tiempo real
```

## 🚀 Empezar

### Requisitos Previos

- Node.js 18+ y npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS (Xcode) o Android (Android Studio) para desarrollo nativo
- Backend NestJS ejecutándose en `http://localhost:3000`

### Instalación

1. **Clonar repositorio**

   ```bash
   git clone <repo>
   cd yasale
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con URLs de API y Socket
   ```

4. **Iniciar app**

   ```bash
   npm start
   # o
   expo start
   ```

   Luego presionar:

   - `i` para iOS
   - `a` para Android
   - `w` para web

## 🔧 Configuración

### Variables de Entorno (app.config.ts)

```typescript
API_URL=http://localhost:3000/api      // URL base de API
SOCKET_URL=http://localhost:3000       // URL de WebSocket
DEFAULT_LANGUAGE=es                     // Idioma por defecto
```

### Configuración de QueryClient

Las queries están configuradas con:

- **staleTime**: 5 minutos (datos frescos)
- **gcTime**: 10 minutos (mantén en caché)
- **retry**: 1 intento
- **Persistencia**: Solo menu (categories, products)

NO se persisten:

- Órdenes (live state solo)
- Cheques/cuentas
- Datos de usuario

### Socket.IO Events

**Eventos escuchados:**

- `order.created` → Nueva orden
- `order.started` → Orden iniciada en cocina
- `order.ready` → Orden lista
- `order.cancelled` → Orden cancelada
- `check.paid` → Pago procesado (remove orden)

**Room:**

```
tenant:{tenantId}:store:{storeId}
```

## 📦 Dependencias Principales

### Core

- **expo** ~54.0.30 - Framework para React Native
- **expo-router** ~6.0.21 - File-based routing
- **react** 19.1.0 - Library
- **react-native** 0.81.5

### State Management

- **zustand** ^5.0.9 - Global state (auth, ui, orders)

### API & Data

- **axios** ^1.13.2 - HTTP client
- **@tanstack/react-query** ^5.90.15 - Server state + caching
- **@tanstack/query-async-storage-persister** ^5.90.17 - Persist queries
- **socket.io-client** ^4.8.3 - Real-time events

### UI

- **react-native-paper** ^5.14.5 - Material Design components
- **react-native-reanimated** ~4.1.1 - Animations
- **@react-navigation/\*\*** - Navigation primitives

### Forms & i18n

- **react-hook-form** ^7.69.0 - Form state
- **i18next** ^25.7.3 - Internationalization
- **react-i18next** ^16.5.0 - i18next React binding

### Utilities

- **dayjs** ^1.11.19 - Date manipulation
- **expo-network** ~8.0.8 - Connectivity detection
- **expo-constants** - App configuration

## 🔐 Autenticación

### Flow de Login

1. Usuario ingresa PIN de 4-6 dígitos
2. POST `/auth/pin-login` con `{ pin, storeId? }`
3. Response contiene `token` y `user`
4. Token guardado en AsyncStorage (con Zustand)
5. Token inyectado en todos los requests (Axios interceptor)
6. Redireccionar basado en role:
   - KITCHEN → `/(kitchen)`
   - WAITER/CASHIER → `/(waiter)`
   - ADMIN/MANAGER → `/(admin)`

### Persistencia de Sesión

Al abrir la app:

1. App intenta restaurar sesión desde AsyncStorage
2. Si hay token válido, reasignar a pantalla correcta
3. Si no, mostrar login

## 🌐 Multiidioma

El app soporta español (default) e inglés.

### Traduciones

Las traducciones están en:

- `src/lib/i18n/es.json` - Español
- `src/lib/i18n/en.json` - Inglés

### Cambiar idioma en tiempo de ejecución

```typescript
import { useTranslation } from "react-i18next";

export const MyComponent = () => {
  const { i18n } = useTranslation();

  const changeLang = () => {
    i18n.changeLanguage("en");
    // También guardar preferencia:
    // await storage.setLanguage('en');
  };
};
```

## 🍳 Cocina (Kitchen)

### Pantalla Principal

- **Lista/Grid Toggle**: Cambiar vista (lista o grid)
- **Secciones por Estado**: PENDING, IN_PROGRESS, READY
- **No muestra precios**: Oculto para cocina

### Detalles de Orden

Muestra:

- Número de orden y tiempo transcurrido
- Tipo (DINE_IN o TO_GO), mesa, cliente
- Artículos con variantes y modificadores seleccionados
- **Notas importantes**
- Botones:
  - PENDING → "Iniciar Orden"
  - IN_PROGRESS → "Marcar como Lista"
  - READY → "Esperando que la recojan"

## 👨‍💼 Mesero (Waiter)

### Pantallas Skeleton

- **Crear Orden**: Seleccionar mesa, tipo, productos, variantes, modificadores
- **Cuentas**: Lista de cuentas abiertas
- **Cerrar Cuenta**: Procesar pago (efectivo/tarjeta, propina)

## 🔧 Admin

### Pantallas Skeleton

- **Dashboard**: Estadísticas del día (ventas, órdenes, promedio de cuenta)
- **Configuración de Impresora**: Bluetooth, tamaño papel, prueba de impresión

## 🔄 Real-time con Socket.IO

### Inicialización

Cuando usuario entra a Kitchen:

1. Conectar socket con `connectSocket(token, tenantId, storeId)`
2. Unirse a room: `joinStoreRoom(tenantId, storeId)`
3. Registrar listeners: `initOrdersSocket(socket, storeId)`
4. Limpiar al salir: `cleanupOrdersSocket(socket)`

### Actualización de Órdenes

Las órdenes se sincronizaban automáticamente:

```typescript
// En socket listener
upsertOrder(payloadOrder); // Nueva o actualizada

// En evento de estado
updateOrderStatus(orderId, "IN_PROGRESS"); // Atomico
```

## 📊 Acceso a Datos

### Órdenes Live (Real-time)

```typescript
import { useOrdersLiveStore } from "@stores/ordersLive.store";

export const MyComponent = () => {
  const { ordersList, getOrder, getPendingOrdersCount } = useOrdersLiveStore();

  // ordersList es Array<LiveOrder>, siempre actualizado
  // getOrder(id) obtiene una orden específica
  // getPendingOrdersCount() cantidad de pendientes
};
```

### Menu (TanStack Query + Caché)

```typescript
import { useMenu } from "@features/menu/hooks";

export const MyComponent = () => {
  const { data: menuData, isLoading, error } = useMenu(storeId);
  // data = { categories, products }
};
```

### Auth

```typescript
import { useAuthStore } from "@stores/auth.store";

export const MyComponent = () => {
  const { user, token, storeId, isKitchenUser, logout } = useAuthStore();
};
```

## 🚨 Manejo de Errores

### Errores de API

El Axios interceptor:

- Detecta 401 (token expirado) y hace logout automático
- Otros errores se pasan a hooks TanStack Query
- Hooks muestran snackbar con mensaje

```typescript
import { useUIStore } from "@stores/ui.store";

const { showSnackbar } = useUIStore();
showSnackbar("Error: No se pudo crear la orden", "error");
```

## 🧪 Testing

No hay tests configurados aún, pero la arquitectura soporta fácil testing:

- Stores Zustand son testeables
- API calls están aisladas
- Componentes no tienen lógica compleja

Próximamente:

- Jest + React Native Testing Library
- Mock de Socket.IO
- Mock de AsyncStorage

## 📝 Próximas Características

- [ ] Crear orden completa (waiter)
- [ ] Gestionar cuentas/cheques
- [ ] Admin dashboard con estadísticas
- [ ] Configuración de impresora térmica
- [ ] Modales para variantes/modificadores
- [ ] Dark mode
- [ ] Offlinedraft de órdenes (para cuando sin conexión)
- [ ] Reportes detallados
- [ ] Integración con sistemas de pago

## 📚 Convenciones de Código

### Nombrado de Archivos

- Componentes React: `PascalCase.tsx`
- Hooks: `useMyHook.ts`
- Stores: `mystore.store.ts`
- Utilidades: `lowercase.ts`
- API: `api.ts`, `hooks.ts`, `types.ts`

### Estructura de Componentes

```typescript
// Imports
import React from "react";
import { View } from "react-native";

// Props Interface
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return <View>{/* ... */}</View>;
};

// Styles (siempre al final)
const styles = StyleSheet.create({
  // ...
});
```

### Types y Interfaces

- Evitar `any`
- Usar `interface` para props y respuestas API
- Usar `type` para uniones y primitivos
- Agrupar tipos en `types.ts`

## 📖 Documentación de Endpoints Esperados

```
POST /auth/pin-login
  Body: { pin: string, storeId?: string }
  Response: { token: string, user: { id, name, role, tenantId, stores } }

GET /auth/me
  Response: { id, name, role, tenantId, stores }

POST /orders
  Body: { type, tableNumber?, items[], notes? }
  Response: { id, number, createdAt }

PATCH /orders/:orderId/status
  Body: { status: 'PENDING' | 'IN_PROGRESS' | 'READY' }

POST /orders/:orderId/start

GET /stores/:storeId/menu
  Response: { categories, products }

GET /stores/:storeId/checks?status=OPEN
  Response: Check[]

POST /checks/:checkId/close
  Body: { tip?, paymentMethod: 'CASH' | 'CARD' }
```

## 🐛 Troubleshooting

### Socket no conecta

- Verificar SOCKET_URL en .env
- Verificar que backend está corriendo
- Revisar logs en console

### Órdenes no se actualizan

- Verificar que socket está conectado
- Revisar que storeId es correcto
- Limpieza de listeners al cambiar pantalla

### Token expirado

- App hace logout automático
- Usuario redirigido a login
- SessionRestore intenta restaurar al abrir

## 💬 Soporte

Para preguntas o issues, contactar al equipo de desarrollo.

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0-MVP
