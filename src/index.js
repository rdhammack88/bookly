/**
 * Recursive call to retrieve all bookmarks and bookmark folders
 * Initial call in getBookmarks()
 * @param {obj} bookmarkData
 * @param {obj} bookmarks
 */
const scanBookmarks = (bookmarkData, bookmarks) => {
    if (bookmarks.url) {
        bookmarkData.totalBookmarks++;
        bookmarkData.bookmarks.push(bookmarks);
    }

    if (bookmarks.children) {
        bookmarks.children.forEach((bookmark) => {
            bookmarkData.totalFolders++;
            bookmarkData.bookmarkFolders.push(bookmarks);
            // document.getElementById('bookmarkList').innerHTML += `<li>${bookmark.title}</li>`;
            return scanBookmarks(bookmarkData, bookmark);
        });
    }
    return bookmarkData;
};

/**
 * Iterate through all bookmarks
 * Initialize bookmarkData to keep track of count
 * Initialized upon user action click
 */
const getBookmarks = () => {
    let bookmarkData = {
        totalBookmarks: 0,
        totalFolders: 0,
        bookmarkFolders: [],
        bookmarks: [],
    };

    // document.getElementById('test').innerText = 'This is a test from the JS file....';

    chrome.bookmarks.getTree((bookmarks) => {
        console.log('Bookmarks: ', bookmarks);

        bookmarks.forEach((bookmark) => {
            return scanBookmarks(bookmarkData, bookmark);
        });

        console.log('Finished Scanning Bookmarks!');
        console.log('Bookmark Data: ', bookmarkData);
        // const bookmarkDataStringified = JSON.stringify(bookmarkData);
        // console.log('Bookmark Data Stringified: ', JSON.stringify(bookmarkData));

        // console.log('Bookmark Data Stringified: ', JSON.stringify(bookmarkData));

        document.getElementById('total-bookmarks').innerText = bookmarkData.totalBookmarks;
        document.getElementById('total-folders').innerText = bookmarkData.totalFolders;
    });
};

/**
 * searchBookmarks
 */
const searchBookmarks = (query = '') => {
    const bookmarkData = {
        bookmarks: [],
        duplicateBookmarks: [],
    };
    chrome.bookmarks.search(query, (bookmarkNodes) => {
        console.log('Searching for bookmarks that include: ', query);
        console.log('Bookmark Node Length: ', bookmarkNodes.length);
        console.log('Bookmark Nodes: ', bookmarkNodes);

        bookmarkNodes.forEach((node) => {
            if (!bookmarkData.bookmarks.includes(node.url)) {
                bookmarkData.bookmarks.push(node.url);
            } else if (bookmarkData.bookmarks.includes(node.url)) {
                bookmarkData.duplicateBookmarks.push(node.url);
            }
        });

        console.log('Bookmarks length: ', bookmarkData.bookmarks);
        console.log('Duplicate Bookmarks length: ', bookmarkData.duplicateBookmarks);
    });
};

const getDuplicateFolders = () => {};

const getDuplicateBookmarks = () => {};

// getBookmarks();

document.addEventListener('DOMContentLoaded', getBookmarks);
document.getElementById('search').addEventListener('click', (e) => {
    e.preventDefault();
    const query = document.getElementById('query').value;
    console.log(query);
    searchBookmarks(query);
});
