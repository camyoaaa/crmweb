<template>
    <a-badge :color="matchStatus.color" :text="matchStatus.name" />
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "CustomStatusBadge",
    props: ["status"],
    computed: {
        ...mapState({
            customStatusList: state => state.appconfig.customStatusList
        }),
        matchStatus() {
            return this.customStatusList.find(s => s.id === this.status);
        }
    }
};
</script>