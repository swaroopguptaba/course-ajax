(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        //get image
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID A1GsjrIcqgwWg3Dp9nWSD8UC-h2mSlJu2l8WpxdMzho'
            }
        })
        .then(response => response.json())
        .then(addImage)
        .catch(e => requestError(e, 'image'));

        //get articles
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=Z55WdYHHsw36DtokWpXnG3Pyew02e0Cm`)
        .then(response => response.json())
        .then(addArticles)
        .catch(e => requestError(e, 'articles'));

    });

    function addImage(data) {
        let htmlContent = '';
        const firstImage = data.results[0];
    
        if (firstImage) {
            htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = 'Unfortunately, no image was returned for your search.'
        }
    
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles (data) {
        let htmlContent = '';

        if(data.response && data.response.docs && data.response.docs.length> 1){
            htmlContent = '<ul>' + data.response.docs.map(
                article => `<li class="article"> 
                    <h2><a href ="${article.web_url}"> ${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                    </li>`
            ).join('') +
            '</ul>';
        }else{
            htmlContent = '<div class="error-no-articles"> No articles available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }

})();
