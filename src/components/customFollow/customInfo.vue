<template>
  <a-card>
    <div slot="title">
      <router-link :to="{ path: '/customerService' }">
        <a-button type="link" icon="arrow-left"></a-button>
      </router-link>
      客户详情
    </div>
    <a-form>
      <a-row :gutter="48">
        <a-col :span="8">
          <a-form-item label="客户名称">
            <a-input v-model="custom.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="客户状态">
            <status-select
              :value="{ sid: custom.status, name: custom.statusZn }"
              @change="
                ({ sid, name, color }) => {
                  custom.status = sid;
                  custom.statusZn = name;
                  custom.statusColor = color;
                }
              "
            ></status-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="客户来源">
            <custom-from
              :value="{ oid: custom.from, name: custom.fromZn }"
              @change="
                ({ oid, name }) => {
                  custom.from = oid;
                  custom.fromZn = name;
                }
              "
            ></custom-from>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="8">
                                <a-form-item label="套餐业务">
                                    <meal-select v-model="custom.meal"></meal-select>
                                </a-form-item>
                            </a-col> -->
        <a-col :span="8">
          <a-form-item label="真实手机">
            <a-input v-model="custom.phone"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="真实微信">
            <a-input v-model="custom.wx"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="真实 Q Q">
            <a-input v-model="custom.qq"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="省/直辖市/自治区">
            <province-select v-model="custom.province"></province-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="市/辖区">
            <city-select
              v-model="custom.city"
              :province="custom.province"
            ></city-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="区/县">
            <county-select
              v-model="custom.county"
              :province="custom.province"
              :city="custom.city"
            ></county-select>
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <a-form-item label="详细地址">
            <a-input v-model="custom.address"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="身份证">
            <a-input v-model="custom.idcard"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="接待备注">
            <a-input
              v-model="custom.receptionistremark"
              type="textarea"
              :rows="6"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
export default {};
</script>

<style lang="less" scoped></style>
