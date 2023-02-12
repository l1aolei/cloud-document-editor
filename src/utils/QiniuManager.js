const qiniu = require('qiniu')

class QiniuManager {
    constructor(accessKey, secretkey, bucket){
        // generate max
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretkey)
        this.bucket = bucket
         // init config class
        this.config = new qiniu.conf.Config()
        // 空间对应的机房
        this.config.zone = qiniu.zone.Zone_z0

        this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    }
    uploadFile(key, localFilePath){
        const options = {
            scope: this.bucket + ":" + key,
        };
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken = putPolicy.uploadToken(this.mac)
        const formUploader = new qiniu.form_up.FormUploader(this.config)
        const putExtra = new qiniu.form_up.PutExtra()
        //文件上传
        return new Promise((resolve, reject) => {
            formUploader.putFile(uploadToken, key, localFilePath, putExtra, this._handleCallback(resolve, reject));
        })
    }
    deleteFile(key) {
        return new Promise((resolve, reject) => {
          this.bucketManager.delete(this.bucket, key, this._handleCallback(resolve, reject))
        })
      }
}

module.exports = QiniuManager