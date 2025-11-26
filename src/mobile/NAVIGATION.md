# Navegação do App - Pizzaria

## 📱 Estrutura de Navegação

### Telas Criadas:

1. **Login** - Tela de autenticação
2. **CadastroUsuario** - Tela de registro
3. **Items** (Cardápio) - Lista de pizzas/produtos
4. **Orders** (Pedidos) - Histórico de pedidos
5. **Cart** (Carrinho) - Carrinho de compras
6. **Profile** (Perfil) - Perfil do usuário

### Navegação:

```
Login (Inicial)
  └─> CadastroUsuario
  └─> Main (Tabs)
      ├─> Items (Cardápio) 🍕
      ├─> Orders (Pedidos) 📋
      ├─> Cart (Carrinho) 🛒
      └─> Profile (Perfil) 👤
```

## 🚀 Instalação das Dependências

Execute os seguintes comandos no diretório `Mobile`:

```bash
# Navegação
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs

# Dependências do React Navigation
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# Ícones
npm install react-native-vector-icons

# React Native Paper (já deve estar instalado)
npm install react-native-paper
```

## 📦 Configuração Adicional

### Android (android/app/build.gradle):
```gradle
dependencies {
    implementation project(':react-native-vector-icons')
}
```

### Configurar Ícones (android/app/build.gradle):
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### iOS:
```bash
cd ios
pod install
cd ..
```

## 🎯 Como Usar

1. Copie o conteúdo de `App.example.js` para seu `App.js` principal
2. Instale todas as dependências listadas acima
3. Execute o app:

```bash
# Android
npm run android

# iOS
npm run ios
```

## 🎨 TabBar Customizado

O TabBar customizado está em `src/components/TabBarCustom.js` e inclui:
- 4 abas com ícones Material Icons
- Cor ativa: `#EB3738` (vermelho da marca)
- Cor inativa: `#666666` (cinza)
- Animações suaves

## 📂 Estrutura de Arquivos

```
src/
├── components/
│   ├── Button.js
│   ├── Input.js
│   └── TabBarCustom.js
├── screens/
│   ├── Login.js
│   ├── CadastroUsuario.js
│   ├── Items.js
│   ├── Cart.js
│   ├── Orders.js
│   └── Profile.js
└── navigation/
    └── AppNavigator.js
```

## ⚠️ Notas Importantes

1. As telas estão vazias por enquanto, prontas para implementação
2. A navegação está completamente funcional
3. O TabBar aparece apenas nas telas principais (após login)
4. Login e Cadastro não possuem TabBar
5. Ajuste a URL da API em cada tela conforme necessário

## 🔄 Fluxo de Navegação

1. **Login** → Usuário faz login → Navega para **Main** (Tabs)
2. **CadastroUsuario** → Após cadastro → Volta para **Login**
3. **Main (Tabs)** → Usuário pode alternar entre as 4 telas usando o TabBar
