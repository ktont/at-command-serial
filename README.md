# at-command-serial

```
var serialport = require('./index.js');

async function __runrun() {
  var reply;

  await serialport.open('/dev/ttyUSB3');

  reply = await serialport.execute('AT');
  console.log('reply:', reply, '<----');

  reply = await serialport.execute('ATI');
  console.log('reply:', reply, '<----');

  reply = await serialport.execute('AT+COSPABCDEF?');
  //throw error
  console.log('reply:', reply, '<----');
}

__runrun()
.then(console.log)
.catch(console.error);
```
