import Vue from 'vue'

Vue.filter('capitalize1', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
Vue.filter('millisecondFormate', function (value) {
  let days    = value / 1000 / 60 / 60 / 24;
  let daysRound   = Math.floor(days);
  let hours    = value/ 1000 / 60 / 60 - (24 * daysRound);
  let hoursRound   = Math.floor(hours);
  let minutes   = value / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
  let minutesRound  = Math.floor(minutes);
  let seconds   = Math.floor(value/ 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound));
  if (daysRound!=0) {
    return daysRound+'天'+hoursRound+'小时'+minutesRound+'分'+seconds+'秒';
  } else {
    if (hoursRound!=0) {
      return hoursRound+'小时'+minutesRound+'分'+seconds+'秒';
    } else {
      if (minutesRound!=0) {
        return minutesRound+'分'+seconds+'秒';
      } else {
        return seconds+'秒';
      };
    };
  };
})