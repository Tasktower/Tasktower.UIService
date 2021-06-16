import React, {FormEvent, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import logo from './logo.svg';
import './App.scss';

function App() {
  // const [cookies] = useCookies(["XSRF-TOKEN"]);
  const [xsrfToken, setXsrfToken] = useState("");
  const [testVal, setTestVal] = useState("init");
  const [user, setUser] = useState("");
  
  useEffect(() => {
    fetch("/client/anti-forgery", {credentials: "include"})
      .then(() => {
        setXsrfToken(Cookies.get("XSRF-TOKEN") || "");
      })
      .catch(e => {
        console.log(e.toString());
      });
  }, []);
  
  const onClick = () => {
    fetch("/client/anti-forgery/test", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": xsrfToken
      }})
      .then(r => r.json())
      .then(r => {
        setTestVal(JSON.stringify(r));
        console.log(r)
      })
      .catch(e => {
        setTestVal(e.toString());
        console.log(e);
      });

    fetch("/client/auth/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": xsrfToken
      }})
      .then(r => r.json())
      .then(r => {
        setUser(JSON.stringify(r));
        console.log(r)
      })
      .catch(e => {
        console.log(e);
      });
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
      <form action={`https://localhost:9090/client/auth/login?returnUrl=${encodeURI(window.origin + "/")}`} method="post">
        <input name="XSRF-TOKEN" type="hidden" value={xsrfToken}/>
        <input name="submit" type="submit" value="login"/>
      </form>
      <form action={`https://localhost:9090/client/auth/logout?returnUrl=${encodeURI(window.origin + "/")}`} method="post">
        <input name="XSRF-TOKEN" type="hidden" value={xsrfToken}/>
        <input name="submit" type="submit" value="logout"/>
      </form>
      <button onClick={onClick}>Click</button>
      <div>
        {xsrfToken}
        <br/>
        {testVal}
        <br/>
        {user}
      </div>
    </div>
  );
}

export default App;
