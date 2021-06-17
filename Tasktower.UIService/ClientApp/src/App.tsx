import React, {FormEvent, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import logo from './logo.svg';
import './App.scss';
import {ajax, AjaxError} from 'rxjs/ajax';
import {catchError, map, take, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";

enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PUT",
  DELETE = "DELETE"
}
enum CookieNames {
  XSRF = "XSRF-TOKEN"
}

enum RequestHeaders {
  XSRF = "X-XSRF-TOKEN"
}

interface ErrorInfo {
  enabled: boolean,
  status?: number,
  message?: string
}

function App() {
  const [xsrfToken, setXsrfToken] = useState("");
  const [errInfo, setErrorInfo] = useState<ErrorInfo>({enabled: false})
  const [testVal, setTestVal] = useState("init");
  const [user, setUser] = useState("");
  
  const errorHandler = (err: AjaxError) => {
    console.error("status:" + err.status)
    console.error( "message\n" + err.message)
    setErrorInfo((err.status >= 500 )?
      {enabled: true, status: err.status, message: "something went wrong"}: 
      {...err, enabled: true});
    return throwError(() => err);
  };
  
  useEffect(() => {
    ajax({
      method: HttpMethods.GET, 
      url: "/client/anti-forgery", 
      withCredentials: true
    })
      .pipe(
        tap(_ => {
          setErrorInfo({...errInfo, enabled: false});
          setXsrfToken(Cookies.get(CookieNames.XSRF) || "");
        }),
        catchError(errorHandler)
      )
      .subscribe();
  }, []);
  
  const onClick = () => {
    const headers: Record<string, string> = {};
    headers[RequestHeaders.XSRF] = xsrfToken;
    
    ajax({
      method: HttpMethods.POST, 
      url: "/client/anti-forgery/test", 
      headers: headers,
      withCredentials: true
    })
      .pipe(
        map(r => JSON.stringify(r.response)),
        tap(v => {
          setErrorInfo({...errInfo, enabled: false});
          setTestVal(v);
          console.log(v);
        }),
        catchError(errorHandler),
      )
      .subscribe();

    ajax({
      method: HttpMethods.GET,
      url: "/client/auth/user",
      headers: headers,
      withCredentials: true
    })
      .pipe(
        map(r => JSON.stringify(r.response)),
        tap(v => {
          setErrorInfo({...errInfo, enabled: false});
          setUser(v);
          console.log(v);
        }),
        catchError(errorHandler),
      )
      .subscribe();
  }
  
  return (
    <div>
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
        { (errInfo.enabled)? (
          <div className={"error-message"}>
            <h3>Status: {errInfo.status}</h3>
            <p>{errInfo.message}</p>
          </div>): 
          (<></>)}
        <br />
        <h4>XSRF</h4>
        {xsrfToken}
        <br/>
        <h4>test val</h4>
        {testVal}
        <br/>
        <h4>user</h4>
        {user}
      </div>
    </div>
  );
}

export default App;
