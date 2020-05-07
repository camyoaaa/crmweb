<template>
    <a-select :value="value" style="width:100%" @change="onChange" :placeholder="placeholder" :size="size">
        <a-select-option v-for="r in roleList" :key="r.id" :value="r.id">
            {{r.name}}
        </a-select-option>
    </a-select>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "RoleSelect",
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: Number,
        placeholder: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: "default"
        }
    },
    computed: {
        ...mapState({
            roleList: state => state.appconfig.appRoleList
        })
    },
    methods: {
        onChange(select) {
            this.$emit("change", select);
        }
    }
};
</script>

<style lang="less" scoped>
</style>