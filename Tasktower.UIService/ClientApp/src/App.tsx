import React, {FormEvent, useEffect} from 'react';
import {useCookies} from "react-cookie";

import logo from './logo.svg';
import './App.scss';

function App() {
  const [cookies] = useCookies(["XSRF-TOKEN"]);
  
  useEffect(() => {
    fetch("/client/anti-forgery", {credentials: "include", method: "get"})
      .catch(console.log);
  })
  
  const onClick = () => {
    fetch("/services/project/api/test/auth", {
      method: "post",
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
      }
    })
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
