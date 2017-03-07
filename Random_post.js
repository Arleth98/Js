// Random Post By Mas Taufik Nurrohman

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(arr) {
    var i = arr.length, j, temp;
    if (i === 0) return false;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j]; 
        arr[j] = temp;
    }
    return arr;
}

function createRandomPostsStartIndex(json) {
    var startIndex = getRandomInt(1, (json.feed.openSearch$totalResults.$t - maxResults));
    if (window.console && window.console.log) console.log('Get the post feed start from ' + startIndex + ' until ' + (startIndex + maxResults)); 
    document.write('<scr' + 'ipt src="' + homePage + '/feeds/posts/summary?alt=json-in-script&orderby=updated&start-index=' + startIndex + '&max-results=' + maxResults + '&callback=randomPosts"></scr' + 'ipt>');
}
function randomPosts(json) {
    var link, summary, img,
        ct = document.getElementById(containerId),
        entry = shuffleArray(json.feed.entry),
        skeleton = "<ul>";
    for (var i = 0, len = entry.length; i < len; i++) {
        summary = ("summary" in entry[i]) ? (entry[i].summary.$t.replace(/<br *\/?>|[\s]+/g, ' ').replace(/<.*?>/g, "").replace(/[<>]/g, "")).substring(0, summaryLength) + '&hellip;' : "";
        img = ("media$thumbnail" in entry[i]) ? entry[i].media$thumbnail.url.replace(/\/s\d+(\-c)?\//, "/s72-c/") : noImageUrl;
        for (var j = 0, jen = entry[i].link.length; j < jen; j++) {
            if (entry[i].link[j].rel == "alternate") {
                link = entry[i].link[j].href;
                break;
            }
        }
        skeleton += '<li>';
        skeleton += '<img src="' + img + '" alt="" width="72" height="72">';
        skeleton += '<a href="' + link + '">' + entry[i].title.$t + '</a><br>';
        skeleton += '<span>' + summary + '</span>';
        skeleton += '<span class="clear"></span></li>';
    }
    ct.innerHTML = skeleton + '</ul>';
}
document.write('<scr' + 'ipt src="' + homePage + '/feeds/posts/summary?alt=json-in-script&max-results=0&callback=createRandomPostsStartIndex"></scr' + 'ipt>');