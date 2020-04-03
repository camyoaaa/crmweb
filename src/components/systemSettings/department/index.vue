<template>
    <div>
        <a-row :gutter="8" style="max-height:300px">
            <a-col :span="20">
                <!-- <s-tree :dataSource="orgTree" :openKeys.sync="openKeys" :search="true" @click="handleClick" @add="handleAdd" @titleClick="handleTitleClick"></s-tree> -->
                <my-tree></my-tree>
            </a-col>

        </a-row>
    </div>
</template>

<script>
import STree from "@/commonItems/Tree/Tree.jsx";
import myTree from "./mytree/index.vue";
export default {
    name: "department",
    components: { STree, myTree },
    methods: {
        handleClick(e) {
            console.log("handleClick", e);
            this.queryParam = {
                key: e.key
            };
            this.$refs.table.refresh(true);
        },
        handleAdd(item) {
            console.log("add button, item", item);
            this.$message.info(`提示：你点了 ${item.key} - ${item.title} `);
            this.$refs.modal.add(item.key);
        },
        handleTitleClick(item) {
            console.log("handleTitleClick", item);
        }
    },
    data() {
        return {
            title: "部门设置",
            openKeys: ["key-01"],
            orgTree: [
                {
                    key: "key-01",
                    title: "IT技术部",
                    icon: "mail",
                    children: [
                        {
                            key: "key-01-01",
                            title: "软件开发",
                            icon: null,
                            group: true,
                            children: [
                                {
                                    key: "key-01-02-01",
                                    title: "React",
                                    icon: null
                                },
                                {
                                    key: "key-01-02-02",
                                    title: "Vue",
                                    icon: null
                                },
                                {
                                    key: "key-01-02-03",
                                    title: "Angular",
                                    icon: null
                                }
                            ]
                        }
                    ]
                },
                {
                    key: "key-02",
                    title: "财务部",
                    icon: "dollar",
                    children: [
                        {
                            key: "key-02-01",
                            title: "会计核算",
                            icon: null
                        },
                        {
                            key: "key-02-02",
                            title: "成本控制",
                            icon: null
                        },
                        {
                            key: "key-02-03",
                            title: "内部控制",
                            icon: null,
                            children: [
                                {
                                    key: "key-02-03-01",
                                    title: "财务制度建设",
                                    icon: null
                                },
                                {
                                    key: "key-02-03-02",
                                    title: "会计核算",
                                    icon: null
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }
};
</script>

<style lang="less">
.custom-tree {
    /deep/ .ant-menu-item-group-title {
        position: relative;
        &:hover {
            .btn {
                display: block;
            }
        }
    }

    /deep/ .ant-menu-item {
        &:hover {
            .btn {
                display: block;
            }
        }
    }

    /deep/ .btn {
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        width: 20px;
        height: 40px;
        line-height: 40px;
        z-index: 1050;

        &:hover {
            transform: scale(1.2);
            transition: 0.5s all;
        }
    }
}
</style>
