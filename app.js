var express = require('express');
var jquery = require("jquery");
var bodyParser  = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

var app = express();

const connectDB = 'mongodb://127.0.0.1/setstream';

mongoose.connect(connectDB,{ useNewUrlParser: true }, function (err) { 
if (err) throw err; console.log('Successfully connected'); });

// mongoose.connect('mongodb+mongodb+srv://<user>:<password>@setstream-m1prn.mongodb.net/<dbname>?retryWrites=true&w=majority://<user>:<password>@setstream-m1prn.mongodb.net/<dbname>?retryWrites=true&w=majority', {
//     auth: {
//       user: "Enter username here",
//       password: "Enter password here"
//     },
//     useNewUrlParser:true,
//     useUnifiedTopology: true
//       }).then(
//         () => { 
//             console.log("MongoAtlas Database connected.");
//         },
//         err => { 
//             /** handle initial connection error */ 
//             console.log("Error in database connection. ", err);
//         }
//     );
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var processorSchema = new mongoose.Schema({
    name: String,
    score: Number
});
var Processor = mongoose.model("Processor", processorSchema);

var gpuSchema = new mongoose.Schema({
    name: String,
    score: Number
});
var GPU = mongoose.model("GPU", gpuSchema);

var processor;
var gpu;
var memory;
var admin = false;

//post methods
app.post("/app", function(req,res){
    processor = req.body.processor;
    gpu = req.body.gpu;
    memory = req.body.memory;
    Processor.find({}, function(err, serverCPU){
        if(err){
            console.log(err);
        } else {
            GPU.find({}, function(err,serverGPU){
                res.render("result.ejs", {processor: processor, gpu: gpu, memory: memory, serverCPU: serverCPU, serverGPU: serverGPU});
            });
        }
    }); 
});
app.get("/app/recording", function(req,res){
    Processor.find({}, function(err, serverCPU){
        if(err){
            console.log(err);
        } else {
            GPU.find({}, function(err,serverGPU){
                res.render("recording.ejs", {processor: processor, gpu: gpu, memory: memory, serverCPU: serverCPU, serverGPU: serverGPU});
            });
        }
    }); 
});
// get methods
//component methods
app.get("/components", function(req,res){
    Processor.find({}, function(err, processor){
        if(err){
            console.log(err);
        } else {
            GPU.find({}, function(err,GPU){
                res.render("components.ejs", {processor: processor, gpu: GPU});  
            });
        }
    }); 
});
app.get("/admin" ,function(req,res){
    res.render("adminlogin.ejs");
});
app.post("/admin", function(req,res){
    if(req.body.username == "admin" && req.body.password == "pass"){
        admin = true;
        res.redirect("/components/new");
    } else {
        alert("Wrong combinations!");
    }
});
app.get("/components/new", function(req, res){
    if(admin == true){
        Processor.find({}, function(err, processor){
            if(err){
                console.log(err);
            } else {
                GPU.find({}, function(err,GPU){
                    res.render("new.ejs", {processor: processor, gpu: GPU, admin:admin});  
                });
            }
        }); 
    }else {
        res.redirect("/");
    }
});
//processor
app.post("/components/processor", function(req,res){
    Processor.create(req.body.processor, function(err, processor){
        if(err){
            res.send("something went wrong!");
        } else {
            res.redirect("/components/new");
        }
    });
}); 
app.delete("/app/components/processor/:id", function(req,res){
    Processor.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Page not found!");
        } else {
            res.redirect("/components/new");
        }
    });
});
//gpu
app.post("/components/gpu", function(req,res){
    GPU.create(req.body.gpu, function(err, gpu){
        if(err){
            res.render("new");
        } else {
            res.redirect("/components/new");
        }
    });
});
app.delete("/app/components/gpu/:id", function(req,res){
    GPU.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Page not found!");
        } else {
            res.redirect("/components/new");
        }
    });
});

app.get("/", function(req,res) {
    Processor.find({}, function(err, processor){
        if(err){
            console.log(err);
        } else {
            GPU.find({}, function(err,GPU){
                res.render("home.ejs", {processor: processor, gpu: GPU});  
            });
        }
    }); 
});

app.get("/contact", function(req,res) {
    res.render("contact.ejs");  
});

app.get("/app/benchmark", function(req,res){
    Processor.find({}, function(err, serverCPU){
        if(err){
            console.log(err);
        } else {
            GPU.find({}, function(err,serverGPU){
                res.render("benchmark.ejs", {processor: processor, gpu: gpu, memory: memory, serverCPU: serverCPU, serverGPU: serverGPU});  
            });
        }
    }); 
});

app.get("/vision", function(req,res){
    res.render("vision.ejs");
});

app.get("/help", function(req,res){
    res.render("help.ejs");
});

app.get("/faq", function(req,res){
    res.render("faq.ejs");
});
//server started
app.listen(3000, function(req,res) {
    console.log("streamsets server started.");
});
