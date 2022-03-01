process.env.TZ = 'Asia/Jakarta'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const FileType = require('file-type')
const downloadM = require('@adiwajshing/baileys').downloadContentFromMessage
const PORT = process.env.PORT || 5000
const express = require('express')
const app = express()
app.enable('trust proxy')
app.set("json spaces",2)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.listen(PORT, () => {
	console.log(`Server berjalan dengan port: ${PORT}`)
})
app.get('/', async(req, res) => {
	res.send('.')
})
app.get('/d/f/:urlpath', async(req, res) => {
  try {
	var urlmmg = 'https://mmg.whatsapp.net/d/f/'
	var downloadm = req.query
	var {urlpath} = req.params
	var mediaKey = Buffer.from(req.params.mediaKey, 'base64')
	if (downloadm.directPath) var directPath = Buffer.from(downloadm.directPath, 'base64')
	var stream = await downloadM({url: urlmmg+urlpath, mediaKey, directPath}, downloadm.type)
		let buffer = Buffer.from([])
  	  for await(const chunk of stream) {
  	  	buffer = Buffer.concat([buffer, chunk])
  	  }
	let type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
	}
	res.set("content-type", type.mime).send(buffer)
  } catch (e) {
	res.send(e+``)
  }
})