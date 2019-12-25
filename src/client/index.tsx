
import React from "react";
import "../shared/webpack-global-fix";
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from '../shared/theme/DefaultTheme';
import {
  createMemorySource,
  createHistory,
  LocationProvider
} from "@reach/router";
import BoostrapReactRoot from ":shared/BootstrapReactRoot";

import App from "./App";

const source = createMemorySource("/");
const history = createHistory(source);

function Bootstrap() {
  return <LocationProvider history={history}>
    <WithStylesContext.Provider
      value={{
        stylesInterface: AphroditeInterface,
        stylesTheme: DefaultTheme
      }}>
      <App />
    </WithStylesContext.Provider>
  </LocationProvider>
}

BoostrapReactRoot(Bootstrap);