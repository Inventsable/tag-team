function addTag(data) {
    data = JSON.parse(data);
    get("selection", app).forEach(function (item) {
        var tag = item.tags.add();
        tag.name = data.name;
        tag.value = data.value;
    });
}
function getTags() {
    var result = [];
    var targets = get("selection", app).filter(function (item) {
        return item.tags.length;
    });
    targets.forEach(function (target) {
        var temp = [];
        get("tags", target).forEach(function (tag) {
            temp.push({
                name: tag.name,
                value: tag.value
            });
        });
        result.push(temp);
    });
    return JSON.stringify(result);
}
function removeTag(key, value) {
    get("selection", app).forEach(function (item) {
        get("tags", item)
            .filter(function (tag) {
            return tag[key] == value;
        })
            .forEach(function (tag) {
            tag.remove();
        });
    });
}
function removeAllTags() {
    get("selection", app).forEach(function (item) {
        get("tags", item).forEach(function (tag) {
            tag.remove();
        });
    });
}
console.log("Host is online");
