<template>
    <a-select :value="value" @change="onSelectChange" allowClear :placeholder="placeholder">
        <a-select-option v-for="(status, index) in statusList" :key="index" :value="status.id">
            <a-badge :color="status.color" :text="status.name" />
        </a-select-option>
    </a-select>
</template>

<script>
import { mapState } from "vuex";
import { getList } from "@/myapi/customstatus.js";
export default {
    name: "CustomStatusSelect",
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: Number,
        placeholder: {
            type: String,
            default: "请选择客户状态"
        }
    },
    computed: {
        ...mapState({
            statusList: state => state.appconfig.customStatusList
        })
    },
    created() {
        // this.getStatus();
    },
    methods: {
        onSelectChange(select, labels) {
            this.$emit("change", select);
        },
        async getStatus() {
            try {
                let result = await getList({ pageNo: 1, pageSize: 500 });
                this.statusList = result.result.data;
            } catch (error) {}
        }
    }
};
</script>
