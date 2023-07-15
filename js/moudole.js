let modulega = {
  data: async function (data) {
    let returndata = ''
    let userinformation = {
      username: getCookie('username'),
      password: getCookie('password'),
    }
    data[1].userinformation = userinformation
    await fetch('https://api.dexc.pro/api.php?' + data[0], {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Length': data[1].length
      },
      body: JSON.stringify(data[1])
    })
      .then(response => response.json())
      .then(data => {
        returndata = data
      })
      .catch(error => {
        console.log(error)
        return error
      })
    return returndata
  },
  // 文件上传
  files: async function (data) {
    try {
      const controller = new AbortController();
      // 超时关闭
      const id = setTimeout(() => controller.abort(), 10000);
      console.log('开始上传')
      let response = await fetch('https://api.dexc.pro/api.php?' + data[0], {
        method: 'POST',
        signal: controller.signal,
        body: data[1]
      })
      console.log('结束')
      const games = await response.json();
      clearTimeout(id);
      return games
    } catch (error) {
      return { code: 408, data: error, massage: '超时', state: 'error' }
    }
  },
  // 单文件上传
  Fileupload: async function (ele, quill) {
    let userinformation = {
      username: getCookie('username'),
      password: getCookie('password'),
    }
    // 这里需要验证
    userinformation = {
      username: 'admin',
      password: 'c8691271dd2d487999d22c8f7915ef2bee02048b',
    }

    console.log(userinformation, JSON.stringify(userinformation))
    var formData = new FormData()
    formData.append('file', ele.file)
    // 这里错误
    formData.append('user', JSON.stringify(userinformation))
    let a = await this.files(['post=files', formData])
    const {
      index,
      length
    } = quill.selection.savedRange
    const selectedText = quill.getText(index, length)
    const newText = selectedText.toUpperCase()
    quill.deleteText(index, length)
    quill.insertText(index, newText)
    quill.setSelection(index, newText.length)
    console.log(a)
    if (a.code == 200) {
      quill.clipboard.dangerouslyPasteHTML(index, `<img src ="` + a.data + `"
      alt = "" >`)
      return true
    } else {
      // 这里
      return false
    }
  },
  Login: async function (username, password) {
    setCookie('username', username, 60)
    setCookie('password', password, 60)
    await Automaticlogin()
  },
  setText: (val) => {
    if (val != null && val != "") {
      var re1 = new RegExp("<.+?>|&.+?;", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      var msg = val.replace(re1, ""); //执行替换成空字符
      msg = msg.replace(/\s/g, ""); //去掉所有的空格（中文空格、英文空格都会被替换）
      msg = msg.replace(/[\r\n]/g, ""); //去掉所有的换行符
      return msg.substr(0, 100); //获文本文字内容的前100个字符
    } else return ''
  }



}

// 用户登陆cook相关
// 设置  只写名字不传时间就是删除
function setCookie(cname, cvalue = '', exdays = -1) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}


function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}


// 登陆流程
// 1,先写cooik
// 1,然后再验证是否登陆
// 自动登陆
let userinformation = false
async function Automaticlogin() {
  if (getCookie('username') && getCookie('password')) {
    let array = await modulega.data(['post=login', {
      username: getCookie('username'),
      password: getCookie('password'),
    }])
    userinformation = array.data ?? array.data
    console.log(userinformation)
  }

}

async function copy(ele) {
  console.log(ele.parentNode.innerText)
  let str = ele.parentNode.innerText
  let str1 = `//DEXC区块链学院`
  const replaced = str.slice(0, -2) + str1;
  let arr = navigator.clipboard.writeText(replaced).then(() => { return true }, () => { return false })
  arr = await arr
  if (arr) {
    // 成功
  } else {
    // 失败

  }
}


