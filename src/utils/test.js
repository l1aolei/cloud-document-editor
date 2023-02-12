const QiniuManager = require('./src/utils/QiniuManager')
const path = require('path')
//generate mac
const accessKey = 'yS8H_Bp5ry3xH_MZoJ61UDSg1KTbifD0LZXYvSFL'
const secretKey = 'X40nfFvfL-38GTpaI3gD1yt8O8U9CDujUcgdRpnh'
const localFile = "/Users/liusha/Desktop/name1.md";
const key='test.md'
const downloadPath = path.join(__dirname, key)

const manager = new QiniuManager(accessKey, secretKey, 'clouddoc0725')
manager.uploadFile(key, downloadPath).then((data) => {
  console.log('上传成功',data)
})
//manager.deleteFile(key)
// manager.generateDownloadLink(key).then(data => {
//   console.log(data)
//   return manager.generateDownloadLink('first.md')
// }).then(data => {
//   console.log(data)
// })
//const publicBucketDomain = 'http://pv8m1mqyk.bkt.clouddn.com';

// manager.downloadFile(key, downloadPath).then(() => {
//   console.log('下载写入文件完毕')
// })
