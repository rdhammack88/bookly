/**
 * WORKING VERSION 1.1
 * 
 * Currently Working -
 *   - Creates Bookmark Folder (Index of parent folder not what is expected though)
 *   - Saves All opened tabs to JSON file
 *   - Saves All opened tabs to previously created Bookmark folder
 *   __ NEEDS CLEANED __
 *      -- CONSOLE LOGS EVERYWHERE -- 
 *      -- UNUSED CODE (COMMENTED OUT) EVERYWHERE -- 
 */ /////////////////////////////////////////

/** Functions */

/**
 * 
 * @param {obj} tab 
 */
const init = (tab) => {
    createBookmarkFolder();
}

/**
 * Creates a NEW bookmark folder to SAVE ALL open tabs to
 * Defaults to the top of OTHER Bookmarks Folder
 */
const createBookmarkFolder = () => {
    const date = new Date(); // MAYBE ADD CURRENT TIME
    const fullDate = date.toDateString().split(' ').join('-');

    console.log('Creating Bookmarks Folder');
    chrome.bookmarks.create({
        title: `Tabs-from-${fullDate}`,
        index: 0
    }, saveOpenTabs);
}

/**
 * 
 * @param {*} tabs 
 */
const saveOpenTabs = (bookmark) => {
    chrome.tabs.query({}, tabs => {
        console.log('Tabs: ', tabs);

        saveTabsToFile(tabs);

        tabs.forEach(tab => {
            chrome.bookmarks.create({
                parentId: bookmark.id,
                title: tab.title,
                url: tab.url
            });
        });
    });
};

/**
 * Saves ALL open tabs to JSON file
 * @param {obj} openTabs 
 */
const saveTabsToFile = (tabs) => {
    console.log('Tabs saved to file');
    const openTabs = tabs.map((tab) => ({
        title: tab.title,
        url: tab.url,
        private: tab.incognito
    }));
    return chrome.tabs.executeScript({
        code: `
            var tabsInfo = ${JSON.stringify(openTabs)};
            var date = new Date();
            var fullDate = date.toDateString().split(' ').join('-');

            function saveText(text, filename) {
                var a = document.createElement('a');
                a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
                a.setAttribute('download', filename);
                a.click();
            }
            saveText(JSON.stringify(tabsInfo, null, 2), 'tabs-' + fullDate + '.json');
        `,
    });
};

/** Event Listeners */

/**
 * Called when user clicks on the browser action button 
 * 
 * @param (obj) tab 
 * - inclusive/implicit param
 * 
 */
chrome.browserAction.onClicked.addListener(init);


///////////////////////////////////////////////////////////////
/////// CLEAN BELOW //////////
///////////////////////////////////////////////////////////////

const createBookmark = (tab) => {

}

// /**
//  * Saves ALL open tabs to previously created bookmarks folder
//  * @param {obj} tabs 
//  */
// const saveBookmarks = (id, bookmark) => { // RUNS MULTIPLE TIMES
//     if (bookmark.url) {
//         return;
//     }

//     console.log('Folder Created');
//     console.log('Folder ID: ', id);
//     console.log('Bookmark Folder: ', bookmark);

//     console.log('Saving Bookmarks');
//     chrome.tabs.query({}, (tabs) => { // RUNS ONCE
//         console.log('Saving Tabs to file');
//         saveTabsToFile(tabs);

//         console.log('Saving Tabs to Bookmarks folder');
//         tabs.forEach(tab => {
//             chrome.bookmarks.create({
//                 parentId: id,
//                 title: tab.title,
//                 url: tab.url
//             })
//         })
//         console.log('Bookmarks saved!');
//     })
// }

/** 
 * Called when new bookmark has been created 
 * 
 * @param (id, bookmark) Integer, Object
 */
// chrome.bookmarks.onCreated.addListener(saveBookmarks);

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

// /**
//  * Queries ALL open tabs
//  */
// const queryTabs = (tab) => {
//     console.log('Querying tabs');
//     chrome.tabs.query({}, createBookmarkFolder)
// }

/**
 * 
 * @param {*} tab 
 * @param {*} id 
 */
// const createBookmark = (tab, id) => {
//     chrome.bookmarks.create({
//         parentId: id,
//         title: tab.title,
//         url: tab.url
//     })
// }

/**
 * 
 * @param {*} bookmark 
 */
// const queryOpenedTabs = (bookmark) => {
//     console.log('Bookmark folder ID: ', bookmark.id);
//     chrome.tabs.query({}, saveOpenTabs);
// }