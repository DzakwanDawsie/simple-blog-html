function getArticles() {
  return articles;
}

function generateArticleElement(articleData) {
  // Article element
  var article = document.createElement('article');
  article.className = 'article';

  // Article Header element
  var articleHeader = document.createElement('div');
  articleHeader.className = 'article-header';

  // Article Header Photo element
  var articleHeaderPhoto = document.createElement('div');
  articleHeaderPhoto.className = 'article-header-photo';

  var articleHeaderPhotoImg = document.createElement('img');
  articleHeaderPhotoImg.src = articleData.user.photo;

  articleHeaderPhoto.appendChild(articleHeaderPhotoImg);

  // Article Header Detail element
  var articleHeaderDetail = document.createElement('div');
  articleHeaderDetail.className = 'article-header-detail';

  var articleHeaderDetailUsername = document.createElement('div');
  articleHeaderDetailUsername.className = 'article-header-detail-username';
  articleHeaderDetailUsername.innerText = articleData.user.name;

  var articleHeaderDetailDatetime = document.createElement('div');
  articleHeaderDetailDatetime.className = 'article-header-detail-datetime';
  articleHeaderDetailDatetime.innerText = articleData.detail.timestamp;

  articleHeaderDetail.appendChild(articleHeaderDetailUsername);
  articleHeaderDetail.appendChild(articleHeaderDetailDatetime);

  articleHeader.append(articleHeaderPhoto);
  articleHeader.append(articleHeaderDetail);

  // Article Body element
  var articleBody = document.createElement('div');
  articleBody.className = 'article-body';

  var articleBodyTitle = document.createElement('span');
  articleBodyTitle.className = 'article-body-title';
  articleBodyTitle.innerText = articleData.detail.title;

  var articleBodyContent = document.createElement('span');
  articleBodyContent.className = 'article-body-content';
  articleBodyContent.innerText = articleData.detail.content;

  var articleBodyPicture = document.createElement('div');
  articleBodyPicture.className = 'article-body-picture';

  var articleBodyPictureImg = document.createElement('img');
  articleBodyPictureImg.src = articleData.detail.img;

  articleBodyPicture.appendChild(articleBodyPictureImg);

  var articleBodyTag = document.createElement('div');
  articleBodyTag.className = 'article-body-tag';

  articleData.detail.tags.forEach(tag => {
    var articleBodyTagAnchor = document.createElement('a');
    articleBodyTagAnchor.href = 'javascript:void(0)';
    articleBodyTagAnchor.innerText = '#'.concat(tag);

    articleBodyTag.appendChild(articleBodyTagAnchor);
  });

  articleBody.appendChild(articleBodyTitle);
  articleBody.appendChild(articleBodyContent);
  articleBody.appendChild(articleBodyPicture);
  articleBody.appendChild(articleBodyTag);

  article.appendChild(articleHeader);
  article.appendChild(articleBody);

  return article;
}

function showLoader(show = true) {
  const loader = document.getElementById('loader');
  const body = document.getElementsByTagName('body').item(0);

  if (show) {
    loader.className = loader.className.concat(' ', 'show');
    body.className = 'disable';
  } else {
    loader.className = loader.className.replace(' ', '').replace('show', '');
    body.className = '';
  }
}

function loadArticles(query = {}) {
  showLoader();

  const divContentBody = document.getElementById('content-body');

  let articles = getArticles();

  console.log(query.tag);
  
  if (query.tag) articles = articles.filter(article => article.detail.tags.some(tag => tag.toLowerCase() == query.tag.toLowerCase()));

  if (query.search) articles = articles.filter(article => {
    const titleSearching = article.detail.title.toLowerCase().includes(query.search.toLowerCase());
    const contentSearching = article.detail.content.toLowerCase().includes(query.search.toLowerCase());
    const tagSearching = article.detail.tags.some(tag => tag.toLowerCase().includes(query.search.toLowerCase()));

    const perWordChecking = query.search.split(' ').some(text => {
      const titleSearching = article.detail.title.toLowerCase().includes(text.toLowerCase());
      const contentSearching = article.detail.content.toLowerCase().includes(text.toLowerCase());
      const tagSearching = article.detail.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()));

      return titleSearching || contentSearching || tagSearching;
    })

    return titleSearching || contentSearching || tagSearching || perWordChecking;
  });

  articles = articles.sort((a, b) => a.detail.timestamp > b.detail.timestamp ? 1 : -1);

  setTimeout(() => {
    divContentBody.innerHTML = '';

    for (const article of articles) {
      divContentBody.appendChild(generateArticleElement(article));
    }
    showLoader(false);
  }, 1000);
}

function loadArticleTags() {
  const articles = getArticles();
  const tags = [];

  articles.forEach(article => article.detail.tags.forEach(tag => {
    if (!tags.some(tagI => tagI.name == tag)) {
      const countArticle = articles.filter(article => article.detail.tags.includes(tag)).length;
    
      const countUser = articles.filter(article => article.detail.tags.includes(tag))
                                .filter((article, index, self) => index === self.findIndex(articleSub => articleSub.user.name == article.user.name))
                                .length;
                                
      tags.push({ name: tag, countArticle: countArticle, countUser: countUser});
    }
  }));

  const popularTags = tags.sort((tagA, tagB) => (tagA.countArticle > tagB.countArticle) ? -1 : 1).slice(0, 4);
  
  const popularTopicBody = document.getElementById('popular-topic');

  const popularTopicBodyUl = document.createElement('ul');

  popularTags.forEach(tag => {
    const popularTopicBodyUlLi = document.createElement('li');

    const popularTopicBodyUlLiSpanTitle = document.createElement('span');
    popularTopicBodyUlLiSpanTitle.className = 'title';
    popularTopicBodyUlLiSpanTitle.innerText = '#'.concat(tag.name);

    const popularTopicBodyUlLiSpanDetail = document.createElement('span');
    popularTopicBodyUlLiSpanDetail.className = 'detail';
    popularTopicBodyUlLiSpanDetail.innerText = ('').concat(tag.countArticle, ' ', 'articles', ' / ', tag.countUser, ' ', 'users');

    popularTopicBodyUlLi.appendChild(popularTopicBodyUlLiSpanTitle);
    popularTopicBodyUlLi.appendChild(popularTopicBodyUlLiSpanDetail);

    popularTopicBodyUl.appendChild(popularTopicBodyUlLi);
  })
  
  popularTopicBody.appendChild(popularTopicBodyUl);

  const popularTagElements = document.querySelectorAll('.popular-topic-body > ul > li');
  popularTagElements.forEach(element => element.addEventListener('click', function() {
    const tag = String(element.firstChild.innerText).replace('#', '');
    loadArticles({ tag });

    popularTagElements.forEach(elementB => {
      elementB.className = '';

      if (this.firstChild.innerText == elementB.firstChild.innerText) elementB.className = 'active';
    })
  }))
}

function getUserDeviceOS() {
  const deviceUserAgent = navigator.userAgent;

  if (!!deviceUserAgent.match(/Windows/)) return 'Windows';

  if (!!deviceUserAgent.match(/Mac OS/)) return 'macOS';
  
  return 'Unknown';
}

document.addEventListener('DOMContentLoaded', function() { 
  loadArticles();
  loadArticleTags();

  const userDeviceOS = getUserDeviceOS();
  
  if (userDeviceOS == 'Windows') document.getElementById('searchbar').className = 'searchbar windows';
  else if (userDeviceOS == 'macOS') document.getElementById('searchbar').className = 'searchbar macOS';
  else document.getElementById('searchbar').className = 'searchbar';
});

var isSearchbarShowed = false;
var isCtrlPressed = false;

function showSearchBar(toggle = true) {
  if (toggle) {
    document.getElementById('floating-searchbar').style.display = 'block'
    document.getElementById('searchInput').focus();

    isSearchbarShowed = true;
  } else {
    document.getElementById('floating-searchbar').style.display = 'none'
    document.getElementById('searchInput').blur();

    isSearchbarShowed = false;
  }
}

document.addEventListener('keydown', function(e) { 
  const userDeviceOS = getUserDeviceOS();

  if (isCtrlPressed && e.key == '/') {
    if (!isSearchbarShowed) showSearchBar();
    else showSearchBar(false);
  }

  if (userDeviceOS == 'Windows' && e.ctrlKey) isCtrlPressed = true;
  else if (userDeviceOS == 'macOS' && e.metaKey) isCtrlPressed = true;
  else isCtrlPressed = false;
})

function clearSelectedTag() {
  const popularTagElements = document.querySelectorAll('.popular-topic-body > ul > li');
  popularTagElements.forEach(element => {
    element.className = '';
  })
}

function scrollFunction() {
  let scrollBtn = document.getElementById('scrollToTopBtn');
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }
}


window.onscroll = function() { scrollFunction() };

document.getElementById('scrollToTopBtn')
        .addEventListener('click', function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });

document.getElementById('floating-searchbar')
        .addEventListener('click', function() {
          showSearchBar(false);
        })

document.getElementById('floating-searchbar-box')
        .addEventListener('click', function(e) {
          if (e.offsetX > this.offsetWidth - 86 && e.offsetX < this.offsetWidth - 20) document.getElementById('searchInput').dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
          else e.stopPropagation();
        })

document.getElementById('searchInputBtn')
        .parentElement
        .addEventListener('click', function() {
          showSearchBar();
        })

document.getElementById('searchInput')
        .addEventListener('keyup', function(e) {
          if (e.key != 'Enter') return false;

          loadArticles({ search: this.value });
          clearSelectedTag();
          showSearchBar(false);
        })