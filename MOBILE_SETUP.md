# Nexus - Mobile & Desktop Setup Guide

## Responsividade Mobile

O Nexus agora possui responsividade completa mobile-first com suporte a:
- Dispositivos pequenos (320px+)
- Tablets (640px+)
- Desktops (1024px+)

### Características Mobile

✅ **Touch-Friendly**: Todos os botões têm mínimo 44x44px
✅ **Safe Area Support**: Suporte para notches e home indicators
✅ **Responsive Grid**: Layouts adaptativos por tamanho de tela
✅ **Otimizado para Performance**: Estilos mobile-first com CSS otimizado
✅ **Acessibilidade**: Suporte a preferências de movimento reduzido

## Capacitor (iOS/Android)

### Instalação

```bash
cd apps/client

# Adicionar plataformas
npm run cap:add:android
npm run cap:add:ios

# Sincronizar código
npm run cap:sync
```

### Build para Mobile

```bash
# Android
npm run cap:build:android
npm run cap:open:android

# iOS
npm run cap:build:ios
npm run cap:open:ios
```

### Requisitos

**Android:**
- Android Studio 4.0+
- Android SDK 21+
- Java 8+

**iOS:**
- Xcode 12+
- iOS 12+
- CocoaPods

## Tauri (Desktop)

### Instalação

```bash
cd apps/client

# Instalar dependências do Tauri
npm install
```

### Build para Desktop

```bash
# Desenvolvimento
npm run tauri:dev

# Build de produção
npm run tauri:build

# Build de debug
npm run tauri:build:debug
```

### Requisitos

**Windows:**
- Visual Studio 2019+
- Windows 10+

**macOS:**
- Xcode 12+
- macOS 10.13+

**Linux:**
- GCC/Clang
- GTK 3.0+

## Estrutura de Arquivos

```
apps/client/
├── src/
│   ├── config/
│   │   └── responsive.config.ts    # Configuração de breakpoints
│   ├── hooks/
│   │   └── useResponsive.ts        # Hook para responsividade
│   ├── styles/
│   │   └── mobile.css             # Estilos mobile-first
│   └── ui/components/
│       └── MobileOptimized.tsx     # Componentes otimizados
├── src-tauri/
│   ├── tauri.conf.json            # Configuração do Tauri
│   ├── Cargo.toml                 # Dependências Rust
│   ├── build.rs                   # Build script
│   └── src/
│       └── main.rs                # Entrada do Tauri
├── capacitor.config.ts            # Configuração do Capacitor
├── vite.config.ts                 # Configuração do Vite
└── package.json                   # Scripts de build
```

## Desenvolvimento

### Web (Vite)

```bash
npm run dev
```

Acesse em `http://localhost:5173`

### Mobile (Capacitor)

```bash
# Terminal 1: Iniciar servidor web
npm run dev

# Terminal 2: Sincronizar e abrir no emulador/dispositivo
npm run cap:sync
npm run cap:open:android  # ou cap:open:ios
```

### Desktop (Tauri)

```bash
npm run tauri:dev
```

## Otimizações Implementadas

### CSS Mobile-First

- Estilos base para mobile (320px)
- Media queries para tablet (640px+)
- Media queries para desktop (1024px+)
- Suporte a safe areas (notches)
- Otimização de performance

### Componentes Responsivos

- `ResponsiveGrid`: Grid que se adapta ao tamanho da tela
- `ResponsiveContainer`: Container com padding adaptativo
- `TouchButton`: Botões otimizados para touch
- `MobileOptimized`: Wrapper para layouts mobile

### Hooks Customizados

- `useResponsive()`: Detecta tamanho da tela em tempo real
- Retorna: `isMobile`, `isTablet`, `isDesktop`, `width`, `height`

## Testes

### Testar Responsividade

```bash
# Chrome DevTools
1. Abrir DevTools (F12)
2. Clicar em "Toggle device toolbar" (Ctrl+Shift+M)
3. Selecionar diferentes dispositivos
```

### Testar em Dispositivo Real

```bash
# Android
adb reverse tcp:5173 tcp:5173
npm run dev

# iOS
Configurar em capacitor.config.ts
```

## Build de Produção

```bash
# Web
npm run build

# Mobile (Android)
npm run cap:build:android
# Abrir em Android Studio e fazer build

# Mobile (iOS)
npm run cap:build:ios
# Abrir em Xcode e fazer build

# Desktop
npm run tauri:build
```

## Troubleshooting

### Capacitor

**Problema**: "capacitor.config.ts not found"
```bash
npx cap init nexus io.nexus.app
```

**Problema**: Erro ao sincronizar
```bash
npm run build
npm run cap:sync
```

### Tauri

**Problema**: "rust not found"
```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Problema**: Erro ao compilar
```bash
cargo clean
npm run tauri:build
```

## Recursos Adicionais

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Tauri Docs](https://tauri.app/docs/)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Mobile Web Best Practices](https://web.dev/mobile/)

## Próximos Passos

1. ✅ Responsividade mobile implementada
2. ✅ Capacitor configurado
3. ✅ Tauri configurado
4. ⏳ Testar em dispositivos reais
5. ⏳ Otimizar performance
6. ⏳ Implementar PWA (opcional)
7. ⏳ Publicar em App Stores
