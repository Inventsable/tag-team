function addTag(data) {
  data = JSON.parse(data);
  get("selection", app).forEach((item) => {
    let tag = item.tags.add();
    tag.name = data.name;
    tag.value = data.value;
  });
}

function getTags() {
  let result = [];
  let targets = get("selection", app).filter((item) => {
    return item.tags.length;
  });
  targets.forEach((target) => {
    let temp = [];
    get("tags", target).forEach((tag) => {
      temp.push({
        name: tag.name,
        value: tag.value,
      });
    });
    result.push(temp);
  });
  return JSON.stringify(result);
}

function removeTag(key, value) {
  get("selection", app).forEach((item) => {
    get("tags", item)
      .filter((tag) => {
        return tag[key] == value;
      })
      .forEach((tag) => {
        tag.remove();
      });
  });
}

function removeAllTags() {
  get("selection", app).forEach((item) => {
    get("tags", item).forEach((tag) => {
      tag.remove();
    });
  });
}

console.log("Host is online");
