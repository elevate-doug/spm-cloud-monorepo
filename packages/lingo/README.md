# ReactNativeLingo

## Overview
ReactNativeLingo is a React Native component library designed for seamless integration with Storybook, allowing developers to create and test UI components in isolation.

## Packages
The project utilizes a range of packages including but not limited to:
- **React Native** for building native apps.
- **React Navigation** for navigation.
- **React Native Paper** for UI components.
- **Storybook** for UI component development.
- **Jest** for testing.

## Setup

### Prerequisites
- Node.js >= 22
- Yarn 4.1.1

### Installation
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd ReactNativeLingo
    ```

2. Install dependencies:
    ```bash
    yarn install
    ```

3. Install iOS pods:
    ```bash
    yarn pods
    ```

## Running the App

### Android
```bash
yarn android
```

### iOS
```bash
yarn ios
```

## Running Storybook
```bash
yarn start
```

## Testing
Run tests using Jest:
```bash
yarn test
```

## Linting and Formatting
- Lint code:
    ```bash
    yarn lint
    ```
- Format code:
    ```bash
    yarn format
    ```

## Local Deployment with Verdaccio
We use Verdaccio to publish and test the `react-native-lingo` package locally. Follow these steps to set up and use Verdaccio:

1. **Install Verdaccio globally**:
    ```bash
    npm install -g verdaccio
    ```

2. **Start Verdaccio**:
    ```bash
    verdaccio
    ```

3. **Configure Yarn to use Verdaccio**:
    In both `react-native-lingo` and `spm-react-native` projects, update the `.npmrc` file to use the local Verdaccio registry:
    ```
    @steris:registry=http://localhost:4873
    ```

    Notes:
     - When switching between the local and remote registries, make sure to delete the yarn.lock file in the client repo
     - To publish to our actual npm repo, just comment this out and uncomment our own registry.

4. **Publish `react-native-lingo` to Verdaccio**:
    ```bash
    cd /path/to/react-native-lingo
    yarn build:dist
    npm publish
    ```

5. **Install `react-native-lingo` in the client project**:
 - Bump the package number to match and run `yarn install`

 If it is not installed yet, you can install it:
    ```bash
    cd /path/to/spm-react-native
    yarn add @steris/react-native-lingo
    ```

## Handling Static Assets
Static images are copied over to the `dist` directory during the build process. Ensure you have the following script in your `package.json`:
```json
"scripts": {
    "copy:assets": "copyfiles -u 3 src/assets/images/* dist/assets/images",
    "build:dist": "yarn clean:dist && yarn build:ts && yarn copy:assets"
}
```

## Additional Steps for Client App

### Steps to Install and Configure `react-native-vector-icons`:

1. **Install the Package:**

   ```bash
   yarn add react-native-vector-icons
   ```

2. **Android Configuration:**

   - **Add Font Configuration in `android/app/build.gradle`:**

     ```groovy
     project.ext.vectoricons = [
         iconFontNames: [ 'MaterialCommunityIcons.ttf', 'MaterialIcons.ttf' ], // Specify font files
     ]
     apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
     ```

   - **Ensure Gradle Sync:**
     Make sure you sync your gradle files in Android Studio.

3. **iOS Configuration:**

   - **Copy Fonts:**
     Copy the `src/assets/fonts` folder from the module to the same location in the client module.

   - **Modify `Info.plist`:**
     Add the fonts to `Info.plist`:

     ```xml
     <key>UIAppFonts</key>
     <array>
         <string>Inter-Black.ttf</string>
         <string>Inter-Bold.ttf</string>
         <string>Inter-ExtraBold.ttf</string>
         <string>Inter-ExtraLight.ttf</string>
         <string>Inter-Light.ttf</string>
         <string>Inter-Medium.ttf</string>
         <string>Inter-Regular.ttf</string>
         <string>Inter-SemiBold.ttf</string>
         <string>Inter-Thin.ttf</string>
         <string>MaterialCommunityIcons.ttf</string>
         <string>MaterialIcons.ttf</string>
     </array>
     ```

   - **Link Assets:**
     Ensure your `react-native.config.js` file contains:

     ```js
     module.exports = {
       project: {
         ios: {},
         android: {},
       },
       assets: ['./src/assets/fonts'],
     };
     ```

   - **Pod Install:**
     Install pods to ensure the fonts are linked:

     ```bash
     yarn pods
     ```

  1. **Link Assets**: Run the command to link the assets.

   ```bash
   npx react-native-asset
   ```

2. **Run the Project**

4. **Using the Icons:**
   Ensure you are importing and using the icons correctly in your components:

   ```js
   import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
   
   const MyComponent = () => (
     <MaterialCommunityIcons name="home" size={30} color="#000" />
   );
   ```

5. **Build and Run:**

   - **Clean and Rebuild the Project:**

     - For Android:

       ```bash
       cd android
       ./gradlew clean
       cd ..
       npx react-native run-android
       ```

     - For iOS:

       ```bash
       cd ios
       pod install
       cd ..
       npx react-native run-ios
       ```



- **Install Inter Font**:
    ```bash

    ```

### Wrap the Client App in Paper Provider
Ensure the client app is wrapped in the Paper provider to use the theme and icons correctly. Update your `index.js` file in the client app as follows:

```javascript
import React from 'react';
import { AppRegistry, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { name as appName } from './app.json';
import App from './src/App';
import { LingoTheme } from '@steris/react-native-lingo/theme';

const SuspendedApp = () => (
  <React.Suspense fallback={<Text>Loading...</Text>}>
    <PaperProvider
      theme={{ ...LingoTheme, version: 2 }}
      settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <App />
      </SafeAreaView>
    </PaperProvider>
  </React.Suspense>
);

AppRegistry.registerComponent(appName, () => SuspendedApp);
```

Install the same version as in React-Native-Lingo package file:
```bash
yarn add react-native-paper@^5.12.1   
```

## Directory Structure
The components are organized as follows:
```
src/
├── components/
│   ├── combined-controls/
│   ├── data-display/
│   ├── feedback/
│   ├── inputs/
│   ├── layout/
│   ├── navigation/
│   └── surfaces/
```

### Importing Components
You can import and use the components in your projects as follows:

```javascript
// Importing a Button from the inputs subfolder
import { Button } from '@steris/react-native-lingo/components/inputs';
import { Text } from '@steris/react-native-lingo/components/data-display';

// Importing Colors from the theme folder
import { Colors } from '@steris/react-native-lingo/theme';

// Importing the Login screen
import { LoginScreen } from '@steris/react-native-lingo/screens';
```

### Fully Implemented Components
- Button
- Checkbox
- DatePicker
- FloatingActionButton (FAB)
- IconButton
- RadioGroup
- Select
- Slider
- Palette
- TextField
- Typography