var express = require ('express');
var app = express();
var port = process.env.PORT||8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router(); 
var appRoutes =require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images/');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        }else{
            cb(null, Date.now() + '_' + file.originalname); 
        }
        }   
  });
  
  var upload = multer({ 
      storage: storage,
      limits: { fileSize: 10000000 }
    }).single('myfile');

//remember order of middleware is important
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname +'/public'));
app.use('/api',appRoutes);

//http://localhost:8080/api/users


mongoose.connect('mongodb://localhost:27017/fmg', function(err){
    if(err){
        console.log('Not connected to the database:'+ err);
    } else{
        console.log('Successfully connected to MongoDB');
    }
});



app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
        if(err.code === 'LIMIT_FILE_SIZE'){
            res.json({success: false, message: 'File size is too large. Max limit is 10MB'});
        } else if (err.code ==='filetype') {
            res.json({success: false, message: 'File type is invalid. Must be .png/.jpeg/.jpg'});
    } else {
            console.log(err);
            res.json({success: false, message: 'File was not able to be uploaded'});
    }
} else {  
    if(!req.file){
        res.json({success: false, message: 'No file was selected'});
    } else {
        res.json({success: true, message: 'File was uploaded!'});
    }
}    
  });
});


app.get('*',function(req,res){
    res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});

app.listen(port, function(){
    console.log('Running the server'+ port);
});

 