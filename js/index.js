const urlInput = $('.url #url');
const urlInputLabel = $('#submit-container .url');

var savedUrl = window.localStorage;
var currentUrl = [];

// Create saved element on local Storage
function reCreateEleFromSaved() {
    if(localStorage.getItem(savedUrl) !== null) {
        var newArray = localStorage.getItem(savedUrl).split(',');
        for (let i = 0; i < newArray.length; i+=2) {
            createElement(newArray[i],newArray[i+1]);
        }
        $('.button#clearlist-btn').attr('style','margin:0 auto; display:block');
    }
}
reCreateEleFromSaved()
// Template idlink
var idLink = "";
// Action when press Enter
urlInput.keyup(function(e){
    var urlShorten = "";
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        if(checkIfExit() > -1) {
            alert('Already Shorten');
            urlInput.val('');
        } else {
            if (urlInput.val() == "") {
                urlInputLabel.attr('data-error','true');
            } else {
                urlInputLabel.attr('data-error','none');
                var myUrl = urlInput.val();
                sendUrl(myUrl);
            }
        }
    }
})
// Get all current Url...
function getAllUrl() {
    var current = [];
    for (let i = 0; i < $('.list-item .your-url').length ; i++) {
        current.push($('.list-item .your-url')[i].innerHTML);
    }
    return current;
}


// Check if current Input already exit...

function checkIfExit() {
    var newUrlInput = urlInput.val();
    var current = [];
    var index = -1;
    current = getAllUrl();
    for (let i = 0 ; i < current.length ; i++ ) {
        if (current[i] == newUrlInput) {
            index = i;
        } 
    }
    return index;
}

// Action on button submit
$('.button.submit-btn').click(function(){
    var urlShorten = "";
    if(checkIfExit() > -1) {
        alert('Already Shorten');
        urlInput.val('');
    } else {
        if (urlInput.val() == "") {
            urlInputLabel.attr('data-error','true');
        } else {
            urlInputLabel.attr('data-error','none');
            var myUrl = urlInput.val();
            sendUrl(myUrl);
        }
    }
})

// Create Element
function createElement(yourUrl,urlShorten) {
    var newItemEle = document.createElement('div');
    var myUrlEle = document.createElement('span');
    var shortenEle = document.createElement('a');
    var copyBtnEle = document.createElement('button');
    // Adding Class, ID...
    newItemEle.setAttribute('class','list-item');
    myUrlEle.setAttribute('class','your-url');
    shortenEle.setAttribute('class','url-shorten');
    shortenEle.setAttribute('href',urlShorten);
    shortenEle.setAttribute('target','_blank');
    copyBtnEle.setAttribute('class','button copy-btn');
    copyBtnEle.setAttribute('data-copy','none');
    copyBtnEle.setAttribute('onclick','copyText(this)');
    // Adding Content...
    myUrlEle.innerHTML = yourUrl;
    shortenEle.innerHTML = urlShorten;
    copyBtnEle.innerHTML = 'Copy';
    // Adding element to element...
    newItemEle.appendChild(myUrlEle);
    newItemEle.appendChild(shortenEle);
    newItemEle.appendChild(copyBtnEle);
    // Adding all item to container...
    document.getElementById('list-url').insertBefore(newItemEle,document.getElementById('list-url').firstChild);
    // If there are 5 more item, delete oldest element...
    if (document.getElementById('list-url').childElementCount > 5) {
        $('#list-url .list-item')[5].remove();
    }
}

// Send AJAX
function sendUrl(url) {
    var myObj = {
        'url' : url,
    }
    $.post('https://rel.ink/api/links/',myObj,function(data){
        idLink = data.hashid;
    }).done(function(){
        var shortenUrl = "https://rel.ink/" + idLink;
            urlInputLabel.attr('data-error','none');
            createElement(url,shortenUrl);
            currentUrl.push(url,shortenUrl);
            if (currentUrl.length > 11) {
                currentUrl.shift();
                currentUrl.shift();
            }
            localStorage.setItem(savedUrl,currentUrl);
            urlInput.val('');
            $('.button#clearlist-btn').attr('style','margin:0 auto; display:block');
    }).fail(function(){
        urlInputLabel.attr('data-error','true');
    })
}

// Clear list
$('.button#clearlist-btn').click(function(){
    $('#list-url .list-item').remove();
    localStorage.clear(savedUrl);
    currentUrl = [];
    $('.button#clearlist-btn').attr('style','margin:0 auto; display:none')
})

// Copy button
function copyText(element) {
    $('.button.copy-btn').attr('data-copy','none');
    $('.button.copy-btn').html('Copy');
    element.setAttribute('data-copy','copied');
    element.innerHTML = "Copied";
    
    // Copy Shorten Link
    var textToCopy = element.previousElementSibling;
    document.addEventListener('copy',function(e){
        e.clipboardData.setData('text/plain', textToCopy);
        e.preventDefault();
    },true)
    document.execCommand('copy');
}