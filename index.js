process.env.TZ = 'Asia/Jakarta'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const FileType = require('file-type')
const downloadM = require('@adiwajshing/baileys').downloadContentFromMessage
const PORT = process.env.PORT || 5000
const app = require('express')()
app.enable('trust proxy')
app.set("json spaces",2)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.listen(PORT, () => {
	console.log(`Server berjalan dengan port: ${PORT}`)
})
app.get('*', async(req, res) => {
  try {
	var urlmmg = 'https://mmg.whatsapp.net/d/f/'
	var downloadm = req.query
	var mediaKey = Buffer.from(downloadm.mediaKey, 'base64')
	if (downloadm.directPath) var directPath = Buffer.from(downloadm.directPath, 'base64')
	var stream = await downloadM({url: downloadm.url, mediaKey, directPath}, downloadm.type)
		let buffer = Buffer.from([])
  	  for await(const chunk of stream) {
  	  	buffer = Buffer.concat([buffer, chunk])
  	  }
	res.set("content-type", downloadm.mimetype).send(buffer)
  } catch (e) {
	res.send(e+``)
  }
})
async function getFile(path) {
  let res
  let data = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (res = await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
  if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
  let type = await FileType.fromBuffer(data) || {
    mime: 'application/octet-stream',
    ext: '.bin'
  }
  return {
    res,
    ...type,
    data
  }
}