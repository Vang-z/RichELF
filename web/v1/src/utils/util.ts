import {useEffect, useRef} from "react";
import SparkMD5 from "spark-md5";

export const MiniWidth = 1680
export const Small = 'small'
export const Medium = 'medium'
export const Large = 'large'
export const PLACEHOLDER = `$2f8003e0-fcdd-4512-ae9f-4582abf37b55$Placeholder$6776dcb7-e159-42c1-b498-22663217129e$`;

export interface SizeProps {
  size: typeof Small | typeof Medium | typeof Large
}

export const scroll2Top = () => {
  document.documentElement.scrollTop = 0
}

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const renderGenerateHtml = (content: string) => {
  let innerHtml: string[] = []
  let codeSamples: string[] = []
  const codeSample = content.match(/<pre class="language-code"><code>([\s\S]*?)<\/code><\/pre>/g)
  if (codeSample !== null) {
    for (let i = 0; i < codeSample.length; i++) {
      codeSamples.push(content.slice(content.indexOf(codeSample[i]) + 33, content.indexOf(codeSample[i]) + codeSample[i].length - 13).replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
      const htmlSample = content.slice(0, content.indexOf(codeSample[i])).replace(/(^\s*)|(\s*$)/g, "")
      if (htmlSample === '') {
        innerHtml.push(PLACEHOLDER)
      } else {
        innerHtml.push(htmlSample)
        innerHtml.push(PLACEHOLDER)
      }
      content = content.slice(content.indexOf(codeSample[i]) + codeSample[i].length, content.length)
    }
  }
  innerHtml.push(content)
  return [innerHtml, codeSamples]
}

export const renderCopyHandler = (e: any) => {
  const key = e.currentTarget.id
  const pre = document.getElementById(key.slice(5, key.length))
  if (pre !== null) {
    const preList = pre.innerText.split('\n')
    let preStr = ''
    for (let i = 0; i < preList.length; i++) {
      preStr = preStr + preList[i] + '\n'
    }
    const el = document.createElement('textarea');
    el.value = preStr;
    el.setAttribute('readonly', '');
    el.style.display = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

export const dateFormatHandler = (type: 'diff' | 'comm', dateStr: string) => {
  let date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    date = new Date()
  }
  const today = new Date()
  if (dateStr) {
    date = new Date(date.getTime() - (today.getTimezoneOffset() * 60000))
  } else {
    date = today
  }
  switch (type) {
    case "diff":
      // dif 为分钟差
      let diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60))
      if (diff < 1) {
        return '刚刚'
      } else if (diff < 60) {
        return diff + '分钟前'
      } else if (diff < 60 * 24) {
        return Math.floor(diff / 60) + '小时前'
      } else if (diff < 60 * 24 * 7) {
        return Math.floor(diff / 60 / 24) + '天前'
      } else if (diff < 60 * 24 * 30) {
        return Math.floor(diff / 60 / 24 / 7) + '周前'
      } else if (diff < 60 * 24 * 365) {
        return Math.floor(diff / 60 / 24 / 30) + '个月前'
      } else {
        return Math.floor(diff / 60 / 24 / 365) + '年前'
      }
    case "comm":
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString()
      const day = date.getDate().toString()
      const hour = date.getHours().toString()
      const minute = date.getMinutes().toString()
      const second = date.getSeconds().toString()
      return year + '-' + (month.length > 1 ? month : '0' + month) + '-' + (day.length > 1 ? day : '0' + day) + ' ' +
        (hour.length > 1 ? hour : '0' + hour) + ':' + (minute.length > 1 ? minute : '0' + minute) + ':' + (second.length > 1 ? second : '0' + second)
  }
}

export const scrollToAnchor = (anchorName?: string) => () => {
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }
}

export const scrollToPos = (top: number) => () => {
  window.scrollTo({top: top, behavior: 'smooth'});
}

export const readFile = (file: Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

export const dataURLtoFile = (dataUrl: string, filename: string) => {
  let arr = dataUrl.split(','),
    mime = (arr[0].match(/:(.*?);/) as Array<any>)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

export const incrementalMD5 = (file: File) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    const chunkSize = 1024 * 1024 // Read in chunks of 1MB
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0

    fileReader.onload = (event) => {
      if (event.target) {
        spark.append(event.target.result as ArrayBuffer) // Append array buffer
        ++currentChunk
        currentChunk < chunks ? loadNext() : resolve(spark.end()) // Compute hash
      }
    }

    fileReader.onerror = () => reject(fileReader.error)

    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end))
    }

    loadNext()
  })

export const BUSINESS = {
  OK: 20000,  // 操作成功, 'OK'
  INVALID_TOKEN: 20001,  // 无效的token, 'Invalid token'
  ACCESS_TOKEN_EXPIRED: 20002,  // access token过期, 'Access token expired'
  AUTHORIZATION_ERROR: 20004,  // authorization字段错误, 'Authorization error'

  PHONE_ERROR: 20010,  // 手机号格式不符合规则, 'Wrong format of mobile phone number'
  PHONE_EXISTED: 20011,  // 手机号已被使用, 'Phone existed'
  EMAIL_ERROR: 20012,  // 邮箱地址不符合规则, 'Wrong format of email address'
  EMAIL_EXISTED: 20013,  // 邮箱地址已被使用, 'Email existed'
  PASSWORD_ERROR: 20014,  // 密码不符合规则, 'Wrong format of password'
  USERNAME_OR_PASSWORD_ERROR: 20015,  // 账户或密码错误, 'Wrong account or password'
  ACCOUNT_LOCKED: 20016,  // 账户已被锁定, 'Account has been locked'
  ACCOUNT_EXISTED: 20017,  // 账号已被使用, 'Account existed'
  NOT_EXIST: 20018,  // 结果不存在, 'Result does not exist'
  ILLEGAL_OPERATION: 20019,  // 非法操作, 'Illegal operation'

  CODE_ERROR: 20020,  // 验证码错误, 'Wrong code'
  CODE_SEND_SUCCESS: 20021,  // 发送验证码成功, 'Send code success'
  CODE_SEND_ERROR: 20022,  // 发送验证码失败, 'Send code failed'
  CODE_RESEND_ERROR: 20023, // 60s内不能重复发送验证码, '60s needed for resend'
  FILE_NOT_EXIST: 20024,  // 文件不存在, 'File not found'
  FILE_ALREADY_EXIST: 20026,  // 文件以存在, 'File already exist'
  EMPTY_FILE: 20026,  // 文件为空, 'Empty file'
  FILE_FORMAT_ERROR: 20027,  // 上传的文件格式不正确, 'Wrong pic format'
  PARAMS_ERROR: 20028,  // 参数错误, 'Params error'
}
