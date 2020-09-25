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
    // console.log(window.navigator);
    createBookmarkFolder();
    // getBookmarks();
};

const getDomainName = url => {
    return url.split('//').pop().toString().split('/')[0].toString().replace('www.', '').replace('.com', '').replace('.org', '').split('.');
}

/**
 * Creates a NEW bookmark folder to SAVE ALL open tabs to
 * Defaults to the first index of "Other Bookmarks" Folder
 * Default title set to "Tabs-from-{TODAYS DATE}"
 */
const createBookmarkFolder = (incognito = false, domainNames = []) => {
    const date = new Date(); // MAYBE ADD CURRENT TIME
    const fullDate = date.toDateString().split(' ').join('-');

    chrome.bookmarks.create({
            title: `Tabs-from-${fullDate}`,
            index: 0,
        },
        saveOpenTabs
    );
};

const createPublicSubTreeFolder = (tabData, bookmarkNodeTree) => {
    // if (tabData.publicWindows.length) {
    chrome.bookmarks.create({
        parentId: bookmarkNodeTree.id,
        title: `${tabData.publicWindows.length}-Public-Windows-from-${new Date().toDateString().split(' ').join('-')}`,
        index: 0
    }, bookmarkNodeTree => {
        createDomainSubTreeFolder(false, tabData, bookmarkNodeTree);
    })
    // bookmarkNodeTree => {
    //     tabData.publicWindows.forEach(tab => {
    //         chrome.bookmarks.create({
    //             parentId: bookmarkNodeTree.id,
    //             title: tab.title,
    //             url: tab.url,
    //         });
    //     })
    // }
    // }
}

const createPrivateSubTreeFolder = (tabData, bookmarkNodeTree) => {
    // if (tabData.privateTabIds.length) {
    //     chrome.tabs.remove(tabData.privateTabIds);
    // }

    // if (tabData.privateWindows.length) {
    chrome.bookmarks.create({
        parentId: bookmarkNodeTree.id,
        title: `${tabData.privateWindows.length}-Incognito-Windows-from-${new Date().toDateString().split(' ').join('-')}`,
        index: 0
    }, bookmarkNodeTree => {
        createDomainSubTreeFolder(true, tabData, bookmarkNodeTree);
    })
    //  bookmarkNodeTree => {
    //     tabData.privateWindows.forEach(tab => {
    //         chrome.bookmarks.create({
    //             parentId: bookmarkNodeTree.id,
    //             title: tab.title,
    //             url: tab.url,
    //         });
    //     })
    // }
    // }
}

const createDomainSubTreeFolder = (private, tabData, bookmarkNodeTree) => {
    if (private) {
        tabData.privateDomainNames = tabData.privateDomainNames.sort();
        tabData.privateDomainNames.forEach(domain => {
            // if (bookmarkNodeTree.url.includes(domain)) {
            chrome.bookmarks.create({
                parentId: bookmarkNodeTree.id,
                title: domain,
            }, bookmarkNodeTree => {
                tabData.tabs.forEach(tab => {
                    if (tab.url.includes(domain) && tab.incognito) {
                        chrome.bookmarks.create({
                            parentId: bookmarkNodeTree.id,
                            title: tab.title,
                            url: tab.url
                        })
                    } else {
                        console.log('Going to next opened tab!');
                    }
                })
            });
            // }
        })
    }

    if (!private) {
        tabData.publicDomainNames = tabData.publicDomainNames.sort();
        console.log('Tabs from Tab Data: ', tabData.tabs);
        console.log('Boomark Folder ID', bookmarkNodeTree.id);

        tabData.publicDomainNames.forEach(domain => {
            // console.log('Domain: ', domain);
            // console.log('Boomark Folder', bookmarkNodeTree);
            // if (bookmarkNodeTree.title.includes(domain)) {
            chrome.bookmarks.create({
                parentId: bookmarkNodeTree.id,
                title: domain,
            }, bookmarkNodeTree => {
                // console.log('Tabs from Tab Data: ', tabData.tabs);
                console.log('Boomark Folder ID', bookmarkNodeTree.id);


                tabData.tabs.forEach(tab => {
                    // console.log('Tab Data: ', tab);
                    // console.log('Tab URL: ', tab.url);

                    if (tab.url.includes(domain)) {
                        // console.log('Tab URL: ', tab.url);

                        console.log('adding tab to bookmark folder: ', domain);
                        chrome.bookmarks.create({
                            parentId: bookmarkNodeTree.id,
                            title: tab.title,
                            url: tab.url
                        })
                    } else {
                        console.log('Going to next opened tab!');
                    }
                })
            });
            // }
        })
    }


    // tabData.domainNames = tabData.domainNames.sort();
    // tabData.domainNames.forEach(domain => {
    //     chrome.bookmarks.create({
    //         parentId: bookmarkNodeTree.id,
    //         title: domain,
    //     }, bookmarkNodeTree => {
    //         tabData.tabs.forEach(tab => {
    //             if (tab.url.includes(domain)) {
    //                 chrome.bookmarks.create({
    //                     parentId: bookmarkNodeTree.id,
    //                     title: tab.title,
    //                     url: tab.url
    //                 })
    //             }
    //         })
    //     });
    // })
}

/**
 * Called as CALLBACK when Bookmark Folder has been created
 * Saves ALL open tabs to previously created folder at first index of "Other Bookmarks", titled -> "Tabs-from-{TODAYS DATE}"
 * Calls saveTabsToFile() upon completion of saving each tab to the bookmark folder
 * @param {obj} bookmarkNodeTree
 */
const saveOpenTabs = (bookmarkNodeTree) => {
    const tabData = {
        publicWindows: [],
        privateWindows: [],
        privateTabIds: [],
        privateDomainNames: [],
        publicDomainNames: [],
        domainNames: [],
        tabs: {}
    }
    chrome.tabs.query({}, (tabs) => {
        // tabData.tabs.push(tabs);
        tabData.tabs = tabs;
        chrome.browserAction.setBadgeText({
            text: tabs.length.toString()
        });

        tabs.forEach((tab) => {
            let tabUrl = getDomainName(tab.url);
            tabUrl = tabUrl[tabUrl.length - 1];
            if (!tabData.domainNames.includes(tabUrl)) {
                tabData.domainNames.push(tabUrl);
            }
            if (tab.incognito) {
                tabData.privateWindows.push(tab);
                tabData.privateTabIds.push(tab.id);
                if (!tabData.privateDomainNames.includes(tabUrl)) {
                    tabData.privateDomainNames.push(tabUrl);
                }
            } else if (!tab.incognito) {
                tabData.publicWindows.push(tab);
                if (!tabData.publicDomainNames.includes(tabUrl)) {
                    tabData.publicDomainNames.push(tabUrl);
                }
            }
        });

        // createDomainSubTreeFolder(tabData, bookmarkNodeTree);

        if (tabData.privateWindows.length) {
            createPrivateSubTreeFolder(tabData, bookmarkNodeTree);
        }

        if (tabData.publicWindows.length) {
            createPublicSubTreeFolder(tabData, bookmarkNodeTree);
        }

        // tabData.domainNames = tabData.domainNames.sort();
        // tabData.domainNames.forEach(domain => {
        //     chrome.bookmarks.create({
        //         parentId: bookmarkNodeTree.id,
        //         title: domain,
        //     }, bookmarkNodeTree => {
        //         tabs.forEach(tab => {
        //             if (tab.url.includes(domain)) {
        //                 chrome.bookmarks.create({
        //                     parentId: bookmarkNodeTree.id,
        //                     title: tab.title,
        //                     url: tab.url
        //                 })
        //             }
        //         })
        //     });
        // })

        // console.log(tabData.privateTabIds);
        // console.log(tabData.privateTabIds.length);
        console.log('Domain Names: ', tabData.domainNames);
        console.log('Public Windows: ', tabData.publicWindows);
        console.log('Private Windows: ', tabData.privateWindows);


        // if (tabData.privateTabIds.length) {
        //     chrome.tabs.remove(tabData.privateTabIds);
        // }

        // if (tabData.publicWindows.length) {
        //     chrome.bookmarks.create({
        //         parentId: bookmarkNodeTree.id,
        //         title: `${tabData.publicWindows.length}-Public-Windows-from-${new Date().toDateString().split(' ').join('-')}`,
        //         index: 0
        //     }, bookmarkNodeTree => {
        //         tabData.publicWindows.forEach(tab => {
        //             chrome.bookmarks.create({
        //                 parentId: bookmarkNodeTree.id,
        //                 title: tab.title,
        //                 url: tab.url,
        //             });
        //         })
        //     })
        // }

        // if (tabData.privateWindows.length) {
        //     chrome.bookmarks.create({
        //         parentId: bookmarkNodeTree.id,
        //         title: `${tabData.privateWindows.length}-Incognito-Windows-from-${new Date().toDateString().split(' ').join('-')}`,
        //         index: 0
        //     }, bookmarkNodeTree => {
        //         tabData.privateWindows.forEach(tab => {
        //             chrome.bookmarks.create({
        //                 parentId: bookmarkNodeTree.id,
        //                 title: tab.title,
        //                 url: tab.url,
        //             });
        //         })
        //     })
        // }

        // saveTabsToFile(tabs);

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
            saveText(JSON.stringify(tabsInfo, null, 2), ${openTabs.length} + '-tabs-' + fullDate + '.json');
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