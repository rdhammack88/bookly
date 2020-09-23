/**
 * Event Listeners
 */

/** Called when user clicks on the browser action button */
chrome.browserAction.onClicked.addListener((tab) => {
    console.log('clicked');

    // chrome.bookmarks.getTree((bookmarks) => {
    //     const books = bookmarks[0].children;
    //     console.log(books);
    // });

    // const openTabs = queryTabs();
    // console.log(openTabs);

    // console.log(queryTabs());

    // createBookmarkFolder();

    queryTabs();

})

/** Called when new bookmark has been created */
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    console.log('id: ', id);
    console.log('bookmark: ', bookmark);

    saveBookmarks(id, queryTabs);
    // const openTabs = queryTabs();
    // console.log(openTabs);
});

/**
 * Functions
 */

/**
 * Creates a NEW bookmark folder to save ALL open tabs to
 */
const createBookmarkFolder = (tabs) => {
    let date = new Date();
    let fullDate = date.toDateString().split(' ').join('-');
    console.log(tabs);

    chrome.bookmarks.create({
        parentId: '2',
        title: `Tabs-from-${fullDate}`
    })

}

/**
 * Queries ALL open tabs
 */
const queryTabs = () => {
    console.log('Querying tabs');
    /**
     * Query open tabs and save to a JSON file
     */
    return chrome.tabs.query({}, (tabs) => {
        const openTabs = tabs.map((tab) => ({
            title: tab.title,
            url: tab.url,
            private: tab.incognito
        }));
        console.log(openTabs);
        // return saveBookmarks(openTabs);

        return createBookmarkFolder(openTabs);
        // saveTabsToFile(openTabs);
    });
}

/**
 * Saves ALL open tabs to previously created bookmarks folder
 * @param {obj} tabs 
 */
const saveBookmarks = (id, tabs) => {
    console.log('Saving Bookmarks');
    console.log('id: ', id);
    console.log('tabs: ', tabs());
    // const openTabs = queryTabs();
    // console.log(openTabs);
}

/**
 * Saves ALL open tabs to JSON file
 * @param {obj} openTabs 
 */
const saveTabsToFile = (openTabs) => {
    console.log('Tabs saved to file');
    return chrome.tabs.executeScript({
        code: `
            var tabsInfo = ${JSON.stringify(openTabs)};
            var date = new Date();
            var fullDate = date.toDateString().split(' ').join('-');

            function saveText(text, filename) {
                var a = document.createElement('a');
                a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
                a.setAttribute('download', filename);
                a.click();
            }
            saveText(JSON.stringify(tabsInfo, null, 2), 'tabs-' + fullDate + '.json');
        `,
    });
}

// /**
//  * Iterate through all bookmarks
//  */
// const scanBookmarks = (bookmarks) => {
//     let totalBookmarks = 0;
//     let totalFolders = 0;

//     const myBookmarksObj = bookmarks[0].children
//     const myBookmarks = myBookmarksObj.map(bookmark => {
//         // return bookmark;
//         if (bookmark.children) {
//             // return bookmark.children.length;
//             // return totalFolders++;
//             return scanBookmarks(bookmark.children);

//         } else if (bookmark.url) {
//             // return bookmark.url;    
//             return totalBookmarks++;
//         }
//     });
//     console.log(myBookmarks);
//     console.log(bookmarks);
// }