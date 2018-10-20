var app = {};

app.config = {
    "token" : false,
    "id": false
}

// TODO: hash the passwords using js frontend then send them
app.client = function(headers,path,method,queryStringObject,payload,callback){

  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++;
       // If at least one query string parameter has already been added, preprend new ones with an ampersand
       if(counter > 1){
         requestUrl+='&';
       }
       // Add the key and value
       requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  if(app.config.token){
    xhr.setRequestHeader("token", app.config.token);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback){
          try{
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};

app.retrieveUser = function() {
    app.client(undefined, '/auth/retrieveUser', 'POST', undefined, undefined, function(statusCode, res) {
        if(statusCode == 200)
        {
            app.checkUrl();
            app.getToken();
            $('.NinjaName').html('HELLO, ' + res.name);
            if(document.querySelector('.updateNinjaName'))
            {
              var nameInput = document.querySelector('.updateNinjaName');
              var rankInput = document.querySelector('.updateNinjaRank');
              var select = document.querySelector('select');
              var lat = document.querySelector('.lat');
              var lng = document.querySelector('.lng');
                //select.options[sx].value = res.rank;
                // TODO: update the select box
                //JUGAAD
              rankInput.value  = res.rank;
              nameInput.value = res.name;
              lat.value = res.lat;
              lng.value = res.lng;

              var available = document.querySelectorAll("input[name='radio']");
              if(res.available)
              {
                  available[1].checked = false;
                  available[0].checked = true;
              }
              else
              {
                  available[0].checked = false;
                  available[1].checked = true;
              }
            }
            app.config.id = res.id;
        }
    })
}

app.checkAuth = function() {
  var url = window.location.href;
  var token = localStorage.getItem('token');
  token = typeof(token) == 'string' && token.length > 0 ? token : false;
  if(token == false)
  {
      if(url == 'http://localhost:4000/change-password' || url == 'http://localhost:4000/update-info' || url == 'http://localhost:4000/delete-account' || url == 'http://localhost:4000/accountDeleted')
      {
          window.location = '/login';
      }
  }
}

app.checkUrl = function() {
    var url = window.location.href;
    var token = localStorage.getItem('token');
    token = typeof(token) == 'string' && token.length > 0 ? token : false;
    if(token && url == 'http://localhost:4000/login' || token && url == 'http://localhost:4000/signup')
    {
        window.location = '/';
    }
}

app.getToken = function() {
    var token = localStorage.getItem('token');
    token = typeof(token) == 'string' && token.length > 0 ? token : false;
    if(token)
    {
        app.setLoggedInClass(true);
        app.config.token = token;
    }
    else {
       app.setLoggedInClass(false);
    }
}

app.setLoggedInClass = function(add) {
    if(add)
    {
        var body = document.querySelector('body');
        body.classList.add('loggedIn');
    }
    else
    {
        var body = document.querySelector('body');
        body.classList.add('loggedOut');
    }
}

app.dropdown = function() {
  $('.dropBtn').hover(function() {
      $('.dropdown').toggle('fast','linear')
  })
}

app.bindForms = function() {

    if(document.querySelector('form'))
    {

        var allForms = document.querySelectorAll('form')
        for(var i=0; i < allForms.length; ++i)
        {
            //console.log('We are getting forms');
            allForms[i].addEventListener('submit', function(e) {
                e.preventDefault();
                //console.log('form submitted');
                var id = this.id;
                var path = this.action;
                var method = this.method;

                //hide the error message due to previous error
                $('.formError').hide()
                $('.formSuccess').hide();

                //turn the inputs into payload
                var payload = {};
                var geometry = { type: 'Point', coordinates: [] }
                var elements = this.elements;
                for(var i =0 ; i < elements.length ; ++i)
                {
                      //console.log('we are in loop');
                      if(elements[i].type !== 'submit')
                      {
                          if(elements[i].type == 'text' || elements[i].type == 'password')
                          {
                              //console.log('we are in text || password');
                              var nameOfElement = elements[i].name;
                              var valueOfElement = elements[i].value;
                              payload[nameOfElement] = valueOfElement;
                              //console.log(payload)

                          }
                          if(elements[i].type == 'number')
                          {
                              var nameOfElement = elements[i].name;
                              var valueOfElement = elements[i].value;
                              geometry.coordinates.push(valueOfElement);
                            //  console.log(geometry.coordinates);
                          }
                          if(elements[i].type == 'radio')
                          {
                              payload['available'] = document.querySelector('input[name="radio"]:checked').value;
                          }
                      }
                }

                if(id == 'getNinjaForm')
                    app.getNinjaFormHandler(payload)
                if(id == 'LoginForm')
                    app.loginNinjaFormHandler(payload);
                if(id == 'SignupForm')
                {
                      var select  = document.querySelector('select');
                      var selectedValue = select.options[select.selectedIndex].value;
                      payload.geometry = geometry;
                      payload['rank'] = selectedValue;
                      app.signupNinjaFormHandler(payload);
                }
                if(id == 'changePasswordForm')
                    app.changePasswordFormHandler(payload);
                if(id == 'updateInfoForm')
                {
                    var select  = document.querySelector('select');
                    var selectedValue = select.options[select.selectedIndex].value;
                    payload.geometry = geometry;
                    if(select.selectedIndex == 0)
                        alert('please choose rank');
                    else
                        payload['rank'] = selectedValue;
                    console.log(payload)
                    app.updateInfoFormHandler(payload);
                }
                if(id == 'deleteAccountForm')
                    app.deleteAccountHandler(payload);
            })
        }
    }
}

app.deleteAccountHandler = function(payload) {
    app.client(undefined, '/api/ninjas/deleteAccount/', 'DELETE', undefined, payload, function(statusCode, response) {
        if(statusCode == 200)
        {
          app.client(undefined, '/auth/logout/', 'POST', undefined, undefined, function(statusCode, res) {

              if(statusCode == 200) {
                  localStorage.removeItem('token');
                  window.location = '/accountDeleted'
              }
          })

        }
        else
        {
            $('.formError').html(response.Error);
            $('.formError').show();
        }
    })
}

app.updateInfoFormHandler = function(payload) {
  app.client(undefined, '/api/ninjas/updateInfo/', 'PUT', undefined, payload, function(statusCode, response) {
        if(statusCode == 200)
        {
          document.querySelector('.formSuccess').innerHTML = response.msg;
          $('.formSuccess').show();
          window.location = '/update-info';
        }
        else
        {
          document.querySelector('.formError').innerHTML = response.Error;
          $('.formError').show();
        }
  })
}

app.changePasswordFormHandler = function(payload) {
    app.client(undefined, '/api/ninjas/changePassword/', 'PUT',undefined, payload, function(statusCode, response) {
          if(statusCode == 200)
          {
            document.querySelector('.formSuccess').innerHTML = response.msg;
            $('.formSuccess').show();
          }
          else
          {
            document.querySelector('.formError').innerHTML = response.Error;
            $('.formError').show();
          }
    })
}

app.signupNinjaFormHandler = function(payload) {
    // TODO: ADD JS VALIDATION
    console.log(payload);
    app.client(undefined, '/auth/signup/', 'POST', undefined, payload, function(statusCode, response) {
        if(statusCode == 200)
        {
            app.loginNinjaFormHandler(response);
        }
        else {
            $('.formError').html(response.Error);
            $('.formError').show();
        }
    })
}

app.loginNinjaFormHandler = function(payload) {
    app.client(undefined,'/auth/login/','POST',undefined,payload, function(statusCode, res) {
        if(statusCode == 200)
        {
          localStorage.setItem('token', res.token);
          window.location = '/';

        }
        else
        {
            document.querySelector('.formError').innerHTML = res.Error;
            $('.formError').show();
        }
    })
}

app.getNinjaFormHandler = function(queryString) {
    var tbody = document.querySelector('table > tbody');
    tbody.innerHTML = '';
    var url = '/api/ninjas/?lat='+queryString.lat+'&lng='+queryString.lng;
    $.getJSON(url,(data) => {
      $('.showNinjas').show()
      data.forEach(function(ninja, index) {
          var name = ninja.name;
          var available = ninja.available;
          var rank = ninja.rank;
          var dist = ninja.dist.calculated;
          //make rows

          var tr = tbody.insertRow(-1);
          var td0 = tr.insertCell(0);
          var td1 = tr.insertCell(1);
          var td2 = tr.insertCell(2);

          td0.innerHTML = name;
          td1.innerHTML = rank;
          td2.innerHTML = Math.round(dist * 1000)/1000 + 'KM';

          tr.classList.add(available);
      })
    })
}

// TODO: set the token to self destruct after 1 hour and in the backend
app.logout = function() {
    $('.logoutBtn').on('click', () => {
        var token = localStorage.getItem('token');
        app.client(undefined, '/auth/logout/', 'POST', undefined, undefined, function(statusCode, res) {
            console.log(statusCode, res);
            if(statusCode == 200) {
                localStorage.removeItem('token');
                window.location = '/login';
            }
        })
    })
}

window.onload = function() {
  app.config.token = localStorage.getItem('token');
  app.bindForms()
  app.dropdown()
  app.checkAuth();
  app.logout();
  app.retrieveUser(); // TODO: fire this after every 2 min to check for the token in the both ends
  $('.showNinjas').hide()
}
