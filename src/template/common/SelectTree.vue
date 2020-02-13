<template>
  <el-select :value="value" :clearable="clearable" :filterable="search" :filter-method="onSearch" @clear="clearHandle" :size="size" :showcheckbox="showcheckbox">
    <el-option :value="valueId" :label="valueTitle" class="options">
      <el-tree class="selectTrees" id="tree-option"
        v-if="expandFlag"
        ref="selectTree"
        :accordion="accordion"
        :data="showOptions"
        :props="props"
        :node-key="props.value" 
        :show-checkbox="showcheckbox"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
        @check="checkboxChange">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "el-tree-select",
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          pid: "orgid", //父级ID字段
          value: "orgid", // ID字段名
          label: "orgshortname", // 显示名称
          children: "subDep" // 子级字段名
        };
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /* 初始值 */
    value: {
      type: [Number, String],
      default: () => {
        return null;
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    /* 是否启动搜索 */
    search: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    /* 是否启动搜索 */
    size: {
      type: String,
      default: () => {
        return "small";
      }
    },
    //是否可多选
    showcheckbox: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      showArray: [],
      allNodeArray: [],
      valueId: this.value, // 初始值
      valueTitle: "",
      defaultExpandedKey: ["1"],
      expandFlag: true,
      showOptions: [],
      flatOptions: [],
      checkboxArr: []
    };
  },
  mounted() {
    this.initHandle();
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        let label = null;
        // this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
        // this.defaultExpandedKey = [this.valueId]      // 设置默认展开
        this.flatOptions.map(item => {
          if (item[this.props.value] == this.valueId) {
            label = item;
          }
        });
        // let label = this.flatOptions.find(n => n[this.props.value] == this.valueId);
        this.valueTitle = label ? label[[this.props.label]] : "";
        this.defaultExpandedKey = this.createExpandKey(this.valueId);
        this.controlExpand();
      } else {
        this.valueTitle = "";
        this.showOptions = this.options;
        this.controlExpand();
      }
      this.initScroll();
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          ".el-scrollbar .el-select-dropdown__wrap"
        )[0];
        var scrollBar = document.querySelectorAll(
          ".el-scrollbar .el-scrollbar__bar"
        );
        scrollWrap.style.cssText =
          "margin: 0px; max-height: none; overflow: hidden;";
        // scrollBar.forEach(ele => ele.style.width = 0)
        // scrollBar.filter(function(i){
        //     console.log(i)
        // })

        this.showArray.forEach.call(scrollBar, item => {
          // console.log(item)
          item.style.width = 0;
        });
      });
    },
    //控制expand
    controlExpand(id) {
      this.expandFlag = false;
      if (id) {
        let ind = this.defaultExpandedKey.findIndex(n => n == id);
        if (ind != -1) {
          this.defaultExpandedKey.splice(ind, 1);
        } else {
          this.defaultExpandedKey.push(id);
        }
      }
      this.$nextTick(() => {
        this.expandFlag = true;
      });
    },
    //创建展开列表
    createExpandKey(id, arr) {
      if (!arr) arr = [id];
      let parent = null;
      //   let parent = this.flatOptions.find(n => n[this.props.value] == id);
      this.flatOptions.map(item => {
        if (item[this.props.value] == id) {
          parent = item;
        }
      });
      if (parent) {
        let pid = parent[this.props.pid];
        arr.push(pid);
        if (pid == 0) arr = this.createExpandKey(pid, arr);
      }
      return arr;
    },
    // 切换选项
    handleNodeClick(node) {
      if (!this.showcheckbox) {
        this.valueTitle = node[this.props.label];
        this.valueId = node[this.props.value];
        //   this.controlExpand(this.valueId);
        this.showOptions = this.options;
        this.initHandle();
        this.$emit("getValue", this.valueId);
      }
    },
    //多选选中
    checkboxChange(node, statesObj) {
      let hasChecked = false;
      for (let i = 0; i < this.checkboxArr.length; i++) {
        if (node.orgshortname == this.checkboxArr[i]) {
          this.checkboxArr.splice(i, 1);
          hasChecked = true;
          break;
        }
      }
      if (!hasChecked) {
        this.checkboxArr.push(node.orgshortname);
      }
      this.value = this.checkboxArr.join(",");
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = "";
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit("getValue", null);
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      //   allNode.forEach((element)=>element.classList.remove('is-current'))
      this.allNodeArray.forEach.call(allNode, item => {
        // console.log(item)
        item.classList.remove("is-current");
      });
    },
    //创建flatOptions
    createFlatOptions(arr) {
      let flatOptions = [];
      if (arr) {
        arr.map(n => {
          let cFlatOptions = this.createFlatOptions(n[this.props.children]);
          let obj = {};
          obj[this.props.value] = n[this.props.value];
          obj[this.props.label] = n[this.props.label];
          obj[this.props.pid] = n[this.props.pid];
          flatOptions = _.concat(flatOptions, obj, cFlatOptions);
        });
      }
      return flatOptions;
    },
    //搜索
    onSearch(query) {
      console.log(query);
      if (query) {
        let flatOptions = this.flatOptions.filter(
          n => n[this.props.label].indexOf(query) > -1
        );
        this.showOptions = flatOptions;
      } else {
        this.showOptions = this.options;
        this.controlExpand();
      }
    }
  },
  watch: {
    value() {
      if (!this.showcheckbox) {
        this.valueId = this.value;
        this.initHandle();
      }
    },
    options(v) {
      this.showOptions = v;
      let flatOptions = this.createFlatOptions(v);
      this.flatOptions = flatOptions;
      this.initHandle();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 250px;
  padding: 0;
  width: 199px;
  background: #fff;
  /* overflow: hidden; */
  overflow: auto;
}

.el-scrollbar >>> .el-scrollbar__view {
  padding: 0 !important;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  /* height:auto; */
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}

.el-tree >>> .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}

/* 开发禁用 */
/* .el-tree-node:focus>.el-tree-node__content{
    background-color:transparent;
    background-color: #f5f7fa;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .el-tree-node__content:hover{
    background-color: #f5f7fa;
  } */
</style>
<style lang="less">
.selectTrees {
  .el-checkbox__inner {
    margin-top: 18px;
  }
}
</style>

