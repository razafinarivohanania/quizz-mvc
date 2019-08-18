(function () {
    function redirectToLink() {
        var link = this.dataset.href;
        window.location.href = link;
    }

    var buttonElements = document.querySelectorAll('button[data-role="link"]');
    for (var i = 0; buttonElements.length; i++) {
        var buttonElement = buttonElements[i];
        buttonElement.onclick = redirectToLink;
    }
})();