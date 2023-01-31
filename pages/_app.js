import { Provider } from "react-redux";
import Head from "next/head";
import { configureStore } from "../store";
// import { PersistGate } from "redux-persist/integration/react";
import "../styles/main.global.scss";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  const store = configureStore();

  return (
    <>
      <Head>
        <script src="https://maps.googleapis.com/maps/api/js?v=quarterly&key=AIzaSyCx-skGzBQpfifpGsclSgQ0rlDng25ZdCg&libraries=geometry,drawing,places"></script>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"
        />
      </Head>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <Component {...pageProps} />
        {/* </PersistGate> */}
      </Provider>
    </>
  );
}
