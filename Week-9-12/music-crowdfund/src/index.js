import React from 'react';
import ReactDOM from 'react-dom/client';

// css
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'

// Components
import App from './App';

// Config
import { chains, config } from './wagmi.config';
import reportWebVitals from './reportWebVitals';

// Redux
import { Provider } from 'react-redux';

// Store
import { store } from './store/store';

// RainbowKit
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#7b3fe4',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}
        chains={chains}
      >
        <Provider store={store}>
      <App />
    </Provider>
      </RainbowKitProvider>
      </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
