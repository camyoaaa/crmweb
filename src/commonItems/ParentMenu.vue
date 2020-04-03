<template>
    <a-tree-select style="width: 100%" :treeData="treeData" @change="onChange" :value="`${value.mid}-${value.path}`" :showCheckedStrategy="SHOW_PARENT" searchPlaceholder="Please select" />

</template>

<script>
import { getMenuTree } from "@/myapi/menu.js";
export default {
    name: "ParentMenu",
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: Object
    },
    data() {
        return {
            SHOW_PARENT: "SHOW_PARENT",
            treeData: [],
            originData: []
        };
    },
    created() {
        this.getMenuTree();
    },
    methods: {
        async getMenuTree() {
            try {
                let result = await getMenuTree();
                this.originData = result.tree;
                this.treeData = this.buildTree(result.tree, result.rootid);
                console.log("this.treeData[0]", this.treeData);

                let selected = this.treeData[0].value.split("-");
                if (!this.value.mid || this.value.mid.length == 0) {
                    this.$emit("change", {
                        mid: Number(selected[0]),
                        path: selected[1],
                        parents: this.treeData[0].parents,
                        parentsPath: this.treeData[0].parentsPath
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
            }
        },
        onChange(value) {
            let selected = value.split("-");
            let filter = this.originData.find(m => m.mid == selected[0]);
            this.$emit("change", {
                mid: Number(selected[0]),
                path: selected[1],
                parents: filter.parents,
                parentsPath: filter.parentsPath
            });
        },
        breadFirst(treeData) {},
        buildTree(treeData, rootKey = 100000) {
            let parentstore = {};
            let childstore = {};
            treeData.forEach(element => {
                element = {
                    ...element,
                    title: element.name,
                    value: `${element.mid}-${element.path}`,
                    key: element.mid
                };
                childstore[element.mid] = element;
                if (Array.isArray(parentstore[element.pid])) {
                    parentstore[element.pid].push(element);
                } else {
                    parentstore[element.pid] = [element];
                }
            });

            for (let key in childstore) {
                childstore[key].children = parentstore[childstore[key].mid];
            }
            return [childstore[rootKey]];
        }
    }
};
</script>