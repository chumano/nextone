import React, { createContext, Suspense, useContext } from 'react';

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
import { authRoutes, routes } from './Route';
import withLayout from './utils/hoc/withLayout';
import Loadable from 'react-loadable';
import Loading from './components/controls/loading/Loading';
import { axiosSetup } from './utils';
import { AppContext, AppContextProvider } from './utils/contexts/AppContext';
import { Provider } from 'react-redux';
import { store } from './store';
import { UserContext, userStore } from './store/users/userStore';


//=================================
//=================================
//setup default axios
axiosSetup();

//=================================
//=================================
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
      <Provider store={store}>
      {/* this userStore for users page : need to remove*/}
      <Provider context={UserContext} store={userStore}>
        <AppContextProvider>
          <div className="App">
            <Switch>
              {/* Auth */}
              {authRoutes.map((route, index) => {
                return (
                  <Route key={index} path={route.path} 
                    component={withLayout((props) => {
                      const Layout = NoAuthLayout
                      return (
                        <Suspense fallback={loading()}>
                          <Layout {...props} title={route.title || ""}>
                            <route.component {...props} />
                          </Layout>
                        </Suspense>
                      )
                    })}
                  />
                )
              })}

              {/* Pages */}
              {routes.map((route, index) => {
                return (
                  <Route key={index} path={route.path} exact={route.exact}
                    component={withLayout((props) => {
                      const Layout = route.useAuthLayout ? AuthLayout : NoAuthLayout
                      return (
                        <Suspense fallback={loading()}>
                          <Layout {...props} title={route.title || ""}>
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
        </AppContextProvider>
      </Provider>
      </Provider>
    </Router>

  </>;
}

export default App;
