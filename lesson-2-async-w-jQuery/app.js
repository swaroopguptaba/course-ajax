/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID A1GsjrIcqgwWg3Dp9nWSD8UC-h2mSlJu2l8WpxdMzho'
            }
        }).done(addImage)
          .fail(function (err){
            requestError(err,'image');
          });

          $.ajax({
            url : `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=Z55WdYHHsw36DtokWpXnG3Pyew02e0Cm`
          }).done(addArticles)
            .fail(function (err){
                requestError(err,'articles');
            });

    });

    function addImage(images){
        const firstImage = images.results[0];

        responseContainer.insertAdjacentHTML('afterbegin', `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`
        );
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
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
})();
