var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号。\n例如：node server.js 8080')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 路由代码开始 ********/

  console.log('含查询字符串的路径\n' + pathWithQuery)

  if (path === '/' || path === '/index.html') {
    // 1.请求 /index.html。返回 index.html 文件的字符串。
    var string = fs.readFileSync('./index.html', 'utf8')
    var amount = fs.readFileSync('./money.db', 'utf8')
    string = string.replace('&&&amount&&&', amount)

    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.statusCode = 200
    response.end()
  } else if (path === '/style.css') {
    var cssStr = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write(cssStr)
    response.statusCode = 200
    response.end()
  } else if (path === '/jquery-3.4.1.min.js') {
    var jQueryStr = fs.readFileSync('./jquery-3.4.1.min.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(jQueryStr)
    response.statusCode = 200
    response.end()
  } else if (path === '/formpay' && method.toUpperCase() === 'POST') {
    // 2.请求 /formpay 且类型是 POST。操作数据库，并返回 'success' 字符串。 
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.write('formpay success')
    response.statusCode = 200
    response.end()
  } else if (path === '/imgpay') {
    // 3.请求 /imgpay。操作数据库，并返回图片。 
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.setHeader('Content-Type', 'images/jpg')
    response.write(fs.readFileSync('./success.jpg'))
    response.statusCode = 200
    response.end()
  } else if (path === '/scriptpay') {
    // 4.请求 /scriptpay。操作数据库，并返回 script 语法的字符串。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.setHeader('Content-Type', 'application/javascript')
    response.write(`
    amount.innerText = amount.innerText - 1
  `)
    response.statusCode = 200
    response.end()
  } else if (path === '/JSONPpay') {
    // 5.请求 /JSONPpay。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    // 5.2 把查询参数 callback=functionName 解析，等到 functionName 这个函数。
    let callback = query.callback
    // 5.3 把函数调用的字符串返回给浏览器。浏览器得到字符串就执行了这个符合 JS 语法的命令。
    // {"success":true,"left":${newAmount}} 这个是 JSON。
    // ${callback}.call(undefined, + JSON + ) 就是 JSONP，JSON + Padding。
    response.setHeader('Content-Type', 'application/json')
    response.write(`
      ${callback}.call(undefined, {
        "success":true,
        "left":${newAmount}
      })
    `)

    response.statusCode = 200
    response.end()
  } else if (path === '/jQueryJSONPpay') {
    // 6.请求 /jQueryJSONPpay。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    let callback = query.callback
    response.setHeader('Content-Type', 'application/json')
    response.write(`
    ${callback}.call(undefined, {
      "success":true,
      "left":${newAmount}
    })
  `)

    response.statusCode = 200
    response.end()
  } else if (path === '/apay') {
    // 7.请求 /apay。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.write('apay success')
    response.statusCode = 200
    response.end()
  } else if (path === '/linkpay') {
    // 8.请求 /linkpay。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.write('apay success')
    response.statusCode = 200
    response.end()
  } else if (path === '/XMLpay') {
    // 9.请求 /XMLpay。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.statusCode = 200
    response.setHeader('Content-Type', 'text/xml;charset=utf-8')
    // XML语法的字符串
    response.write(`
      <note>
        <to>sakura</to>
        <form>jaylan</form>
        <heading>welcome</heading>
        <body>bengbengbeng</body>
      </note>
    `)
    response.end()
  } else if (path === '/JSONpay') {
    // 10.请求 /JSONpay。
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    // CORS 跨源共享给http://frank.com:8001
    response.setHeader('Access-Control-Allow-Origin', 'http://kkk.com:8001')
    // JSON语法的字符串
    response.write(`{
      "note":{
        "to":"八重樱",
        "from":"飞鱼丸",
        "heading":"嘤嘤嘤",
        "body":"大姐你回来啦"
      }
    }`)
    response.end()
  } else if (path === '/myQAJAXpay') {
    // 11.请求 /myQAJAXpay
    var amount = fs.readFileSync('./money.db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./money.db', newAmount)

    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://kkk.com:8001')
    response.write(`{
      "note":{
        "to":"八重樱",
        "from":"飞鱼丸",
        "heading":"嘤嘤嘤",
        "body":"大姐你回来啦"
      }
    }`)
    response.end()
  } else {
    // 0.请求失败。返回404.
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('请求失败')
    response.end()
  }

  /******** 路由代码结束 ********/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用浏览器打开 http://localhost:' + port)