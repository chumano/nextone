import React, { createContext, Suspense, useContext, useEffect, useState } from 'react';

import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import NotFound404 from './pages/not-found/NotFount404';
import { authRoutes, routes } from './Route';
import withLayout from './utils/hoc/withLayout';
import Loadable from 'react-loadable';
import Loading from './components/controls/loading/Loading';
import { axiosSetup } from './utils';
import { AppContextProvider } from './utils/contexts/AppContext';
import { Provider } from 'react-redux';
import { store } from './store';
import TermsPage from './pages/terms/TermsPage';
import { AuthenticationService } from './services';

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

const CheckAuth = (props:any)=>{
  const [isloading, setLoading] =useState(true);
  const [isAuthenticated, setIsAuthenticated] =useState(false);
  useEffect(()=>{
    (async()=>{
      try{
        var isAuthenticated = await AuthenticationService.isAuthenticated();
        setIsAuthenticated(isAuthenticated)
      }finally{
        setLoading(false)
      }
      
    })();
  },[])
  
  return (
    <Suspense fallback={loading()}>
        {isloading && loading()}
        {!isloading && <>
          {!isAuthenticated && <Redirect {...props} to="/intro" />}
          {isAuthenticated && <Redirect {...props} to="/chat" />}
        </>}
    </Suspense>
  )
}
const App = () => {
  return <>
    <Router>
      <Provider store={store}>
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
              <Route path={'/auth/signout-callback'} exact={true}
                component={withLayout((props) => {
                  const Layout = NoAuthLayout
                  return (
                    <Suspense fallback={loading()}>
                      <Layout {...props} title={""}>
                        <Redirect {...props} to="/intro" />
                      </Layout>
                    </Suspense>
                  )
                })}
              >
              </Route>


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
                component={CheckAuth}
              >
              </Route>

              <Route path={'/dieukhoan'} exact={true}
                component={withLayout((props) => {
                  const Layout = NoAuthLayout
                  return (
                    <Suspense fallback={loading()}>
                      <TermsPage/>
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
    </Router>

  </>;
}

export default App;
