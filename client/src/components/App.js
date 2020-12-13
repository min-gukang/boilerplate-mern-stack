import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
//왜 마지막 path에서 .js를 빼야 작동하지?
import UploadProductPage from "./views/UploadProductPage/UploadProductPage" 


//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          {/* 2. 업로드 페이지 route만들기 */}
          {/* 업로드 페이지는 로그인 한 사람만 들어가야 하기 때문에 두번째 인자로 true를 준다 */}
          {/* path는 마음데로 설정 */}
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} /> 
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
