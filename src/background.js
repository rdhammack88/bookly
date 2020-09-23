/**
 * WORKING VERSION 1.1
 *
 * Currently Working -
 *   - Creates Bookmark Folder (Index of parent folder not what is expected though)
 *   - Saves All opened tabs to JSON file
 *   - Saves All opened tabs to previously created Bookmark folder
 *   - Recursively traverse through Bookmarks and get total folder and bookmark count
 *   __ NEEDS CLEANED __
 */ /////////////////////////////////////////

/** Functions */

/**
 *
 * @param {obj} tab
 */
const init = (tab) => {
    // createBookmarkFolder();
    getBookmarks();
};

/**
 * Creates a NEW bookmark folder to SAVE ALL open tabs to
 * Defaults to the top of OTHER Bookmarks Folder
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
 * Called when ALL opened tabs have been saved to Bookmarks Folder
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

const scanBookmarks = (bookmarkData, bookmarks) => {
    // console.log('Bookmark Data: ', bookmarkData);

    // if (!bookmarks.url && !bookmarks.children) {
    //     return bookmarkData;;
    // }

    if (bookmarks.url) {
        bookmarkData.totalBookmarks++;
        bookmarkData.bookmarks.push(bookmarks);
        // return bookmarkData;
    }

    if (bookmarks.children) {
        // bookmarkData.totalFolders += bookmarks.children.length;
        bookmarks.children.forEach((bookmark) => {
            // if (bookmark.children) {
            bookmarkData.totalFolders++;
            bookmarkData.bookmarkFolders.push(bookmarks);
            return scanBookmarks(bookmarkData, bookmark);
            // }
        })
    }
    // console.log('Finished Scanning Bookmarks!');
    // return bookmarkData;
};

/**
 * Iterate through all bookmarks
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
            // console.log('Bookmark Data: ', bookmarkData);
            // bookmarkData.totalFolders++;
            // bookmarkData.bookmarkFolders.push(bookmark);
            // console.log('Bookmark Data: ', bookmarkData);
            return scanBookmarks(bookmarkData, bookmark);
            // scanBookmarks(totalBookmarks, totalFolders, bookmark);
        });
        console.log('Finished Scanning Bookmarks!');

        console.log('Bookmark Data: ', bookmarkData);
        console.log('Bookmark Data Stringified: ', JSON.stringify(bookmarkData));
    });

    // console.log('Total Bookmarks: ', bookmarkData.totalBookmarks);
    // console.log('Total Folders: ', bookmarkData.totalFolders);
    // console.log('Bookmark Count: ', bookmarkData);
    // console.log('Finished Scanning Bookmarks!');
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

//     // // console.log('Total Bookmarks: ', totalBookmarks); // Equaling 0
//     // // console.log('Total Folders: ', totalFolders); // Equaling 0

//     // // scanBookmarks(totalBookmarks, totalFolders, bookmarks[0]);
//     // // console.log('Total Bookmarks: ', totalBookmarks);
//     // // console.log('Total Folders: ', totalFolders);

//     // // console.log('Bookmark Tree Nodes: ', bookmarks);
//     // // const myBookmarksObj = bookmarks[0].children
//     // // console.log('Type of Bookmarks first index: ', typeof bookmarks[0]);
//     // // console.log('Type of Bookmarks: ', typeof bookmarks);
//     // // console.log('Type of My Bookmarks Object: ', typeof myBookmarksObj);
//     // // console.log('My Bookmarks Object: ', myBookmarksObj);
//     // // scanBookmarks(totalBookmarks, totalFolders, bookmarks);
//     // });

//     // // chrome.bookmarks.getSubTree('1', (bookmarkTreeNode) => {
//     // //     console.log('Sub Tree Nodes: ', bookmarkTreeNode);
//     // // });

//     // // chrome.bookmarks.getChildren('1', (bookmarkTreeNode) => {
//     // //     console.log('Children Nodes: ', bookmarkTreeNode);
//     // // });

//     // // chrome.bookmarks.getRecent(1000000, (bookmarkTreeNode) => {
//     // //     console.log('Recent Bookmarks Length: ', bookmarkTreeNode.length);
//     // // });

//     // // const myBookmarks = myBookmarksObj.map(bookmark => {
//     // //     // return bookmark;
//     // //     if (bookmark.children) {
//     // //         // return bookmark.children.length;
//     // //         // return totalFolders++;
//     // //         return scanBookmarks(bookmark.children);

//     // //     } else if (bookmark.url) {
//     // //         // return bookmark.url;
//     // //         return totalBookmarks++;
//     // //     }
//     // // });
//     // // console.log(myBookmarks);
//     // // console.log(bookmarks);
// }


//////////////////////////////////
//////////////////////////////////
//////////////////////////////////


// // const scanBookmarks = (totalBookmarks, totalFolders, bookmarks) => {
// const scanBookmarks = (bookmarkCount, bookmarks) => {
//     // console.log('Total Bookmarks: ', totalBookmarks);
//     // console.log('Total Folders: ', totalFolders);
//     // console.log('Bookmarks: ', bookmarks);

//     // console.log(typeof bookmarks);

//     console.log(bookmarkCount);

//     if (bookmarks.children) {
//         bookmarkCount.totalFolders += bookmarks.children.length;
//         scanBookmarks(bookmarkCount, bookmarks);

//         // bookmarks.children.forEach((bookmark) => {
//         //     if (bookmark.url) {
//         //         bookmarkCount.totalBookmarks++;
//         //     } else if (bookmark.children) {
//         //         bookmarkCount.totalFolders += bookmark.children.length;
//         //     }
//         //     // console.log('Total Folders: ', totalFolders);
//         //     // console.log('Bookmark children length: ', bookmark.children.length);
//         //     scanBookmarks(bookmarkCount, bookmark);
//         // });
//     }

//     if (bookmarks.url) {
//         bookmarkCount.totalBookmarks++;
//         // console.log('Total Bookmarks: ', totalBookmarks);
//         // return totalBookmarks++;
//     }


//     // bookmarks.forEach(bookmark => {
//     //     // console.log(bookmark);

//     // })



//     console.log('Finished Scanning Bookmarks!');
// };