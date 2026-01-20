/*
Created by Lorendos aka Leonid in 2026
Uses code from AdriDevelopsThings/xschool-node on github
*/

export class CookieStore {
  cookies: { [key: string]: string } = {}

  addCookie(name: string, value: string) {
    this.cookies[name] = value
  }

  getCookie(name: string): string | null {
    if (this.cookies[name] != undefined) {
      return this.cookies[name]
    }
    return null
  }

  removeCookie(name: string) {
    delete this.cookies[name]
  }

  parseCookiesFromSet(setCookies: string[]) {
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

  parseToCookieHeader(): string {
    let header = ''
    for (const [cookieName, cookieValue] of Object.entries(this.cookies)) {
      header += `; ${cookieName}=${cookieValue}`
    }
    return header.slice(2)
  }
}
