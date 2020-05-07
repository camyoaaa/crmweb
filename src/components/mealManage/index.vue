<template>
    <div style="margin:-22px -16px 0px -15px;background:white;padding:16px 16px 0px 16px">
        <a-tabs v-model="activeKey">
            <a-tab-pane tab="套餐列表" key="list">
                <a-card :bordered="false">
                    <div class="table-operator" style="margin-bottom:18px">
                        <a-button type="primary" :disabled="!$auth('mealManage.add')" icon="plus" @click="$refs.createParent.open()">新增父级套餐</a-button>
                    </div>
                    <a-card v-for="(pMeal,index) in mealData" :key="pMeal.mid" :style="{marginTop:index === 0?'0px':'20px'}">
                        <div slot="title">
                            <a-icon type="file" />
                            <span v-if="pMeal.editing">
                                <a-input v-model="pMeal.name" style="width:300px" />
                                <a-button icon="check" @click="updateMeal(pMeal)" />
                                <a-button icon="close" @click="cancelEdit(pMeal)" />
                            </span>
                            <span v-else> {{pMeal.name}}</span>

                        </div>
                        <a-button-group slot="extra">
                            <a-button :disabled="!$auth('mealManage.modify')" type="primary" @click="startEdit(pMeal)">修改父级名字</a-button>
                            <a-popconfirm :disabled="!$auth('mealManage.delete')" title="确定删除这个父级以及所属子级套餐吗?" placement="topRight" okText="Yes" cancelText="No" @confirm="deleteMeal(pMeal)" @cancel="_=>{}">
                                <a-button :disabled="!$auth('mealManage.delete')" type="danger">删除父级套餐</a-button>
                            </a-popconfirm>
                            <a-button :disabled="!$auth('mealManage.add')" type="primary" @click="$refs.createChild.open(pMeal.mid)">新增子级套餐</a-button>
                        </a-button-group>
                        <a-table size="small" rowKey="mid" :key="pMeal.mid" :columns="columns" :dataSource="pMeal.childMealList" :pagination="false">
                            <span slot="name" slot-scope="text, record">
                                <a-input v-if="record.editing" v-model="record.name" />
                                <div v-else>{{ text }}</div>
                            </span>
                            <span slot="price" slot-scope="text, record">
                                <a-input-number v-if="record.editing" v-model="record.price" />
                                <div v-else>{{ text | numformat}}</div>
                            </span>
                            <span slot="minDeposit" slot-scope="text, record">
                                <a-input-number v-if="record.editing" v-model="record.minDeposit" />
                                <div v-else>{{ text }}</div>
                            </span>
                            <span slot="content" slot-scope="text, record">
                                <a-input v-if="record.editing" v-model="record.content" />
                                <ellipsis v-else :length="20" tooltip> {{ text }} </ellipsis>
                            </span>
                            <span slot="orderNumber" slot-scope="text, record">
                                <router-link :to="{path:'/orderManage',query:{mid:record.mid}}">{{text}}</router-link>
                            </span>
                            <span slot="action" slot-scope="text, record">
                                <div v-if="record.editing">
                                    <a-button icon="check" @click="updateMeal(record)"></a-button>
                                    <a-button icon="close" @click="cancelEdit(record)"></a-button>
                                </div>
                                <div v-else>
                                    <a-button v-if="!record.editing" @click="startEdit(record)" :disabled="Object.keys(editingCache).length >0">编辑</a-button>
                                    <a-popconfirm title="确定删除这个套餐吗" @confirm="deleteMeal(record)" @cancel="() => {}" okText="Yes" cancelText="No" :disabled="Object.keys(editingCache).length >0">
                                        <a-button :disabled="Object.keys(editingCache).length >0">删除</a-button>
                                    </a-popconfirm>
                                </div>
                            </span>
                        </a-table>
                    </a-card>

                    <create-form ref="createChild" @ok="getMealData" />
                    <create-parent-form ref="createParent" @ok="getMealData" />
                </a-card>
            </a-tab-pane>
            <a-tab-pane tab="套餐内容" key="content">
                <a-card>
                    <a-row :gutter="48">
                        <a-col :span="12">
                            <img :src="content1" alt="" />
                        </a-col>
                        <a-col :span="12">
                            <img :src="content2" alt="" />
                        </a-col>
                    </a-row>
                </a-card>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import CreateForm from "./CreateForm";
import createParentForm from "./createParentForm";
import { getList, modify, add, deleteMeal } from "@/myapi/meal.js";

import content1 from "@/assets/images/meal/content1.png";
import content2 from "@/assets/images/meal/content2.png";

export default {
    name: "TableList",
    components: {
        CreateForm,
        createParentForm
    },
    data() {
        return {
            editingCache: {},
            mealData: {}, //菜单数据
            activeKey: "list",
            content1,
            content2,
            // 表头
            columns: [
                {
                    title: "套餐名称",
                    dataIndex: "name",
                    scopedSlots: { customRender: "name" },
                    width: "250px"
                },
                {
                    title: "套餐价格",
                    dataIndex: "price",
                    scopedSlots: { customRender: "price" },
                    width: "200px"
                },
                {
                    title: "最低套餐定金",
                    dataIndex: "minDeposit",
                    scopedSlots: { customRender: "minDeposit" },
                    width: "200px"
                },
                {
                    title: "套餐内容",
                    dataIndex: "content",
                    scopedSlots: { customRender: "content" },
                    width: "200px"
                },
                {
                    title: "已签",
                    dataIndex: "orderNumber",
                    scopedSlots: { customRender: "orderNumber" },
                    width: "150px"
                },
                {
                    title: "操作",
                    dataIndex: "action",
                    scopedSlots: { customRender: "action" },
                    width: "400px"
                }
            ]
        };
    },
    created() {
        this.getMealData();
    },
    methods: {
        //添加editing字段
        addEditingField(array) {
            return array.map(element => {
                element.editing = false;
                if (element.childMealList && element.childMealList.length > 0) {
                    element.childMealList = this.addEditingField(
                        element.childMealList
                    );
                }
                return element;
            });
        },
        //获取菜单数据
        async getMealData() {
            try {
                let result = await getList();
                if (result.status === 200) {
                    this.mealData = this.addEditingField(result.data);
                }
            } catch (error) {
                console.log(error);
            }
        },
        //启用编辑
        startEdit(meal) {
            meal.cache = { ...meal };
            meal.editing = true;
        },
        //取消编辑
        cancelEdit(meal) {
            for (const key in meal.cache) {
                meal[key] = meal.cache[key];
            }
            delete meal.cache;
        },
        //更新套餐
        async updateMeal(meal) {
            meal.editing = false;
            delete meal.cache;
            try {
                let { mid, _id, __v, ...payload } = meal;
                let modifySuccess = await modify({
                    mids: [mid],
                    ...payload
                });
                this.$notification.success({
                    $message: "成功",
                    description: "套餐更新成功"
                });
                this.getMealData();
            } catch (error) {}
        },
        //删除套餐
        async deleteMeal(meal) {
            let mids = [meal.mid].concat(meal.childMealList.map(m => m.mid));
            try {
                let deleteSuccess = await deleteMeal({ mids });
                this.$notification.success({
                    $message: "成功",
                    description: "套餐删除成功"
                });
                this.getMealData();
            } catch (error) {
                console.log(error);
            }
        }
    }
};
</script>
