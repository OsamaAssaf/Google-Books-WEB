$(document).ready(function () {

    const searchButton = $('#search-btn');
    const clearSearchButton = $('#clear-btn');
    const searchInput = $('#search-text');
    const listOfBooks = $('#list-of-books');

    searchButton.click(searchForBooks);
    clearSearchButton.click(clearSearchText);
    searchInput.keypress(function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    function searchForBooks() {
        if (searchInput.val() === '') {
            return;
        }
        $('#initial-text').removeClass('show');

        listOfBooks.html('');
        const progressBar = $('#progress-bar');
        const errorMsg = $('#error-msg');
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput.value}`;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                progressBar.hide();
                if (this.status === 200) {
                    errorMsg.hide();
                    showBooks(this.responseText);
                } else {
                    errorMsg.show();
                }
            } else {
                progressBar.show();
            }
        }
        xhttp.open('GET', url, true);
        xhttp.send();
    }

    function clearSearchText() {
        searchInput.val('');
    }


    function showBooks(response) {

        const json = JSON.parse(response);

        json.items.forEach(function (book) {
            const bookTitle = book.volumeInfo.title ?? 'No Title Available';
            const bookSubtitle = book.volumeInfo.subtitle ?? 'No Subtitle Available';
            const description = book.volumeInfo.description ?? 'No Description Available';
            const imageURL = book.volumeInfo.imageLinks.smallThumbnail ?? '';
            const authors = book.volumeInfo.authors ?? ['No Authors Available'];
            const pageCount = book.volumeInfo.pageCount ?? 'Unknown';
            const language = book.volumeInfo.language ?? 'Unknown';
            const publishedDate = book.volumeInfo.publishedDate ?? 'Published Date Not Available';
            const link = book.volumeInfo.infoLink ?? '';
            const newBook = new BookModel(bookTitle, bookSubtitle, description, imageURL, authors, pageCount, language, publishedDate, link);

            listOfBooks.append(newBook.buildBookCard())

        });

    }

});

class BookModel {
    constructor(title, subtitle, description, imageURL, authors, pageCount, language, publishedDate, link) {
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.imageURL = imageURL;
        this.authors = authors;
        this.pageCount = pageCount;
        this.language = language;
        this.publishedDate = publishedDate;
        this.link = link;
    }

    buildBookCard() {
        const card = $('<div></div>').attr('class', 'card');

        const image = $('<img>').attr('src', this.imageURL).on('error', function () {
            image.attr('src', 'images/no_image_available.jpeg');
        });

        const column = $('<div></div>').attr('class', 'col');

        const title = $('<h4></h4>').attr('class', 'title').attr('title', this.title).text(this.title);

        const subTitle = $('<p></p>').attr('class', 'sub-title').attr('title', this.subtitle).text(this.subtitle);

        const moreInfoButton = $('<button></button>').attr('class', 'more-info').text('More Info').click(() => {
            const infoDialog = $('#info-dialog');
            this.buildInfoDialog();
            infoDialog[0].showModal();
            $('#close-model').click(function () {
                infoDialog[0].close();
            });
        });

        column.append(title);
        column.append(subTitle);
        column.append(moreInfoButton);

        card.append(image);
        card.append(column);

        return card;
    }

    buildInfoDialog() {
        const infoDialogContent = $('#info-dialog .content');
        infoDialogContent.empty();

        // Row 1 Start
        const row1 = $('<div></div>').attr('class', 'row-1');
        const image = $('<img>').attr('src', this.imageURL).on('error', function () {
            image.setAttribute('src', 'images/no_image_available.jpeg');
        });
        const column = $('<div></div>');
        const title = $('<h4></h4>').attr('class', 'title').text(this.title);
        const subTitle = $('<p></p>').attr('class', 'sub-title').text(this.subtitle);
        column.append(title);
        column.append(subTitle);
        row1.append(image);
        row1.append(column);
        infoDialogContent.append(row1);
        // Row 1 End

        // Row 2 Start
        const row2 = $('<div></div>').attr('class', 'row-2');
        const dl = $('<dl></dl>');
        const dt = $('<dt></dt>').text('Authors:');
        dl.append(dt);
        this.authors.forEach(function (author) {
            const dd = $('<dd></dd>').text(author);
            dl.append(dd);
        });
        row2.append(dl);
        infoDialogContent.append(row2);
        // Row 2 End

        // Row 3 Start
        const row3 = $('<div></div>').attr('class', 'row-3');
        const description = $('<p></p>').attr('class', 'description').text(this.description);
        row3.append(description);
        infoDialogContent.append(row3);
        // Row 3 End

        // Row 4 Start
        const row4 = $('<div></div>').attr('class', 'row-4');
        const ul = $('<ul></ul>');
        const rowArray = [
            {
                title: 'Number Of Page: ',
                value: this.pageCount
            },
            {
                title: 'Language: ',
                value: this.language
            },
            {
                title: 'Published Date: ',
                value: this.publishedDate
            },
        ];
        rowArray.forEach(function (value) {
            const li = $('<li></li>');
            const titleSpan = $('<span></span>').text(value.title);
            const valueSpan = $('<span></span>').text(value.value);
            li.append(titleSpan);
            li.append(valueSpan);
            ul.append(li);
        });
        row4.append(ul);
        infoDialogContent.append(row4);
        // Row 4 End

        // Row 5 Start
        const row5 = $('<div></div>').attr('class', 'row-5');
        const a = $('<a></a>').attr('href', this.link).attr('target', '_blank').text('Open On Store');
        row5.append(a);
        infoDialogContent.append(row5);
        // Row 5 End
    }
}