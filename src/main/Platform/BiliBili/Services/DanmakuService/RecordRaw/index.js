import { promises as fspromise } from 'fs'
import { defaultMap as DM } from '../Warpper'

const readFile = fspromise.readFile
const writeFile = fspromise.writeFile
const appendFile = fspromise.appendFile

const recorderRaw = {}

recorderRaw.rawMessage = function(e){
    var s 
    if (typeof(e)!=='string'){
        s = JSON.stringify(e)
    }
    else{
        s = e 
    }
    appendFile('./record/rawMessage.log',s+'\n').then(function(){
        // console.log("rawMessage...",s) //do nothing
    }).catch(console.log)
}
recorderRaw.rawMessageCMD = function(e){
    appendFile('./record/rawMessageCMD.log',e+'\n').then(function(){
        // console.log("rawMessageCMD...",e) //do nothing
    }).catch(console.log)
}
recorderRaw.rawParsedCMD = function(e){
    appendFile('./record/parsedcmd.log',e+'\n').then(function(){
        // console.log("rawParsedCMD...",e) //do nothing
    }).catch(console.log)
}
recorderRaw.compare = function(){
    //todo
    readFile('./record/parsedcmd.log').then((data)=>{
        var a=data.toString().split('\n');
        var b=[];
        a.forEach((e)=>{b[e]=true});
        console.log("MessageCMD after parsed Summary:\n",b);
        var c=[];
        var i=0;
        for (let [k,v] of Object.entries(b)){
            console.log("checking", k)
            i++
            switch (typeof(k)){
                case 'string':
                    if (DM[k]){
                        c.push(`- ${k}`)
                    }
                    else if (k.length!=0){
                        c.push(`+ ${k}`)
                    }
                    else{
                        //do nothing
                    }
                    break;
                default:
                    //do nothing
                    break;
            }
            if (i==Object.keys(b).length){
                // on the exit of key-value for loop
                writeFile('./record/difference',c.join('\n')).then(console.log).catch(console.log)
            }
        }
    })
}

export default recorderRaw