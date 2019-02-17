let dateDiff = function(historyTime) {
  // console.log('Date now: ' + Date.now());
  // console.log('History time: ' + historyTime);
  var now = Date.now(),
      diffValue = now - historyTime,
      result='',
      minute = 1000 * 60,
      hour = minute * 60,
      day = hour * 24,
      halfamonth = day * 15,
      month = day * 30,
      year = month * 12,
      _year = diffValue / year,
      _month = diffValue / month,
      _week = diffValue / (7 * day),
      _day = diffValue / day,
      _hour = diffValue / hour,
      _min = diffValue / minute;
    if(_year >= 1) result = parseInt(_year) + ' years ago';
    else if(_month >= 1) result = parseInt(_month) + ' months ago';
    else if(_week >= 1) result = parseInt(_week) + ' weeks ago';
    else if(_day >= 1) result = parseInt(_day) + ' days ago';
    else if(_hour >= 1) result = parseInt(_hour) + ' hours ago';
    else if(_min >= 1) result = parseInt(_min) + ' minutes ago';
    else result = 'just now';
    return result;
}
export { dateDiff };
