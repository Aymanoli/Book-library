// Total search result found from server
const totalSearchResult = totalFound => {
    const len = document.getElementById('total-search-result');
    len.innerText = totalFound;
}

// Display loading spinner
const toggleSpinner = displayStyle => {
    document.getElementById('loading-screen').style.display = displayStyle;
}
// Display contents during loading spinner
const displayContent = displayStyle => {
    document.getElementById('container').style.display = displayStyle;
}

// Error message and clear contents
const warnningMsg = displayStyle => {
    if (displayStyle === 'block') {
        const content = document.getElementById('container')
        content.textContent = '';
        totalSearchResult('0');
    }
    document.getElementById('error-img').style.display = displayStyle;
}

// get Search value
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('search-value');
    toggleSpinner('block');
    warnningMsg('none');
    displayContent('none');
    // console.log(searchValue.value);
    loadData(searchValue.value);
    searchValue.value = '';
})

// API load
const loadData = async subject => {
    const url = `https://openlibrary.org/search.json?q=${subject}`;
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data.docs);
    if (data.docs.length)
        dataProcess(data.docs);
    else {
        toggleSpinner('none');
        warnningMsg('block');
    }
}

// load contents
const dataProcess = info => {
    try {
        const container = document.getElementById('container');
        container.textContent = '';
        info.forEach(data => {
            const bookCover = data.cover_i ? `https://covers.openlibrary.org/b/id/${data.cover_i}-M.jpg` : '../img/cover_not_found.png';
            const bookName = data.title;
            const authorName = Array.isArray(data.author_name) ? data.author_name[0] : data.author_name;
            const publisherName = Array.isArray(data.publisher) ? data.publisher[0] : data.publisher;
            const firstPublish = data.first_publish_year ? data.first_publish_year : 'Not found';

            if (authorName && publisherName) {
                const content = document.createElement('div');
                content.classList.add('col-12', 'col-lg-3', 'col-md-4', 'text-center', 'text-white');
                content.innerHTML = `
                    <img id="book-cover" src="${bookCover}">
                    <h4 id="book-name">${bookName}</h4>
                    <h6 id="book-author">Author: ${authorName}</h6>
                    <h6 id="book-publisher">Publisher: ${publisherName}</h6>
                    <p id="book-first-publish">First published: ${firstPublish}</p>
                `;
                container.appendChild(content);
            }
            else {
                console.log('Not found');
            }
            totalSearchResult(info.length);
        });
        toggleSpinner('none');
        warnningMsg('none');
        displayContent('flex');
    } catch (error) {
        console.log(error);
        toggleSpinner('none');
        displayContent('flex');
        warnningMsg('block');
    }
}