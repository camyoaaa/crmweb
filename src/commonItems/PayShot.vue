<template>
  <div>
    <a-upload
      name="avatar"
      listType="picture-card"
      class="avatar-uploader"
      :showUploadList="{ showPreviewIcon: true, showRemoveIcon: true }"
      :beforeUpload="beforeUpload"
      :fileList="fileList"
      @preview="handlePreview"
      :remove="handleRemove"
      @change="onchange"
    >
      <div v-if="!value">
        <a-icon :type="'plus'" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: "PayShot",
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value"],
  data() {
    return {
      fileList: [],
      previewImage: "",
      previewVisible: false
    };
  },
  methods: {
    onchange({ fileList }) {
      this.fileList = fileList.filter(file => {
        return (
          (file.type === "image/jpeg" || file.type === "image/png") &&
          file.size / 1024 / 1024 < 2
        );
      });
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handleRemove() {
      console.log("remove");
      this.$emit("change", "");
      return true;
    },
    beforeUpload(file) {
      console.log("beforeUpload file", file);
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
        return false;
      }
      this.$emit("change", file);
      return false;
    }
  }
};
</script>
<style>
/* .avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
} */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
