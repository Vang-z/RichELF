import React, {useEffect, useMemo} from "react";
import styles from "./App.module.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {SnackbarProvider} from 'notistack';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import {
  HomePage,
  SearchPage,
  ArticlePage,
  DatasetPage,
  AboutPage,
  UserArticlePage,
  UserDatasetPage,
  ProfilePage,
  SettingsPage,
  NotFoundPage
} from "./pages";
import Api from "./utils/api"
import store from "./redux/store";
import {authSlice} from "./redux/auth/slice";


function App() {
  const theme = useMemo(() =>
    createTheme({
      palette: {
        type: 'dark',
      },
    }), []);

  useEffect(() => {
    Api.http.interceptors.request.use(config => {
      const token = store.getState().auth.token
      if (token) {
        config.headers.common.Authorization = 'Bear ' + token
      }
      return config
    });
    Api.http.interceptors.response.use(response => {
      return response
    }, error => {
      console.log('error.response=>', error.response);
      if (error.response && error.response.status === 403) {
        if (store.getState().auth.token) {
          store.dispatch(authSlice.actions.clearToken())
        }
        return Promise.reject(error)
      }
    });
  }, [])

  return (
    <div className={styles.App}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          autoHideDuration={3000}
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          maxSnack={3}
          classes={{
            root: styles.SnackbarRoot,
          }}>
          <BrowserRouter>
            <Switch>
              <Route exact={true} path={'/'} component={HomePage}/>
              <Route exact={true} path={'/search/:keywords?'} component={SearchPage}/>
              <Route exact={true} path={'/article/:aid?'} component={ArticlePage}/>
              <Route exact={true} path={'/video/:vid?'} component={NotFoundPage}/>
              <Route exact={true} path={'/dataset/:did?'} component={DatasetPage}/>
              <Route exact={true} path={'/about'} component={AboutPage}/>
              <Route exact={true} path={'/user/:username/article/:aid?'} component={UserArticlePage}/>
              <Route exact={true} path={'/user/:username/dataset/:did?'} component={UserDatasetPage}/>
              <Route exact={true} path={'/user/:username'} component={ProfilePage}/>
              <Route exact={true} path={'/user/:username/settings'} component={SettingsPage}/>
              <Route component={NotFoundPage}/>
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
