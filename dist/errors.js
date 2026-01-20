/*
REXSchool Copyright (C) 2026 Lorendos aka Leonid
Full license agrement is under the file LICENSE
Uses code from AdriDevelopsThings/xschool-node on github
*/

export class XSchoolError extends Error {
  constructor(step, message) {
    super(`Error while ${step}: ${message}.`)
    this.step = step
    this.message = message
  }
}
export class ApiError extends XSchoolError {
  constructor(step, url, status, content) {
    super(step, `Error while retrieving data from ${url}: ${status}: '${content}'.`)
    this.step = step
    this.url = url
    this.status = status
    this.content = content
  }
}
export class NoCSRFTokenAvailable extends XSchoolError {
  constructor(url) {
    super(`getCSRFToken`, `No CSRF tokens available on url ${url}.`)
    this.url = url
  }
}
