import {useEffect, useRef} from "react";

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
      preStr = preStr + preList[i].slice(1, preList[i].length) + '\n'
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
  date = new Date(date.getTime() - (today.getTimezoneOffset() * 60000))
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
  console.log(window.pageYOffset)
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
