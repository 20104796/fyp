<template>
  <div>
    <el-dialog title="Setting" :visible.sync="showSettingsDialog" width="600px">
      <el-tabs type="border-card" stretch>
        <el-tab-pane label="Basic Setting">
          <div class="basic-configuration">
            <div class="basic-configuration-title">
              Server Address
            </div>
            <div class="basic-configuration-nav">
              <img src="../assets/login/server.png" alt="" width="20px" class="form-icon">
              <input type="text" placeholder="Server address" v-model="ipaddress">
            </div>
            <div style="text-align: center;margin-top: 20px;">
              <el-button style="width: 45%;" @click="showSettingsDialog = false">Cancel</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="New Bing">
          <div class="bing-configuration">
            <div class="bing-configuration-title">
              new bing
            </div>
            <div class="bing-configuration-nav">
              <el-button type="primary" @click="openBing">Open New Bing</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { generateConversation, getConversationInfo } from '@/api/bing';
const { shell } = window.require('electron');
import { validURL } from '@/utils/validate';
export default {
  name: "settings",
  data() {
    return {
      showSettingsDialog: false,
      //总数
      total: 0,
      us_count: 0,
      room: "",
      conversation_id: "",
      conversation_signature: "",
    };
  },
  methods: {
    ...mapActions(["updateAddress"]),
    //打开弹窗
    openDialog() {
      this.showSettingsDialog = true;
      this.loadData()
    },
    //加载数据
    loadData() {
      getConversationInfo()
          .then((res) => {
            if (res.code == 200) {
              this.total = res.data.total
              this.us_count = res.data.us_count
              this.room = res.data.room
              this.conversation_id = res.data.conversation_id
              this.conversation_signature = res.data.conversation_signature
              if (this.total != 0) {
                this.$emit('getBingInfo', { ...res.data });
              }
            }
          })
    },
    //打开bing网站
    openBing() {
      shell.openExternal("https://www.bing.com/chat?q=Microsoft+Copilot&FORM=hpcodx");
    },
  },
}
</script>

<style lang="scss" scoped>
.basic-configuration {
  padding: 20px;

  .basic-configuration-title {
    color: #9e9e9e;
    // font-size: 1px;
    margin: 10px 0;

  }

  .basic-configuration-nav {
    position: relative;
    margin: 10px 0;

    .form-icon {
      position: absolute;
      top: 10px;
      left: 5px;
    }

    input {
      width: 300px;
      border: 1px solid #eee;
      padding: 10px 0 10px 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      outline: none;
      border-radius: 5px;
      margin-bottom: 5px;

      &:focus {
        border-color: #5ccdf8;
      }
    }
  }

}

.bing-configuration {
  padding: 20px;

  .bing-configuration-title {
    color: #9e9e9e;
    font-size: 14px;
    margin: 15px 0;

  }
}
</style>