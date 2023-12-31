const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
connectToMongo()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors())

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

https:'//runkit.com'/app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
