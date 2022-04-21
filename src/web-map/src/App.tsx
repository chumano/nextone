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


const MapEditorLayout = React.lazy(() => import('./components/_layouts/MapEditorLayout'));
const MapEditorPage  = React.lazy(() => import('./pages/map-editor-page/MapEditorPage'));
const MapsPage  = React.lazy(() => import('./pages/MapsPage'));

const HomePageWithLayout = withLayout(MainLayout, ()=>{
  return <HomePage />
});

const MapsPageWithLayout = withLayout(MainLayout, ()=>{
  return <MapsPage />
});

const MapEditorPageWithLayout = withLayout(MainLayout, ()=>{
  return <MapEditorPage />
});


const envInfo = <ul>
<li>{process.env.REACT_APP_TITLE}</li>
<li>{process.env.REACT_APP_HOST}</li>
<li>{process.env.REACT_APP_VERSION}</li> 
<li>{process.env.REACT_APP_FOO} </li>
</ul>;

function App() {
  console.log("App rendering...");
  const params = useParams();
  console.log("params", params);

  return <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePageWithLayout />}/>
        <Route path="/maps" element={<MapsPageWithLayout />}/>
        <Route path="/maps/:mapid" element={<MapEditorPageWithLayout />} />
      </Routes>
    </Router>
  </>;
}

export default App;
