<template>
    <a-select :size="size" :mode="mode" :value="value" @change="onSelect" optionLabelProp="label" style="width:100%" :placeholder="placeholder" allowClear>
        <a-select-option v-for="staff in staffList" :key="staff.account" :value="staff.account" :label="staff.name" :disabled="(detail && staff.status === offworkStatus) || disabledStaff === staff.account">
            <div style="display:flex;justify-content:space-between">
                <div>
                    <a-badge v-if="detail" :status="getStaffStatus(staff)" />
                    <span>{{ staff.name }}</span>
                    <span v-if="detail">
                        {{ staff.todayRecepted || 0 }}
                    </span>
                </div>
                <span style="font-size:12px" v-if="detail">
                    <a-tooltip placement="right" :title="staff.lastTaskTime | dateformat">
                        {{ $moment(staff.lastTaskTime).fromNow() }}
                    </a-tooltip>
                </span>
            </div>
        </a-select-option>
    </a-select>
</template>

<script>
import { getFilterStaff, getList } from "@/myapi/staff.js";
import { mapState } from "vuex";
export default {
    name: "StaffSelect",
    computed: {
        ...mapState({
            staffStatusList: state => state.appconfig.staffStatusList,
            roleList: state => state.appconfig.appRoleList
        }),
        offworkStatus() {
            return this.staffStatusList.find(
                status => status.name === "暂停业务"
            ).id;
        },
        roleId() {
            let matchRole = this.roleList.find(role => {
                return role.name === this.roleName;
            });
            console.log("matchRole", matchRole);
            return matchRole ? matchRole.id : "";
        }
    },
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: [Number, String],
        roleName: {
            type: String,
            default: "" //"",sellerManager,seller,aftersaleManager,aftersale
        },
        mode: {
            type: String,
            default: "default"
        },
        detail: {
            //是否展示员工的分配信息
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: "请选择员工"
        },
        size: {
            type: String,
            default: "default"
        },
        disabledStaff: Number
    },
    data() {
        return {
            staffList: []
        };
    },
    watch: {
        roleId() {
            this.initOptions();
        }
    },
    methods: {
        getStaffStatus(staff) {
            const { todayRecepted, daily } = staff;
            const threePart = Math.ceil(daily / 3);

            if (todayRecepted < threePart) {
                return "success";
            } else if (todayRecepted < threePart * 2) {
                return "warning";
            } else {
                return "error";
            }
        },
        onSelect(selects) {
            this.$emit("change", selects);
        },
        async initOptions() {
            try {
                let result = await getList({
                    role: this.roleId,
                    sorterList: [
                        {
                            sortField: "status",
                            sortOrder: "desc"
                        },
                        {
                            sortField: "lastTaskTime",
                            sortOrder: "asc"
                        }
                    ]
                });
                if (
                    result.status == 200 &&
                    result.result &&
                    Array.isArray(result.result.data)
                ) {
                    this.staffList = result.result.data;
                    if (this.preselect && !this.value) {
                        this.$emit("change", this.staffList[0].account);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.initOptions();
    }
};
</script>

<style lang="less" scoped></style>
