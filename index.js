process.env.TZ = 'Asia/Jakarta'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
__path = process.cwd()
process.on('uncaughtException', console.error)

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
app.listen(PORT, () => {
	console.log(`Server berjalan dengan port: ${PORT}`)
})
app.get('/', async(req, res) => {
	res.sendFile(__path+'/index.html')
})
app.get('*', async(req, res) => {
  try {
    if (!req.url.includes('/d/f/')) return res.redirect('/')
    if (req.url.endsWith(".enc")) return res.download('https://mmg.whatsapp.net/d/f/'+urlpath)
	const urlmmg = 'https://mmg.whatsapp.net/d/f/'
	const downloadm = req.query
	const urlpath = req.url.split('/d/f/')[1]
	const mediakey = urlpath.split('.enc/')[1].split('?')[0]
	if (!downloadm.type) return res.status(404).send('?type not found')
	const mediaKey = Buffer.from(mediakey, 'base64')
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