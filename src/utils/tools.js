import {Base64} from 'js-base64'
import moment from 'moment'

/* 获取当月天数*/
export function getDaysInOneMonth(year, month) {
  month = parseInt(month, 10);
  var days = new Date(year, month, 0);
  return days.getDate();
}


export function encodeBase64String(val) {
  return Base64.encode(val);
}

export function decodeBase64String(val) {
  return Base64.decode(val)
}
export function formatDate(date,formatStr) {
  if(date == null){
    return '';
  }
  let dt = moment(date).format(formatStr);
  if(dt.indexOf("Invalid ") == 0){
    return ''
  }
  return dt;
}
/**
 *
 * 获取当前IP
 * @returns {Promise}
 */
export function getUserIP() {
    //compatibility for firefox and chrome
    return new Promise((resolve,rej)=>{
      let myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      let pc = new myPeerConnection({
          iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;
      function iterateIP(ip) {
        if (!localIPs[ip]) resolve(ip);
        localIPs[ip] = true;
      }
  
      //create a bogus data channel
      pc.createDataChannel("");
  
      // create offer and set local description
      pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
          if (line.indexOf('candidate') < 0) return;
          line.match(ipRegex).forEach(iterateIP);
        });
  
        pc.setLocalDescription(sdp, noop, noop);
      },function(reason) {
        // An error occurred, so handle the failure to connect
      });
  
      //sten for candidate events
      pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    });
  }
