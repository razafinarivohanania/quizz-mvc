(function () {
    function changeLanguage() {
        var url = '/rest/set-language/' + this.value;

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                if (response.success)
                    location.reload();
                else
                    alert('Error occured on changing language : ' + response.error);
            });
    }

    var languageElements = document.querySelectorAll('div#quizz-language input[id*="quizz-language"]');
    for (var i = 0; i < languageElements.length; i++) {
        var languageElement = languageElements[i];
        languageElement.onclick = changeLanguage;
    }
})();