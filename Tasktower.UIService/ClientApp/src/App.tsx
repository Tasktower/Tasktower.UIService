import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
// import logo from './logo.svg';
import './App.scss';
import {ajax, AjaxError} from 'rxjs/ajax';
import {catchError, map, take, tap} from "rxjs/operators";
import {throwError} from "rxjs";

const baseUrl = process.env.REACT_APP_BASE_URL || "";

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

enum HeaderNames {
  XSRF = "X-XSRF-TOKEN"
}

interface ErrorInfo {
  enabled: boolean,
  status?: number,
  message?: string
}

function App() {
  const [xsrfFormToken, setXsrfFormToken] = useState("");
  const [errInfo, setErrorInfo] = useState<ErrorInfo>({enabled: false})
  const [testVal, setTestVal] = useState("init");
  const [userAccessData, setUserAccessData] = useState("");
  const [userIdentityData, setUserIdentityData] = useState("");
  
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
      url: `${baseUrl}/client/anti-forgery`, 
      withCredentials: true,
      xsrfCookieName: CookieNames.XSRF,
      xsrfHeaderName: HeaderNames.XSRF
    })
      .pipe(
        tap(_ => {
          setErrorInfo({...errInfo, enabled: false});
          setXsrfFormToken(Cookies.get(CookieNames.XSRF) || "");
        }),
        catchError(errorHandler)
      )
      .subscribe();
  }, []);
  
  const onClick = () => {
    
    ajax({
      method: HttpMethods.POST, 
      url: `${baseUrl}/client/anti-forgery/test`, 
      xsrfCookieName: CookieNames.XSRF,
      xsrfHeaderName: HeaderNames.XSRF,
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
      url: `${baseUrl}/client/auth/user/access-data`,
      xsrfCookieName: CookieNames.XSRF,
      xsrfHeaderName: HeaderNames.XSRF,
      withCredentials: true
    })
      .pipe(
        map(r => JSON.stringify(r.response, null, 20)),
        tap(v => {
          setErrorInfo({...errInfo, enabled: false});
          setUserAccessData(v);
          console.log(v);
        }),
        catchError(errorHandler),
      )
      .subscribe();

    ajax({
      method: HttpMethods.GET,
      url: `${baseUrl}/client/auth/user/identity`,
      xsrfCookieName: CookieNames.XSRF,
      xsrfHeaderName: HeaderNames.XSRF,
      withCredentials: true
    })
      .pipe(
        map(r => JSON.stringify(r.response, null, 20)),
        tap(v => {
          setErrorInfo({...errInfo, enabled: false});
          setUserIdentityData(v);
          console.log(v);
        }),
        catchError(errorHandler),
      )
      .subscribe();
  }
  
  console.log(process.env);
  return (
    <div>
      <form action={`${baseUrl}/client/auth/sign-in?returnUrl=${encodeURI(window.origin + "/")}`} method="post">
        <input name="XSRF-TOKEN" type="hidden" value={xsrfFormToken}/>
        <input name="submit" type="submit" value="sign in"/>
      </form>
      <form action={`${baseUrl}/client/auth/sign-out?returnUrl=${encodeURI(window.origin + "/")}`} method="post">
        <input name="XSRF-TOKEN" type="hidden" value={xsrfFormToken}/>
        <input name="submit" type="submit" value="sign out"/>
      </form>
      <button onClick={onClick}>Click</button>
      <div>
        { (errInfo.enabled)? (
          <div className={"error-message"}>
            <h3>Status: {errInfo.status}</h3>
            <p>{errInfo.message}</p>
          </div>): 
          (<></>)
        }
        <br />
        <h4>XSRF</h4>
        {xsrfFormToken}
        <br/>
        <h4>test val</h4>
        {testVal}
        <br/>
        <h4>user access</h4>
        {userAccessData}
        <h4>user identity</h4>
        {userIdentityData}
      </div>
    </div>
  );
}

export default App;
