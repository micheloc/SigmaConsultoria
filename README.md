# Doc ( SIGMA - Consultoria ).

Caso o projeto esteja com os seguintes arquivos. \

- Yarn.lock
- /Android
- /IOS
- /node_modules

Apague todos esses arquivos, logo em seguida execute os seguintes comandos.

¹ yarn install

² yarn add expo

³ yarn global add expo-cli

- Tente primeiramente executar com : npx expo eject. ("Este comando vai gerar a pasta ANDROID e a pasta IOS")

Caso não dê certo, execute expo eject.

# Comandos para limpar o gradlew

- primeiro você acessa a pasta do android
- execute : gradlew clean ("Limpa o build do gradlew").
- execute : gradlew build ("Gera o build do projeto").

Caso você queira gerar o APK via gradlew, você pode executar :
gradlew assembleRelease

O APK vai estar na pasta ANDROID/src

# Comandos para build no expo.dev

- eas build --profile development --platform android // Versão para desenvolimento.
- eas build --profile preview --platform android // Versão de teste.

Lembrando que no arquivo **app.config.js** você deve adicionar seus dados referente ao expo.dev.

Como : package, eas.projectId
ex:

```bash
  export default {
  expo: {
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff',
      },
      package: 'com.username.nomedoprojeto',
    },
  }
```

```bash
    extra: {
        eas: {
            projectId: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
        },
    }
```

# Modelo do app.config.js

### Crie o arquivo app.config.js na pasta principal do projeto e adicione essa configuração.

```bash
    export default {
        expo: {
            name: 'consultoria',
            slug: 'consultoria',
            version: '1.0.0',
            orientation: 'portrait',
            icon: './src/assets/icon.png',
            scheme: 'myapp',
            userInterfaceStyle: 'automatic',
            splash: {
                image: './src/assets/logo.png',
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
            ios: {
                supportsTablet: true,
            },
            android: {
            adaptiveIcon: {
                backgroundColor: '#ffffff',
            },
                package: 'com.username.nomedoprojeto',
                permissions: ['CAMERA', 'RECORD_AUDIO'],
            },
            web: {
                bundler: 'metro',
                output: 'static',
                favicon: './src/assets/icon-sigma.png',
            },
            plugins: ['expo-router', 'expo-font'],
            experiments: {
                typedRoutes: true,
            },
            extra: {
                eas: {
                    projectId: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                },
            },
        },
    };
```
