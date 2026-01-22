const express = require('express')

app = express()

app.get('/',(req,res)=>{
    console.log('hello');
   return res.send('hey');
    
})

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

