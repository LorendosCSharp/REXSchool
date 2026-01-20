/*
REXSchool Copyright (C) 2026 Lorendos aka Leonid
Full license agrement is under the file LICENSE
Uses code from AdriDevelopsThings/xschool-node on github
*/

type Mark = {
  id: string
  title: string
  dateOfCorrection?: string
  dateOfRating?: string
  mark: string | null
}

type Subject = {
  id: string
  title: string
  marks: Mark[]
}

type Student = {
  id: string
  firstname: string
  lastname: string
  subjects: Subject[]
}

type Term = {
  id: string
  title: string
  current: boolean
  students: Student[]
}

type Terms = Term[]

export class REXSchoolAPI {
  constructor(
    endpoint: string,
    username?: string,
    password?: string,
    code?: string,
    cookies?: { [key: string]: string },
  )

  async login(): Promise<void>
  async getNotes(): Promise<void>
  async verify(): Promise<void>
  async provideUsername(): Promise<string>
  async providePassword(): Promise<string>
  async provideCode(): Promise<string>
  getCookies(): { [key: string]: string }
  getCodeRequired(): boolean
  getLogged(): boolean
}

export class XSchoolError extends Error {
  step: string
  message: string
}

export class ApiError extends XSchoolError {
  public step: string
  public url: string
  public status: string | number
  public content: string
}

export class NoCSRFTokenAvailable extends XSchoolError {
  public url: string
}
