/**
 * Event Listeners
 */

/** Called when user clicks on the browser action button */
chrome.browserAction.onClicked.addListener((tab) => {
    // console.log('clicked');
    createBookmarkFolder()

})

/** Called when new bookmark has been created */
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    // return queryTabs(id, bookmark);
    let openTabs;

    chrome.tabs.query({}, (tabs) => {
        openTabs = tabs;
        // const openTabs = tabs.map((tab) => ({
        //     title: tab.title,
        //     url: tab.url,
        //     private: tab.incognito
        // }));
        console.log('Open Tabs: ', openTabs);
        console.log('id: ', id);
        console.log('tabs: ', tabs);
        // tabs.forEach((tab) => {
        //     console.log('id: ', id);
        //     console.log('URL: ', tab.url);
        //     chrome.bookmarks.create({
        //         parentId: id,
        //         title: tab.title,
        //         url: tab.url
        //     })
        // })
    });
    console.log('Open Tabs: ', openTabs);
})

/**
 * Functions
 */

/**
 * Queries ALL open tabs
 */
// const queryTabs = (id, bookmark) => {
//     // console.log('Querying tabs');
//     /**
//      * Query open tabs and save to a JSON file
//      */
//     chrome.tabs.query({}, (tabs) => {
//         const openTabs = tabs.map((tab) => ({
//             title: tab.title,
//             url: tab.url,
//             private: tab.incognito
//         }));
//         console.log(openTabs);
//         return saveBookmarks(id, bookmark, openTabs);

//         // return createBookmarkFolder(openTabs);
//         // saveTabsToFile(openTabs);
//     });
// }

/**
 * Creates a NEW bookmark folder to save ALL open tabs to
 */
const createBookmarkFolder = () => {
    const date = new Date();
    const fullDate = date.toDateString().split(' ').join('-');
    // const openTabs = queryTabs();
    // console.log('Opened Tabs: ', openTabs);



    chrome.bookmarks.create({
        parentId: '2',
        title: `Tabs-from-${fullDate}`
    })

}

const createBookmark = (tab, id) => {
    return chrome.bookmarks.create({
        parentId: id,
        title: tab.title,
        url: tab.url
    })
}

/**
 * Saves ALL open tabs to previously created bookmarks folder
 * @param {obj} tabs 
 */
const saveBookmarks = (id, bookmark, openTabs) => {
    console.log('Saving Bookmarks');
    console.log('id: ', id);
    console.log('bookmark: ', bookmark);
    console.log('Open Tabs: ', openTabs.length);
    console.log('Open Tabs: ', openTabs);
    // const openTabs = queryTabs();
    // console.log(openTabs);

    openTabs.forEach((tab) => {
        return createBookmark(tab, id)
    })
    // for (let i = 0; i <= openTabs.length; i++) {
    //     console.log(openTabs);

    //     chrome.bookmarks.create({
    //         parentId: id,
    //         title: openTabs[i].title,
    //         url: openTabs[i].url
    //     })
    // }
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