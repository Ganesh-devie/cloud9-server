const express = require('express');
const bodyparser = require('body-parser');
//const myReqLogger = require('./Utilities/requestLogger');
const route = require('./routes/routing');
const cors = require('cors');

const coroption={
  origin:'*',
  credentials:'true',
  optionSuccessStatus:200,
}
const app = express();
app.use(bodyparser.json());
//app.use(myReqLogger);
app.use(cors(coroption));
app.use('/api', route);
app.use(bodyparser.json({ limit: 1000000000 }));
app.use(bodyparser.urlencoded({ limit: 1000000000,  extended: true, parameterLimit: 1000000000 }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports=app
