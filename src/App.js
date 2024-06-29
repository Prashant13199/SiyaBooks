import './App.css';
import NavbarMain from './Container/NavbarMain/NavbarMain';
import SidebarMain from './Container/SidebarMain/SidebarMain';
import Auth from './Pages/Auth/Auth';
import BookStore from './Pages/BookStore/BookStore';
import Bookmarked from './Pages/Bookmarked/Bookmarked';
import Finished from './Pages/Finished/Finished';
import Home from './Pages/Home/Home';
import Library from './Pages/Library/Library';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoadingScreen from 'react-loading-screen';
import logo from './Assets/logo.png'
import { useState } from 'react';

function App() {

  const user = localStorage.getItem('uid')
  const [loading, setLoading] = useState(true)

  return (
    <LoadingScreen
      loading={loading}
      spinnerColor='#3fb476'
      logoSrc={logo}
    >
      {user ? <BrowserRouter>
        <div className='app'>
          <div className='pc'>
            <SidebarMain setLoading={setLoading} />
          </div>
          <div className='mobile'>
            <NavbarMain setLoading={setLoading} />
          </div>
          <div className='app2'>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/library">
                <Library />
              </Route>
              <Route path="/store">
                <BookStore />
              </Route>
              <Route path="/finished">
                <Finished />
              </Route>
              <Route path="/bookmark">
                <Bookmarked />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
        : <Auth homeLoad={setLoading} />
      }
    </LoadingScreen>
  );
}

export default App;
