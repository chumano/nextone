import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import { Provider } from 'react-redux';
import withLayout from './utils/hoc/withLayout';
import MainLayout from './components/_layouts/MainLayout';
import { GlobalModal } from './components/common/GlobalModals';
import { appStore } from './stores/appStore';
import NoAuthLayout from './components/_layouts/NoAuthLayout';
import { axiosSetup } from './config/axios';

axiosSetup();

const MapEditorPage = React.lazy(() => import('./pages/map-editor-page/MapEditorPage'));
const MapsPage = React.lazy(() => import('./pages/maps-page/MapsPage'));
const DataSourcePage = React.lazy(() => import('./pages/data-source-page/DataSourcePage'));


const LoginPage =  React.lazy(() => import('./pages/login-page/LoginPage'));
const AuthCallback = React.lazy(() => import('./components/auth/AuthCallback'));
const AuthSilentCallback = React.lazy(() => import('./components/auth/AuthSilentCallback'));
const AuthSignoutRedirect = React.lazy(() => import('./components/auth/AuthSignoutRedirect'));
const AuthSignoutCallback= React.lazy(() => import('./components/auth/AuthSignoutCallback'));


const MapsPageWithLayout = withLayout(MainLayout, () => {
  return <MapsPage />
});

const MapEditorPageWithLayout = withLayout(MainLayout, () => {
  return <MapEditorPage />
});

const DataSourcePageWithLayout = withLayout(MainLayout, () => {
  return <DataSourcePage />
});


const envInfo = <ul>
  <li>{process.env.REACT_APP_TITLE}</li>
  <li>{process.env.REACT_APP_HOST}</li>
  <li>{process.env.REACT_APP_VERSION}</li>
  <li>{process.env.REACT_APP_FOO} </li>
</ul>;

function App() {
  console.log("App rendering...");

  return <>
    <Provider store={appStore}>
      <GlobalModal>
        <Router>
          <Routes>
            <Route path="/" element={<MapsPageWithLayout />} />
            <Route path="/data" element={<DataSourcePageWithLayout />} />
            <Route path="/maps" element={<MapsPageWithLayout />} />
            <Route path="/maps/:mapid" element={<MapEditorPageWithLayout />} />

            {/*no auth */}
            <Route path="/login" element={<NoAuthLayout> <LoginPage/> </NoAuthLayout>} />
            <Route path="/auth/callback" element={<NoAuthLayout> <AuthCallback/> </NoAuthLayout>} />
            <Route path="/auth/redirect" element={<NoAuthLayout> <AuthSignoutRedirect/> </NoAuthLayout>} />
            <Route path="/auth/silent-callback" element={<NoAuthLayout> <AuthSilentCallback/> </NoAuthLayout>} />
            <Route path="/auth/signout-callback" element={<NoAuthLayout> <AuthSignoutCallback/> </NoAuthLayout>} />
          </Routes>
        </Router>
      </GlobalModal>
    </Provider>
  </>;
}

export default App;
