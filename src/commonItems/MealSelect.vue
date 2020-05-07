<template>
    <a-select :value="value" showSearch :filterOption="filterOption" @change="onselect" optionFilterProp="value" optionLabelProp="label" allowClear :placeholder="placeholder">
        <a-select-opt-group v-for="meal in mealData" :key="meal.mid">
            <span slot="label">
                <a-icon type="file" />{{meal.name}}</span>
            <a-select-option v-for="cmeal in meal.childMealList" :key="cmeal.mid" :value="cmeal.mid" :disabled="disableds.includes(cmeal.mid)" :meal="JSON.stringify(cmeal)" :label="`${meal.name}-${cmeal.name}-${$numformat(cmeal.price)}`">
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span>{{ cmeal.name }}</span>
                    <em>{{ cmeal.price | numformat}}</em>
                </div>
            </a-select-option>
        </a-select-opt-group>
    </a-select>
</template>

<script>
import { getList } from "@/myapi/meal.js";
export default {
    name: "MealSelect",
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: Number,
        placeholder: {
            type: String,
            default: "请选择套餐"
        },
        disableds: {
            //禁用的套餐
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            mealData: [],
            mealList: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        async getList() {
            try {
                let result = await getList();
                this.mealData = result.data;
                this.mealList = this.getOrignData(this.mealData);
            } catch (error) {}
        },
        getOrignData(mealData) {
            let list = [];
            mealData.forEach(element => {
                list.push(...element.childMealList);
            });
            return list;
        },
        onselect(select, option) {
            let selectMeal = this.mealList.find(m => m.mid === select);
            this.$emit("change", select);
            this.$emit("contentchange", selectMeal);
        },
        filterOption(input, option) {
            console.log(option);
            return (
                option.componentOptions.children[0].text
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
            );
        }
    }
};
</script>
