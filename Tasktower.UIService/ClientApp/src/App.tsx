import React, {useEffect} from 'react';
import {useCookies} from "react-cookie";

import logo from './logo.svg';
import './App.scss';

function App() {
  const [cookies] = useCookies(['XSRF-TOKEN']);
  
  const login = async () => {
    try {
      let r = await fetch("/client/auth/login?returnUrl=" + encodeURI(window.origin + "/"), {
        method: "get",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
        },
        redirect: "manual"
      });
      console.log(r)
    } catch (e) {
      console.log(e);
    }
  }

  const logout = async () => {
    try {
      let r = await fetch("/client/auth/logout?returnUrl=" + encodeURI(window.origin + "/"), {
        method: "get",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
        },
        redirect: "manual"
      });
      console.log(r)
    } catch (e) {
      console.log(e);
    }
  }
  
  fetch("https://localhost:9090/services/project/api/test/auth", {credentials: "include"})
    .then(r => r.json())
    .then(r => console.log(r))
    .catch(e => console.log(e))
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <form action={"/client/auth/login"} method="get">
        <input name="returnUrl" type="hidden" value={encodeURI(window.origin + "/")}/>
        <input name="submit" type="submit" value="login"/>
      </form>
      <form action={"/client/auth/logout"} method="get">
        <input name="returnUrl" type="hidden" value={encodeURI(window.origin + "/")}/>
        <input name="submit" type="submit" value="logout"/>
      </form>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
