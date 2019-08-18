(function () {
    var buttonElements = document.getElementById('button[data-role]');

    function handleLink(buttonElement) {

        buttonElement.onclick = function () {
            window.location.href = buttonElement.dataset.href;
        };
    }

    for (var i = 0; i < buttonElements.length; i++) {
        var buttonElement = buttonElements[i];

        const role = buttonElement.dataset.role;
        if (role === 'link')
            handleLink(buttonElement);
    }
})();