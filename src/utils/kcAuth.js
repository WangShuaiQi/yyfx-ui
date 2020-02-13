import axios from 'axios'
export default {
  login: {
    authed: false,
    info: null
  },
  getKeyCloak(url) {
    return Keycloak(url)
  },
  reqtoken(kc) {
    let _th = this;
    return new Promise((res, rej) => {
      kc.init({ onLoad: 'login-required' }).success(function (authenticated) {
        window.sessionStorage.setItem('authenticated', authenticated);
        window.sessionStorage.setItem('token', kc.token);
        _th.login.authed = authenticated;
        res(authenticated)
      }).error(function (err) {
        alert(err);
        rej(false)
      });
    })
  },
  reqloadUserProfile(kc, reqtoken) {
    let _th = this;
    return new Promise((res, rej) => {
      if (reqtoken) {
        kc.loadUserProfile().success(function (userPro) {
          window.sessionStorage.setItem('user', JSON.stringify(userPro));
          _th.login.info = userPro
          res(JSON.stringify(userPro))
        }).error(function (err) {
          alert(err);
          rej(err)
        });
      } else {
        kc.logout()
      }
    })
  },
  getUpmsUserInfo(kc, reqtoken) {
    return new Promise((r, j) => {
      if (reqtoken) {
        axios.get('/upms/auth/token/user', {
          params: {
            date: new Date().getTime()
          },
          headers: {
            token: "Bearer " + kc.token
          }
        }).then(resp => {
          try{
            let userPro = resp.data.data.upmsUserAttribute;
            window.sessionStorage.setItem('user', JSON.stringify(userPro));
            r(userPro);
          }catch (e) {
            alert(e);
            r({});
          }
        })
      } else {
        kc.logout()
      }
    })
  },
}
