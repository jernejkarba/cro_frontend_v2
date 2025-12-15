import CryptoJS from 'crypto-js'

export function createJWT (data) {
  var header = {
    'alg': 'HS256',
    'typ': 'JWT'
  }

  data = {}

  var secret = 'k23j87BGsdHBJFd2fVI'

  var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
  var encodedHeader = base64url(stringifiedHeader)

  var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
  var encodedData = base64url(stringifiedData)

  var signature = encodedHeader + '.' + encodedData
  signature = CryptoJS.HmacSHA256(signature, secret)
  signature = base64url(signature)

  var jwt = encodedHeader + '.' + encodedData + '.' + signature

  return jwt
}

function base64url (source) {
  var encodedSource = CryptoJS.enc.Base64.stringify(source)

  encodedSource = encodedSource.replace(/=+$/, '')
  encodedSource = encodedSource.replace(/\+/g, '-')
  encodedSource = encodedSource.replace(/\//g, '_')

  return encodedSource
}
