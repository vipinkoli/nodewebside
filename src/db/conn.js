const mongoose = require('mongoose');

// mongoose.connect('mongodb://vipin:vipin0786@ac-slurjug-shard-00-00.dxtuy3l.mongodb.net:27017,ac-slurjug-shard-00-01.dxtuy3l.mongodb.net:27017,ac-slurjug-shard-00-02.dxtuy3l.mongodb.net:27017/?ssl=true&replicaSet=atlas-8vfr7w-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlparser: true,
// useUnifiedTopology: true
mongoose.connect('mongodb://vipin:vipin0786@ac-slurjug-shard-00-00.dxtuy3l.mongodb.net:27017,ac-slurjug-shard-00-01.dxtuy3l.mongodb.net:27017,ac-slurjug-shard-00-02.dxtuy3l.mongodb.net:27017/?ssl=true&replicaSet=atlas-8vfr7w-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlparser: true,
useUnifiedTopology: true
}).then(() => {
    console.log('connection sucessful');
}).catch((e)=>{
    console.log('no connection');
})