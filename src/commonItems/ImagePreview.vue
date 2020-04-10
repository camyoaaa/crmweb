<template>
    <div class="imgcon" @click="imgClick">
        <img :src="src" width="100%" height="100%" />
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img style="width: 100%" :src="src" />
        </a-modal>
    </div>
</template>

<script>
export default {
    name: "ImagePreview",
    props: {
        src: String
    },
    data() {
        return {
            previewVisible: false
        };
    },
    methods: {
        imgClick() {
            this.previewVisible = true;
        }
    }
};
</script>

<style lang="less" scoped>
.imgcon {
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
}
</style>
