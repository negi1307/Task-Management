const multer = require('multer');
const path = require('path')

const taskAttachment = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../upload'))
    },
    filename: async function (req, file, cb) {
        let fileName = file.originalname
        cb(null, fileName)
    }
});

const taskAttachmentUpload = multer({ storage: taskAttachment });
 

 
module.exports = { taskAttachmentUpload }