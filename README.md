# at-command-serial

适用于类似 rild 这样的程序

同一时刻，只能有一个AT指令在执行。

默认超时时间是 1 分钟。

## demo
 
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
