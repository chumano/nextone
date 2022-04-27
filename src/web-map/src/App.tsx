import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import withLayout from './utils/hoc/withLayout';
import MainLayout from './components/_layouts/MainLayout';
import { GlobalModal } from './components/common/GlobalModals';

const MapEditorPage = React.lazy(() => import('./pages/map-editor-page/MapEditorPage'));
const MapsPage = React.lazy(() => import('./pages/maps-page/MapsPage'));
const DataSourcePage = React.lazy(() => import('./pages/data-source-page/DataSourcePage'));

const HomePageWithLayout = withLayout(MainLayout, () => {
  return <HomePage />
});

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
    <GlobalModal>
      <Router>
        <Routes>
          <Route path="/" element={<MapsPageWithLayout />} />
          <Route path="/data" element={<DataSourcePageWithLayout />} />
          <Route path="/maps" element={<MapsPageWithLayout />} />
          <Route path="/maps/:mapid" element={<MapEditorPageWithLayout />} />
        </Routes>
      </Router>
    </GlobalModal>
  </>;
}

export default App;
