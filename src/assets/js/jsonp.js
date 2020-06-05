// 自己写的 jsonp 文件
export default function jsonp(options) {
  var script = document.createElement('script')
  var params = ''
  for (var attr in options.params) {
    params += '&' + attr + '=' + options.params[attr]
  }
  // 随机生成函数名称
  var fnName =
    'Jsonp' +
    Math.random()
      .toString()
      .replace('.', '')
  window[fnName] = options.success
  script.src = options.url + '?callback=' + fnName + params

  document.body.appendChild(script)
  script.onload = function() {
    document.body.removeChild(script)
  }
}
