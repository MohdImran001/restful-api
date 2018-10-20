const fs = require('fs');
const path = require('path');
const config = require('./config');
const Ninja = require('./models/ninja')
var helpers = {}

helpers.getTemplate = function(templateName, data, callback) {
    templateName = typeof(templateName) == 'string' && templateName.length > 0? templateName : false;
    data = typeof(data) == 'object' && data !== null ? data : {};
    if(templateName)
    {
        var templatesDir = path.join(__dirname,'/public/temp/')
        var tempPath = templatesDir+templateName+'.html'
        fs.readFile(tempPath,'utf8', function(err,str) {
            if(!err && str && str.length > 0)
            {
                //console.log(data);
                var finalString = helpers.interpolate(str,data);
                //console.log(data);
                callback(false, finalString);
            }
            else
            {
                callback('template not found');
            }
        })
    }
    else
    {
        callback('a valid template name is missing')
    }
}

helpers.addUniversalTemps = function(tempStr, data,callback) {
  tempStr = typeof(tempStr) == 'string' && tempStr.length > 0 ? tempStr : false;
  if(tempStr)
  {
      helpers.getTemplate('_header', data, function(err, headerStr) {
          if(!err && headerStr && headerStr.length > 0)
          {
              helpers.getTemplate('_footer', data, function(err, footerStr) {
                  if(!err && footerStr && footerStr.length > 0)
                  {
                      var finalStr = headerStr + tempStr + footerStr;
                      callback(false,finalStr)
                  }
                  else
                  {
                      callback('footer temp not found')
                  }
              })
          }
          else {
             callback('header temp not found')
          }
      })
  }
  else {
      callback('invalid temp string')
  }
}

helpers.miniTemp = function(templateName, data, callback) {
  helpers.getTemplate(templateName, data, function (err, str) {
      if(!err)
      {
          helpers.addUniversalTemps(str, data, function(err, finalStr) {
              if(!err && finalStr && finalStr.length > 0)
              {
                  callback(false, finalStr)
              }
              else {
                 callback(err)
              }
          })
      }
      else
      {
          callback(err)
      }
  })
}

helpers.interpolate = function(str, data) {
    str = typeof(str) == "string" && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data :  {};

    for(var keyName in config)
    {
        if(config.hasOwnProperty(keyName))
        {
            data[keyName] = config[keyName];
        }
    }

    for(var key in data)
    {
        //console.log(data)
        if(data.hasOwnProperty(key) && typeof(data[key]) == 'string')
        {
              var replace = data[key];
              //console.log(replace);
              var find = '{'+key+'}';
              //console.log(find);
              //console.log(str);
              str = str.replace(find, replace);
              //console.log(str);
        }
    }
    return str;
}

module.exports = helpers;
