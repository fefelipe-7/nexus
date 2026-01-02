# Guia de Configuração do Tauri para Nexus

## Problema Identificado

A compilação inicial do Tauri pode levar tempo e encontrar problemas de lock de arquivos em Windows. Vamos usar uma abordagem alternativa.

## Solução Recomendada: Usar Tauri CLI Globalmente

### 1. Instalar Tauri CLI Globalmente

```bash
npm install -g @tauri-apps/cli@latest
```

### 2. Inicializar Tauri no Projeto

```bash
cd apps/client
tauri init
```

Quando solicitado, use estas configurações:
- **Project name**: nexus
- **Package name**: io.nexus.app
- **Window title**: Nexus - Sistema Operacional da Vida
- **Dev URL**: http://localhost:5173
- **Frontend dist dir**: ../dist

### 3. Estrutura Criada

O comando `tauri init` criará automaticamente:
```
src-tauri/
├── tauri.conf.json
├── Cargo.toml
├── src/
│   └── main.rs
└── build.rs
```

### 4. Executar em Desenvolvimento

**Terminal 1: Iniciar servidor web**
```bash
npm run dev
```

**Terminal 2: Executar Tauri**
```bash
tauri dev
```

## Alternativa: Build para Produção

```bash
npm run build
tauri build
```

## Requisitos do Sistema

### Windows
- Visual Studio 2019+ ou Build Tools
- Windows 10+
- Rust 1.70+

### macOS
- Xcode 12+
- macOS 10.13+
- Rust 1.70+

### Linux
- GCC/Clang
- GTK 3.0+
- Rust 1.70+

## Troubleshooting

### Erro: "could not compile `tauri-macros`"

**Solução 1: Limpar cache do Cargo**
```bash
cd src-tauri
cargo clean
cd ..
tauri dev
```

**Solução 2: Usar versão estável do Rust**
```bash
rustup default stable
rustup update
```

**Solução 3: Reinstalar Tauri CLI**
```bash
npm uninstall -g @tauri-apps/cli
npm install -g @tauri-apps/cli@latest
```

### Erro: "arquivo já está sendo usado por outro processo"

**Solução:**
```bash
# Fechar todos os processos Node e Cargo
taskkill /F /IM node.exe
taskkill /F /IM cargo.exe

# Limpar cache
cd src-tauri
cargo clean

# Tentar novamente
tauri dev
```

### Erro: "devUrl not found"

**Solução:** Atualizar `tauri.conf.json`:
```json
{
  "build": {
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  }
}
```

## Desenvolvimento

### Estrutura do Projeto

```
apps/client/
├── src/                    # Código React/TypeScript
├── src-tauri/              # Código Rust do Tauri
│   ├── src/main.rs         # Entrada do Tauri
│   ├── tauri.conf.json     # Configuração
│   └── Cargo.toml          # Dependências Rust
├── dist/                   # Build de produção
└── vite.config.ts          # Configuração Vite
```

### Fluxo de Desenvolvimento

1. **Desenvolvimento Web**
   ```bash
   npm run dev
   # Acessa http://localhost:5173
   ```

2. **Desenvolvimento Desktop com Tauri**
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2
   tauri dev
   ```

3. **Build para Produção**
   ```bash
   npm run build
   tauri build
   ```

## Recursos Adicionais

- [Tauri Documentation](https://tauri.app/docs/)
- [Tauri API](https://tauri.app/docs/api/js/)
- [Rust Book](https://doc.rust-lang.org/book/)

## Próximos Passos

1. ✅ Responsividade mobile implementada
2. ✅ Capacitor configurado
3. ⏳ Tauri configurado (em progresso)
4. ⏳ Testar em múltiplos dispositivos
5. ⏳ Otimizar performance
6. ⏳ Publicar em App Stores

## Scripts Disponíveis

```bash
# Web
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm run preview          # Preview do build

# Tauri (executar globalmente)
tauri dev                # Desenvolvimento
tauri build              # Build de produção
tauri build --debug      # Build de debug

# Capacitor
npm run cap:sync         # Sincronizar código
npm run cap:build:android # Build para Android
npm run cap:build:ios    # Build para iOS
```

## Notas Importantes

- O Tauri requer Rust instalado. Se não tiver, instale em: https://rustup.rs/
- A primeira compilação pode levar 10-15 minutos
- Certifique-se de que o servidor Vite está rodando antes de executar `tauri dev`
- Em Windows, pode ser necessário executar como administrador

## Suporte

Se encontrar problemas:

1. Verifique se Rust está instalado: `rustc --version`
2. Atualize Rust: `rustup update`
3. Limpe o cache: `cargo clean`
4. Reinstale dependências: `npm install`
5. Tente novamente: `tauri dev`
