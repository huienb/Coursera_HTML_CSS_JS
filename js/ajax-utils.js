(function (global){
    
    //Set up a namespace for our utility
    var ajaxUtils = {};

    //Return an HTTP request object
    function getRequestObject(){
        if (window.XMLHttpRequest){ //most current object
            return (new XMLHttpRequest());
        }
        else {
            global.alert("Ajax is not supported!")
            return(null);
        }
    }

    //Make an Ajax GET request to 'requestURL'
    ajaxUtils.sendGetRequest = function (requestURL, responseHandler, isJsonResponse){
        var request = getRequestObject();
        request.onreadystatechange = function(){
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("GET", requestURL, true);//false means browser will execute synchronously and then browser will freeze waiting for this line done
        request.send(null); //for POST only
    };

    //Only calls user provided 'responseHandler' function if response is ready and not an error
    function handleResponse(request, responseHandler, isJsonResponse){
        if ((request.readyState == 4) //4 status are ready
        && (request.status == 200)){ //200 is the response status means everything is ok
            // responseHandler(request); //ex for ajax only


            //ex for json
            //Default to isJsonResponse = true
            if (isJsonResponse == undefined){
                isJsonResponse = true;
            }
            
            if (isJsonResponse) {
                responseHandler(JSON.parse(request.responseText));
            }
            else {
                responseHandler (request.responseText);
            }
        }
    }

    //Expose utility to the global object
    global.$ajaxUtils = ajaxUtils;
})(window);