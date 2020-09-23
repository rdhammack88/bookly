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
            return scanBookmarks(bookmarkData, bookmark);
        })
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
        bookmarks: []
    };

    chrome.bookmarks.getTree((bookmarks) => {
        console.log('Bookmarks: ', bookmarks);

        bookmarks.forEach((bookmark) => {
            return scanBookmarks(bookmarkData, bookmark);
        });

        console.log('Finished Scanning Bookmarks!');
        console.log('Bookmark Data: ', bookmarkData);
        const bookmarkDataStringified = JSON.stringify(bookmarkData);
        // console.log('Bookmark Data Stringified: ', JSON.stringify(bookmarkData));

        // console.log('Bookmark Data Stringified: ', JSON.stringify(bookmarkData));

        document.getElementById('total-bookmarks').innerHTML = bookmarkData.totalBookmarks;
        document.getElementById('total-folders').innerHTML = bookmarkData.totalFolders;



    });
};

// getBookmarks();