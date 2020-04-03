<template>
    <a-select mode="multiple" :value="value.selects" @change="onSelectChange">
        <a-select-option v-for="(b,index) in busiList" :key="b.bid" :value="b.bid">
            {{b.name}}
        </a-select-option>
    </a-select>
</template>

<script>
import { getList } from "@/myapi/business.js";
export default {
    name: "BusinessSelect",
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: Object
    },
    data() {
        return {
            busiList: []
        };
    },
    created() {
        this.getBusiList();
    },
    methods: {
        onSelectChange(values) {
            this.$emit("change", {
                selects: values,
                labels: this.busiList
                    .filter(b => values.includes(b.bid))
                    .map(i => i.name)
            });
        },
        async getBusiList() {
            try {
                let res = await getList({ pageNo: 1, pageSize: 500 });
                console.log("res", res);
                this.busiList = res.result.data;
            } catch (error) {}
        }
    }
};
</script>