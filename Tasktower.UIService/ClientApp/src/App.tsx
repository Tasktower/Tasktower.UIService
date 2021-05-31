import React, {FormEvent, useEffect} from 'react';
import {useCookies} from "react-cookie";

import logo from './logo.svg';
import './App.scss';

function App() {
  const [cookies] = useCookies(["XSRF-TOKEN"]);
  
  const onClick = () => {
    fetch("/client/auth/tokens", {credentials: "include", method: "get"})
      .then(r => r.json())
      .then(r => 
        fetch("/services/project/api/test/auth", {
          method: "get", 
          credentials: "include", 
          headers: {
            "X-XSRF-TOKEN": cookies["XSRF-TOKEN"],
            "Authorization": `Bearer ${r["AccessToken"]}`
          }
        }))
      .then(r => r.json())
      .then(r => console.log(r))
      .catch(e => console.log(e))
  }
  
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
      <button onClick={onClick}>Click</button>
    </div>
  );
}

export default App;
