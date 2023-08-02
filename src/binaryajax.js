const Promise = require('lie')
const http = require('http')
const https = require('https')
const Buffer = require('buffer').Buffer

import { combine } from './combine'

export function binaryAjax(_url, type) {
  return new Promise(function (resolve, reject) {
    const url = combine(_url, type)
    let method = http
    if (url.startsWith('https:')) {
      method = https
    }
    method
      .get(url, function (res) {
        let len = 0
        const buffers = []

        res.on('data', function (d) {
          len += d.length
          buffers.push(d)
        })
        res.on('error', function (e) {
          reject(e)
        })
        res.on('end', function () {
          if (res.statusCode > 399) {
            if (type === 'prj' || type === 'cpg' || type === 'dbf') {
              return resolve(false)
            } else {
              return reject(new Error(Buffer.concat(buffers, len).toString()))
            }
          }
          const buffer = Buffer.concat(buffers, len)
          if (type === 'prj') {
            resolve(buffer.toString())
          } else {
            resolve(buffer)
          }
        })
      })
      .on('error', function (e) {
        reject(e)
      })
  })
}
