import React, {useEffect, useMemo} from "react";
import styles from "./App.module.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {SnackbarProvider} from 'notistack';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import {grey} from '@mui/material/colors';
import {darkScrollbar} from "@mui/material";
import {
  HomePage,
  SearchPage,
  ArticlePage,
  AboutPage,
  UserArticlePage,
  ProfilePage,
  SettingsPage,
  ActivationPage,
  NotFoundPage
} from "./pages";
import Api from "./utils/api"
import {useDispatch} from "react-redux";
import {useSelector} from "./redux/hooks";
import {authSlice} from "./redux/auth/slice";


function App() {
  const dispatch = useDispatch()
  const auth = useSelector(s => s.auth)

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: 'dark',
        // 重写了 mui 的 primary, secondary 颜色
        primary: {
          main: grey[500]
        },
        secondary: {
          main: grey[50]
        }
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              ...darkScrollbar(),
              background: "black",
              fontFamily: "flexo, sans-serif",
              color: "#eee",
              backgroundImage: "unset"
            }
          },
        },
      },
    }), []);

  useEffect(() => {
    Api.http.interceptors.response.use(response => {
      return response
    }, error => {
      if (error.response && error.response.status === 401) {
        if (auth.accessToken) {
          dispatch(authSlice.actions.clearToken())
        }
      }
      return error.response
    });
  }, [auth, dispatch])

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
          <CssBaseline/>
          <BrowserRouter>
            <Switch>
              <Route exact={true} path={'/'} component={HomePage}/>
              <Route exact={true} path={'/search/:keywords?'} component={SearchPage}/>
              <Route exact={true} path={'/article/:aid?'} component={ArticlePage}/>
              <Route exact={true} path={'/video/:vid?'} component={NotFoundPage}/>
              <Route exact={true} path={'/about'} component={AboutPage}/>
              <Route exact={true} path={'/user/:username/article/:aid?'} component={UserArticlePage}/>
              <Route exact={true} path={'/user/:username'} component={ProfilePage}/>
              <Route exact={true} path={'/user/:username/settings'} component={SettingsPage}/>
              <Route exact={true} path={'/user/activation/:key'} component={ActivationPage}/>
              <Route component={NotFoundPage}/>
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
