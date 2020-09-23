/////////////////////////////////////////
/**
 * WORKING VERSION 1.2
 * Author: Dustin Hammack
 * Created: September 2020
 *
 * Currently Working -
 *   - createBookmarkFolder() Function -
 *     - Creates Bookmark Folder (Currently defaults to first index of "Other Bookmarks" forlder)
 *     - Saves All opened tabs to previously created Bookmark folder titled -> Tabs-from-{TODAYS CURRENT DATE}
 *     - Saves All opened tabs to JSON file - also titled -> Tabs-from-{TODAYS CURRENT DATE}
 * 
 *   - getBookmarks() Function -
 *     - Recursively traverse through Bookmarks and get total folder and bookmark count
 * 
 *   __ NEEDS CLEANED __
 */
/////////////////////////////////////////

/** Functions */

/**
 * Initialize processes upon user action click
 * @param {obj} tab
 */
const init = (tab) => {
    createBookmarkFolder();
    // getBookmarks();
};

/**
 * Creates a NEW bookmark folder to SAVE ALL open tabs to
 * Defaults to the first index of "Other Bookmarks" Folder
 * Default title set to "Tabs-from-{TODAYS DATE}"
 */
const createBookmarkFolder = () => {
    const date = new Date(); // MAYBE ADD CURRENT TIME
    const fullDate = date.toDateString().split(' ').join('-');

    chrome.bookmarks.create({
            title: `Tabs-from-${fullDate}`,
            index: 0,
        },
        saveOpenTabs
    );
};

/**
 * Called as CALLBACK when Bookmark Folder has been created
 * Saves ALL open tabs to previously created folder at first index of "Other Bookmarks", titled -> "Tabs-from-{TODAYS DATE}"
 * Calls saveTabsToFile() upon completion of saving each tab to the bookmark folder
 * @param {obj} bookmark
 */
const saveOpenTabs = (bookmark) => {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.bookmarks.create({
                parentId: bookmark.id,
                title: tab.title,
                url: tab.url,
            });
        });

        saveTabsToFile(tabs);
    });
};

/**
 * Saves ALL open tabs to JSON file
 * Called when ALL opened tabs have been saved to Bookmarks Folder in saveOpenTabs()
 * @param {obj} tabs
 */
const saveTabsToFile = (tabs) => {
    console.log('Tabs saved to file');
    const openTabs = tabs.map((tab) => ({
        title: tab.title,
        url: tab.url,
        private: tab.incognito,
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


//////////////////////////
///////Clean Below////////
//////////////////////////


// const getBookmarks = () => {

//     chrome.bookmarks.getSubTree('1', (bookmarkTreeNode) => {
//         console.log('Sub Tree Nodes: ', bookmarkTreeNode);
//     });

//     chrome.bookmarks.getChildren('1', (bookmarkTreeNode) => {
//         console.log('Children Nodes: ', bookmarkTreeNode);
//     });

//     chrome.bookmarks.getRecent(1000000, (bookmarkTreeNode) => {
//         console.log('Recent Bookmarks Length: ', bookmarkTreeNode.length);
//     });

// }