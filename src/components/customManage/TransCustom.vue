<template>
    <a-modal title="转移客户" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
        <a-form :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-form-item label="当前销售">
                <a-input disabled :value="lastSellerName"></a-input>
            </a-form-item>
            <a-form-item label="转给销售">
                <staff-select v-model="seller" detail role-name="销售员" :disabled-staff="lastSeller" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            lastSeller: "",
            lastSellerName: "",
            seller: "",
            formItemLayout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 18 }
            }
        };
    },
    methods: {
        open(sellerName, seller) {
            this.lastSeller = seller;
            this.lastSellerName = sellerName;
            this.visible = true;
        },
        close() {
            this.visible = false;
            this.seller = "";
        },
        handleSubmit() {
            this.$emit("ok", this.lastSeller, this.seller);
            this.close();
        },
        handleCancel() {
            this.$emit("cancel");
            this.close();
        }
    }
};
</script>