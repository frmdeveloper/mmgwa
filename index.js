process.env.TZ = 'Asia/Jakarta'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const FileType = require('file-type')
const downloadM = require('@adiwajshing/baileys').downloadContentFromMessage
const PORT = process.env.PORT || 5000
const axios = require('axios')
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
	var {urlpath} = req.params
	if (!urlpath) return res.status(404).send('Tidak ditemukan')
	res.redirect('https://mmg.whatsapp.net/d/f/'+urlpath)
})
app.get('/d/f/:urlpath/:mediaKey', async(req, res) => {
  try {
	const urlmmg = 'https://mmg.whatsapp.net/d/f/'
	const downloadm = req.query
	const {urlpath} = req.params
	if (!downloadm.type) return res.status(404).send('?type not found')
	const mediaKey = Buffer.from(req.params.mediaKey, 'base64')
	if (downloadm.directPath) var directPath = Buffer.from(downloadm.directPath, 'base64')
	var stream = await downloadM({url: urlmmg+urlpath, mediaKey, directPath}, downloadm.type)
		let buffer = Buffer.from([])
  	  for await(const chunk of stream) {
  	  	buffer = Buffer.concat([buffer, chunk])
  	  }
	let type = await FileType.fromBuffer(buffer) || {
      mime: 'application/octet-stream',
      ext: '.bin'
	}
	res.set("content-type", type.mime).send(buffer)
  } catch (e) {
	res.status(404).send(e+``)
  }
})