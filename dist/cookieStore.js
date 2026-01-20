/*
REXSchool Copyright (C) 2026 Lorendos aka Leonid
Full license agrement is under the file LICENSE
Uses code from AdriDevelopsThings/xschool-node on github
*/
export class CookieStore {
  constructor() {
    this.cookies = {}
  }
  addCookie(name, value) {
    this.cookies[name] = value
  }
  getCookie(name) {
    if (this.cookies[name] != undefined) {
      return this.cookies[name]
    }
    return null
  }
  removeCookie(name) {
    delete this.cookies[name]
  }
  parseCookiesFromSet(setCookies) {
    setCookies.forEach((setCookie) => {
      const list = setCookie.split('; ')
      if (list.length > 0) {
        if (list[0] != undefined) {
          const [cookieName, cookieValue] = list[0].split('=')
          if (cookieName != undefined && cookieValue != undefined)
            //I hate ts undefined checks
            this.addCookie(cookieName, cookieValue)
        }
      }
    })
  }
  parseToCookieHeader() {
    let header = ''
    for (const [cookieName, cookieValue] of Object.entries(this.cookies)) {
      header += `; ${cookieName}=${cookieValue}`
    }
    return header.slice(2)
  }
}
