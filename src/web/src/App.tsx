import React, { Suspense } from 'react';

import './App.scss';
import './styles/components/layout/auth-layout.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Home from './pages/home/Home';
import Channel from './pages/channel/Channel';
import NotFound404 from './pages/not-found/NotFount404';
import { routes } from './Route';
import withLayout from './utils/hoc/withLayout';
import Loadable from 'react-loadable';
import Loading from './components/controls/loading/Loading';


const loading = () => <Loading />

const AuthLayout = Loadable({
  loader: () => import('./components/layout/AuthLayout'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />
  },
  loading
});

const NoAuthLayout = Loadable({
  loader: () => import('./components/layout/NoAuthLayout'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />
  },
  loading
});



const App = () => {
  return <>
    <Router>
      <div className="App">
        <Switch>
          {routes.map((route, index) => {
            return (
              <Route key={index} path={route.path} exact={route.exact}
                component={withLayout((props) => {
                  const Layout = route.useAuthLayout ? AuthLayout : NoAuthLayout
                  return (
                    <Suspense fallback={loading()}>
                      <Layout {...props} title={route.title|| ""}>
                        <route.component {...props} />
                      </Layout>
                    </Suspense>
                  )
                })}
                />
            )
          })}


          <Route path={'/'} exact={true}
            component={withLayout((props) => {
              const Layout = NoAuthLayout
              return (
                <Suspense fallback={loading()}>
                  <Layout {...props} title={""}>
                    <Redirect {...props} to="/home" />
                  </Layout>
                </Suspense>
              )
            })}
          >
            
          </Route>


          <Route path={'*'} exact={false}>
            <NotFound404 />
          </Route>
        </Switch>
      </div>
    </Router>

  </>;
}

export default App;
