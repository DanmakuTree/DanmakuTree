# Add recorder to the Warpper.js

## Usage

Launch `node` with `esm`. And import the `plaform` for where it is located. After complete the login process, insert the code below to `../Warpper.js`, like:

```js
import recorderRaw from './RecordRaw'
// ...
// insert the code below to where it should be
recorderRaw.rawMessage(message)
recorderRaw.rawMessageCMD(message.cmd)
recorderRaw.rawParsedCMD(cmd)
```

Before you run, make sure you have created empty files, like:

```filepath
record\parsedcmd.log
record\rawMessage.log
record\rawMessageCMD.log
```

And connect your Danmaku Service to any Room / Rooms you want you listen. The `recorderRaw` will help you monitor and store the log.

After run the script in background for a while, you can:

```javascript
import rr  from './src/main/Platform/BiliBili/Services/DanmakuService/RecordRaw'

rr.compare()
```
