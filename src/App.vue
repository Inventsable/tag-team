<template>
  <div id="app">
    <Menus refresh debug />
    <Watcher
      v-model="selectionLength"
      property="app.selection.length"
      :interval="200"
    />
    <Panel script-path="./host/[appName]/">
      <Wrapper>
        <Input v-model="tagName" label="name" @submit="addTag" />
        <Input v-model="tagValue" label="value" @submit="addTag" />
        <Grid>
          <Button
            flat
            tooltip="Add tag of key/value"
            icon="tag-plus"
            :disabled="!canAddTag"
            @click="addTag"
          />
          <Button
            flat
            tooltip="Remove tag with key/value"
            icon="tag-minus"
            :disabled="!hasMatchingKeyOrValue"
            @click="removeTag"
          />
          <Button
            flat
            tooltip="Remove all tags"
            icon="tag-remove"
            :disabled="!tagList.length"
            @click="removeAllTags"
          />
        </Grid>
        <Divider />
        <TextArea
          v-if="tagList.length"
          filled
          tooltip="Remove all tags"
          :rows="rowCount"
          v-model="tagListString"
        />
        <div v-else class="placeholder">
          No tags
        </div>
      </Wrapper>
    </Panel>
  </div>
</template>

<script>
const beautify = require("js-beautify").js;
import { evalScript } from "brutalism";
export default {
  data: () => ({
    selectionLength: 0,
    tagName: "",
    tagValue: "",
    tagList: [],
  }),
  computed: {
    rowCount() {
      return this.tagListString.split("\n").length;
    },
    tagListString() {
      // return JSON.stringify(this.tagList);
      return beautify(JSON.stringify(this.tagList), {
        indent_size: 2,
        space_in_empty_paren: true,
      });
    },
    canAddTag() {
      return (
        this.tagName.length && this.tagValue.length && this.selectionLength > 0
      );
    },
    hasMatchingKeyOrValue() {
      return this.hasTagNameInList || this.hasTagValueInList;
    },
    hasTagNameInList() {
      return (
        this.tagList.flat().filter((tag) => {
          return tag.name == this.tagName;
        }).length > 0
      );
    },
    hasTagValueInList() {
      return (
        this.tagList.flat().filter((tag) => {
          return tag.value == this.tagValue;
        }).length > 0
      );
    },
    matchingKey() {
      return this.hasTagNameInList ? "name" : "value";
    },
    matchingValue() {
      return this.hasTagNameInList ? this.tagName : this.tagValue;
    },
  },
  watch: {
    selectionLength(val) {
      if (val) this.getTags();
      else this.tagList = [];
    },
  },
  methods: {
    resetFields() {
      this.tagName = "";
      this.tagValue = "";
    },
    async addTag() {
      if (!this.canAddTag) return null;
      let msg = {
        name: this.tagName,
        value: this.tagValue,
      };
      await evalScript(`addTag('${JSON.stringify(msg)}')`);
      this.getTags();
      this.resetFields();
    },
    async getTags() {
      let result = await evalScript("getTags()");
      this.tagList = result;
    },
    async removeTag() {
      if (!this.hasMatchingKeyOrValue) return null;
      await evalScript(
        `removeTag('${this.matchingKey}', '${this.matchingValue}')`
      );
      this.getTags();
      this.resetFields();
    },
    async removeAllTags() {
      this.tagList = [];
      await evalScript("removeAllTags()");
    },
  },
};
</script>

<style>
.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background: var(--color-divider);
}
</style>
