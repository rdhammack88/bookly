/**
 * 
 * WORKING VERSION 1.0
 * 
 * Currently Working -
 *   - Creates Bookmark Folder (Index of parent folder not what is expected though)
 *   - Saves All opened tabs to JSON file
 *   - Saves All opened tabs to previously created Bookmark folder
 *   __ NEEDS CLEANED __
 *      -- CONSOLE LOGS EVERYWHERE -- 
 *      -- UNUSED CODE (COMMENTED OUT) EVERYWHERE -- 
 */


/**
 * Functions
 */

/**
 * Queries ALL open tabs
 */
// const queryTabs = (id, bookmark) => {
const queryTabs = (tab) => {
    console.log('Querying tabs');
    console.log('Tab: ', tab);
    /**
     * Query open tabs and save to a JSON file
     */
    chrome.tabs.query({}, createBookmarkFolder)
    // chrome.tabs.query({}, (tabs) => {
    //     // const openTabs = tabs.map((tab) => ({
    //     //     title: tab.title,
    //     //     url: tab.url,
    //     //     private: tab.incognito
    //     // }));
    //     // console.log(openTabs);

    //     // return saveBookmarks(id, bookmark, openTabs);

    //     // return createBookmarkFolder(openTabs);
    //     // saveTabsToFile(openTabs);


    //     console.log(tabs);
    //     saveBookmarks(tabs);
    // });
}

/**
 * Creates a NEW bookmark folder to save ALL open tabs to
 */
const createBookmarkFolder = (tab) => {
    const date = new Date();
    const fullDate = date.toDateString().split(' ').join('-');
    // const openTabs = queryTabs();
    // console.log('Opened Tabs: ', openTabs);

    console.log(tab);
    console.log('Creating Bookmarks Folder');
    chrome.bookmarks.create({
        parentId: '2',
        title: `Tabs-from-${fullDate}`,
        index: 0
    });
}

// const createBookmark = (tab, id) => {
//     return chrome.bookmarks.create({
//         parentId: id,
//         title: tab.title,
//         url: tab.url
//     })
// }

/**
 * Saves ALL open tabs to previously created bookmarks folder
 * @param {obj} tabs 
 */
// const saveBookmarks = (id, bookmark, openTabs) => {
// const saveBookmarks = (tabs) => {
const saveBookmarks = (id, bookmark) => {
    console.log('Saving Bookmarks');
    console.log('ID: ', id);
    console.log('Bookmark: ', bookmark);

    if (bookmark.url) {
        return;
    }

    chrome.tabs.query({}, (tabs) => {
        console.log('id - ', id);
        console.log('tabs - ', tabs);

        console.log('Saving Tabs to file');
        saveTabsToFile(tabs);

        console.log('Saving Tabs to Bookmarks folder');
        tabs.forEach(tab => {
            // console.log('id - ', id);
            chrome.bookmarks.create({
                parentId: id,
                title: tab.title,
                url: tab.url
            })
        })
    })

    console.log('Bookmarks saved!');

    // console.log('id: ', id);
    // console.log('bookmark: ', bookmark);
    // console.log('Open Tabs: ', openTabs.length);
    // console.log('Open Tabs: ', openTabs);
    // // const openTabs = queryTabs();
    // // console.log(openTabs);

    // openTabs.forEach((tab) => {
    //     return createBookmark(tab, id)
    // })
    // // for (let i = 0; i <= openTabs.length; i++) {
    // //     console.log(openTabs);

    // //     chrome.bookmarks.create({
    // //         parentId: id,
    // //         title: openTabs[i].title,
    // //         url: openTabs[i].url
    // //     })
    // // }
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



/**
 * Event Listeners
 */

/** Called when user clicks on the browser action button */
chrome.browserAction.onClicked.addListener(createBookmarkFolder)
// chrome.browserAction.onClicked.addListener((tab) => {
//     // console.log('clicked');
//     createBookmarkFolder()

// })

/** Called when new bookmark has been created */
chrome.bookmarks.onCreated.addListener(saveBookmarks)
// chrome.bookmarks.onCreated.addListener((id, bookmark) => {
//     // return queryTabs(id, bookmark);

// })