<template>
    <div style="display:flex;align-items:center">
        <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
            <template slot="title">
                {{ item.key }}
            </template>
            <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon type="check" v-if="item.color === value"></a-icon>
            </a-tag>
        </a-tooltip>

    </div>

</template>

<script>
export default {
    name:'ColorPicker',
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: String
    },
    data() {
        return {
            colorList: [
                {
                    key: "明蓝",
                    color: "#367dbf"
                },
                {
                    key: "薄暮",
                    color: "#F5222D"
                },
                {
                    key: "火山",
                    color: "#FA541C"
                },
                {
                    key: "日暮",
                    color: "#FAAD14"
                },
                {
                    key: "明青",
                    color: "#13C2C2"
                },
                {
                    key: "极光绿",
                    color: "#52C41A"
                },
                {
                    key: "拂晓蓝（默认）",
                    color: "#1890FF"
                },
                {
                    key: "极客蓝",
                    color: "#2F54EB"
                },
                {
                    key: "酱紫",
                    color: "#722ED1"
                }
            ]
        };
    },
    methods: {
        changeColor(color) {
            this.$emit("change", color);
        }
    }
};
</script>

<style lang="less" scoped>
.setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
        font-size: 14px;
    }
}
</style>