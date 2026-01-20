/*
REXSchool Copyright (C) 2026 Lorendos aka Leonid
Full license agrement is under the file LICENSE
Uses code from AdriDevelopsThings/xschool-node on github
*/
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import { CookieStore } from './cookieStore.js'
import { ApiError, NoCSRFTokenAvailable } from './errors.js'
import { parseJSON } from './parseJson.js'
export class API {
  constructor(endpoint, username, password, code, cookies) {
    this.endpoint = endpoint
    this.username = username
    this.password = password
    this.code = code
    this.cookie = new CookieStore()
    this.codeRequired = false
    this.logged = false
    if (cookies) this.cookie.cookies = cookies
  }
  async getCSRFToken(url) {
    const response = await fetch(this.endpoint + url)
    if (response.status !== 200)
      throw new ApiError(`getCSRFToken`, url, response.status, await response.text())
    if (response.headers.has('set-cookie'))
      this.cookie.parseCookiesFromSet(response.headers.raw()['set-cookie'])
    const root = parse(await response.text())
    const tokens = root.querySelectorAll('input[name=__RequestVerificationToken]')
    if (tokens.length === 0 && tokens[0]?.getAttribute('value') !== null) {
      throw new NoCSRFTokenAvailable(url)
    } else {
      return tokens[0]?.getAttribute('value')
    }
  }
  async verify() {
    const csrfToken = await this.getCSRFToken(
      '/Account/VerifyCode?RememberClient=False&ReturnUrl=%2F&TokenProvider=Email',
    )
    const formData = new FormData()
    formData.append('code', String(this.code))
    formData.append('ReturnUrl', '/')
    formData.append('__RequestVerificationToken', csrfToken)
    const response = await fetch(
      this.endpoint + '/Account/VerifyCode?RememberClient=False&ReturnUrl=%2F&TokenProvider=Email',
      {
        method: 'POST',
        body: formData,
        headers: {
          cookie: this.cookie.parseToCookieHeader(),
        },
        redirect: 'manual',
      },
    )
    if (
      response.status == 302 &&
      response.headers.get('Location') == '/' &&
      response.headers.has('set-cookie')
    ) {
      this.cookie.parseCookiesFromSet(response.headers.raw()['set-cookie'])
      this.logged = true
    } else {
      throw new ApiError(
        'sendCode',
        '/Account/VerifyCode?RememberClient=False&ReturnUrl=%2F&TokenProvider=Google%20Authenticator',
        response.status,
        await response.text(),
      )
    }
  }
  async sendCode() {
    const csrfToken = await this.getCSRFToken('/Account/SendCode?ReturnUrl=%2F')
    const formData = new FormData()
    formData.append('tokenProvider', 'Email')
    formData.append('ReturnUrl', '/')
    formData.append('__RequestVerificationToken', csrfToken)
    const response = await fetch(this.endpoint + '/Account/SendCode?ReturnUrl=%2F', {
      method: 'POST',
      body: formData,
      headers: {
        cookie: this.cookie.parseToCookieHeader(),
      },
      redirect: 'manual',
    })
    const idk = await this.getCSRFToken(
      '/Account/VerifyCode?RememberClient=False&ReturnUrl=%2F&TokenProvider=Email',
    )
  }
  async login() {
    if (this.username != undefined && this.password != undefined) {
      const csrfToken = await this.getCSRFToken('/Account/Login?ReturnUrl=%2F')
      const loginResponse = await fetch(this.endpoint + '/Account/Login?ReturnUrl=%2F', {
        method: 'POST',
        body: new URLSearchParams({
          Username: this.username,
          Password: this.password,
          __RequestVerificationToken: csrfToken,
        }),
        headers: {
          cookie: this.cookie.parseToCookieHeader(),
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Move': 'navigate',
          'Sec-Fetch-User': '?1',
          'Sec-GPC': '1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'manual',
      })
      if (loginResponse.status === 302 && loginResponse.headers.has('set-cookie')) {
        this.cookie.parseCookiesFromSet(loginResponse.headers.raw()['set-cookie'])
        this.logged = true
        if (loginResponse.headers.get('Location') == '/Account/SendCode?ReturnUrl=%2F') {
          await this.sendCode()
          this.codeRequired = true
          return
        }
      } else {
        throw new ApiError(
          'login',
          '/Account/Login?ReturnUrl=%2F',
          loginResponse.status,
          await loginResponse.text(),
        )
      }
    }
  }
  async getMarks() {
    const response = await fetch(this.endpoint + '/Marks/Student', {
      headers: { cookie: this.cookie.parseToCookieHeader() },
      redirect: 'manual',
    })
    if (response.status == 200) {
      const root = parse(await response.text())
      const viewModel = root.querySelector('#viewModel')
      const value = viewModel.getAttribute('value').replace('&quot', '"')
      const json = JSON.parse(value)
      return parseJSON(json)
    } else {
      const text = await response.text()
      console.log('[DEBUG] Response Full: ', response)
      console.log('[DEBUG] Response Text: ', text)
      throw new ApiError('getMarks', '/Marks/Student', response.status, text)
    }
  }
  async provideUsername(username) {
    this.username = username
  }
  async providePassword(password) {
    this.password = password
  }
  async provideCode(code) {
    this.code = code
  }
  getCookies() {
    return this.cookie.cookies
  }
  getCodeRequired() {
    return this.codeRequired
  }
  getLogged() {
    return this.logged
  }
}
