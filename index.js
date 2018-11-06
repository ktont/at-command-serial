

//fs.write(fd, "AT+QCOPS=7,1\r\n", (r) => {
// fs.write(fd, "ATI\r\n", (r) => {
//  console.log('write', r);
//  process.exit(0);
// });

var SerialPort = require('serialport');
var port = null;
/*
{
  command: 'ATI',
  reply: [],
  resolve
  reject
}
*/
var pendingTask = null;

exports.open = function(ttyfile = '/dev/ttyUSB3', option = { }) {
  return new Promise((resolve, reject) => {
    port = new SerialPort(ttyfile, option, (err) => {
      if(err) {
        // exit(1);
        return reject(err);
      }
      resolve();
    });

    __install(port);
  });
}

//AT+QCOPS=7,1
//ATI
exports.execute = async function(cmd) {
  if(pendingTask) return Promise.reject(new Error('already pending'));
  
  return new Promise((resolve, reject) => {
    cmd += '\r\n';
    setTimeout(() => {
      pendingTask = null;
      reject(new Error('timeout'));
    }, 10*1000);
    pendingTask = {
      command: cmd,
      reply: '',
      resolve,
      reject
    };
    port.write(cmd);
  });
}

function __install(port) {
  port.on('data', (data) => {
    if(!pendingTask) return;
    
    //console.log('Data:', data.toString(), '=========>>');

    var s = data.toString();
    if(s.endsWith('\r\nOK\r\n')) {
      pendingTask.reply += s.slice(0, -6);
      pendingTask.resolve(pendingTask.reply);
      pendingTask = null;
    } else if(s.endsWith('\r\nERROR\r\n')) {
      pendingTask.reply += s.slice(0, -9);
      pendingTask.reject(new Error(pendingTask.reply));
      pendingTask = null;
    } else {
      pendingTask.reply += s;
    }
  });

  port.on('error', (err) => {
    if(!pendingTask) return;
    console.log('Error:', err.message);
    pendingTask.reject(err);
    pendingTask = null;
  });

}


