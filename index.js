/**
 * @format
 */

import { AppRegistry, View } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { persistor, store } from "./src/redux";
import { Provider } from "react-redux";
import { Image } from "react-native-svg";
import { styleConstants } from "./src/styles/constants";

const RNRedux = () => (
  <Provider store={store}>
    <PersistGate
      loading={
        <View style={{ display: "flex", height: "100%" }}>
          <Image
            source={require("./src/assets/loginLogo.png")}
            style={{
              flex: 1,
              width: 80,
              height: 80,
              borderRadius: 40,
            }}
          />
          <ActivityIndicator
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "70%",
            }}
            size={"large"}
            color={styleConstants.color.primaryColor}
          />
        </View>
      }
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
