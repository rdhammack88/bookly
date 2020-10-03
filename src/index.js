/**
 * Recursive call to retrieve all bookmarks and TRAVERSE bookmark folders
 * Initial call in getBookmarks()
 * @param {obj} bookmarkData
 * @param {obj} bookmarks
 */
const traverseBookmarks = (bookmarkData, bookmarkNode, traverseType = '') => {
    if (bookmarkNode.url) {
        if (traverseType === 'get') {
            bookmarkData.totalBookmarks++;
            bookmarkData.bookmarks.push(bookmarkNode);
        } else if (traverseType === 'duplicate') {
            if (!bookmarkData.bookmarks.includes(bookmarkNode.url)) {
                bookmarkData.bookmarks.push(bookmarkNode.url);
            } else if (bookmarkData.bookmarks.includes(bookmarkNode.url)) {
                bookmarkData.duplicateBookmarks.push(bookmarkNode.url);
            }
        }
    }

    if (bookmarkNode.children) {
        bookmarkNode.children.forEach((bookmark) => {
            if (traverseType === 'get') {
                if (bookmarkNode.title === '' && bookmark.children) {
                    bookmarkData.bookmarkNodeListItems += `<li class="bookmark-node-folder bookmark-node" data-id="${bookmark.id}">${bookmark.title}  <span class="bookmark-node-count--badge">${bookmark.children.length}</span></li>`
                }
                bookmarkData.totalFolders++;
                bookmarkData.bookmarkFolders.push(bookmarkNode);
                return traverseBookmarks(bookmarkData, bookmark, traverseType);
            } else if (traverseType === 'duplicate') {
                return traverseBookmarks(bookmarkData, bookmark, traverseType);
            }

            // document.getElementById('bookmarkList').innerHTML += `<li>${bookmark.title}</li>`;
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
        bookmarkNodeListItems: ''
    };

    chrome.bookmarks.getTree((bookmarks) => {
        bookmarks.forEach((bookmark) => {
            // document.getElementById('bookmarkList').innerHTML += `<li>${bookmark.title}</li>`;
            bookmarkData = traverseBookmarks(bookmarkData, bookmark, 'get');
        });

        document.getElementById('total-bookmarks').innerText = bookmarkData.totalBookmarks;
        document.getElementById('total-folders').innerText = bookmarkData.totalFolders;
        document.getElementById('bookmark-node-list').innerHTML = bookmarkData.bookmarkNodeListItems;

        console.log('Finished Scanning Bookmarks!');
        console.log('Bookmarks: ', bookmarks);
        console.log('Bookmark Data: ', bookmarkData);

        // const bookmarkDataStringified = JSON.stringify(bookmarkData);
        // console.log('Bookmark Data Stringified: ', JSON.stringify(bookmarkData));
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
        console.log('Bookmark Node Count: ', bookmarkNodes.length);
        console.log('Bookmark Nodes: ', bookmarkNodes);

        bookmarkNodes.forEach((node) => {
            if (!bookmarkData.bookmarks.includes(node.url)) {
                bookmarkData.bookmarks.push(node.url);
            } else if (bookmarkData.bookmarks.includes(node.url)) {
                bookmarkData.duplicateBookmarks.push(node.url);
            }
        });

        console.log('Bookmarks Count: ', bookmarkData.bookmarks.length);
        console.log('Duplicate Bookmarks Count: ', bookmarkData.duplicateBookmarks.length);
    });
};

const getDuplicateFolders = () => {

    bookmarkNodes.forEach((node) => {

    });
};

const getDuplicateBookmarks = () => {
    const bookmarkData = {
        bookmarks: [],
        duplicateBookmarks: [],
    };
    chrome.bookmarks.getTree((bookmarks) => {
        bookmarks.forEach((bookmark) => {
            traverseBookmarks(bookmarkData, bookmark, 'duplicate');
        });

        console.log('Duplicate Data: ', bookmarkData);
    });
};

const getSubTreeNodes = (id) => {
    let nodeList = '';

    chrome.bookmarks.getSubTree(id, (bookmarkNode) => {
        // console.log('Sub Tree Bookmark Nodes: ', bookmarkNodes);
        let bookmarkNodes = bookmarkNode[0].children;
        console.log(bookmarkNodes);
        // console.log('Children Bookmark Nodes', bookmarkNodes);


        bookmarkNodes.forEach(bookmarkNode => {
            if (bookmarkNode.url) {
                nodeList += `<li class="bookmark-node">${bookmarkNode.title}</li>`;
            } else if (!bookmarkNode.url) {
                console.log('Bookmark Node should have Children Prop: ', bookmarkNode);
                // nodeList += `<li class="bookmark-node-folder bookmark-node" data-id="${bookmarkNode.id}">${bookmarkNode.title}</li>`
                nodeList += `<li class="bookmark-node-folder bookmark-node" data-id="${bookmarkNode.id}">${bookmarkNode.title} <span class="bookmark-node-count--badge">${bookmarkNode.children.length}</span></li>`
            }
        });

        // // document.getElementById('back-btn').dataset.id = targetId;

        // document.getElementById('bookmark-node-list').innerHTML = nodeList;
        showProgressBar(0, nodeList);

        // // console.log('Node List Items: ', nodeList);
        return nodeList;
    });
    return nodeList;
};

const getParentNode = (id) => {
    let nodeList = '';
    chrome.bookmarks.get(id, (bookmarkNode) => {
        console.log('Back button data-id -> parentNode id: ', bookmarkNode[0].parentId);
        let parentId = bookmarkNode[0].parentId.toString() || bookmarkNode.parentId.toString();
        if (parentId === '0') {
            document.getElementById('back-btn').style = 'display: none';
        } else {
            document.getElementById('back-btn').dataset.id = parentId;
        }
        // getChildrenNodes(parentId);
        getSubTreeNodes(parentId);
    })
}

const getChildrenNodes = (id) => {
    let nodeList = '';
    chrome.bookmarks.getChildren(id, (bookmarkNodes) => {
        // console.log('Children Bookmark Nodes', bookmarkNodes);
        bookmarkNodes.forEach(bookmarkNode => {
            if (bookmarkNode.url) {
                nodeList += `<li class="bookmark-node">${bookmarkNode.title}</li>`;
            } else if (!bookmarkNode.url) {
                console.log('Bookmark Node should have Children Prop: ', bookmarkNode);
                nodeList += `<li class="bookmark-node-folder bookmark-node" data-id="${bookmarkNode.id}">${bookmarkNode.title}</li>`
                // nodeList += `<li class="bookmark-node-folder bookmark-node" data-id="${bookmarkNode.id}">${bookmarkNode.title} <span class="bookmark-node-count--badge">${bookmarkNode.children.length}</span></li>`
            }
        });

        // document.getElementById('back-btn').dataset.id = targetId;
        document.getElementById('bookmark-node-list').innerHTML = nodeList;
        // console.log('Node List Items: ', nodeList);
        return nodeList;
    });
    return nodeList;
};

const showProgressBar = (len = 0, dataToShow) => {
    let width = 1;
    const progressBar = document.getElementById('progress-bar');
    const progressBarWrapper = document.getElementById('progress-bar-wrapper');
    progressBarWrapper.style.display = 'block';
    const interval = setInterval(moveProgress, 5);

    function moveProgress() {
        if (width >= 100) {
            progressBarWrapper.style.display = 'none';
            document.getElementById('back-btn').style.display = 'block';
            document.getElementById('bookmark-node-list').innerHTML = dataToShow;
            clearInterval(interval);
        } else {
            width++;
            progressBar.style.width = width + '%';
            document.getElementById('bookmark-node-list').innerHTML = '';
            document.getElementById('back-btn').style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', getBookmarks);
document.getElementById('search').addEventListener('click', (e) => {
    e.preventDefault();
    const query = document.getElementById('query').value;
    console.log(query);
    searchBookmarks(query);
});

document.getElementById('search-duplicate-bookmarks').addEventListener('click', (e) => {
    e.preventDefault();
    getDuplicateBookmarks();
});

document.addEventListener('click', (e) => {
    // console.log(e.target.className.includes('bookmark-node-folder'));
    if (e.target.className.includes('bookmark-node-folder')) {
        console.log(e.target.dataset.id);
        let targetId = e.target.dataset.id.toString();

        document.getElementById('back-btn').style = 'display: block';
        document.getElementById('back-btn').dataset.id = targetId;
        getSubTreeNodes(targetId);
        // getChildrenNodes(targetId);
    }
});

document.getElementById('back-btn').addEventListener('click', (e) => {
    if (e.target.dataset.id) {
        console.log('Back button current data-id: ', e.target.dataset.id);
        let targetId = e.target.dataset.id.toString();
        getParentNode(targetId);
    }
})