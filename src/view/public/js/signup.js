(function(){
    var formElement = document.getElementById('div#signup form');

    function areFieldsValid(){
        var nameElement = document.getElementById('div#signup input[name="name"]');
        nameElement.value = nameElement.value.trim();
        if (!nameElement.value){
            alert('Name is blank');
        }
    }

    formElement.onsubmit = function(){
        return areFieldsValid();
    }
})();