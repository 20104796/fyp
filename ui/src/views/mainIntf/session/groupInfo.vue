<template>
  <div class="info-container">
    <div class="info-card">
      <!--显示Group信息--->
      <!--Group头部: 头像 + 名字 + 简洁--->
      <div class="info-header">
        <div class="info-avatar">
          <img :src="info.avatar ? getAvatarPath(info.avatar) : require('@/static/logo.png')" alt="" width="65"
               height="65" style="object-fit: cover;">

        </div>
        <div class="info-name">
          <p>{{ info.name }}</p>
          <span style="font-size: 12px;color: rgba(0,0,0,0.5);">{{ info.announcement ? info.announcement :
              'No Grp Intro'
            }}</span>
        </div>
      </div>
      <!--Group详细介绍 --->
      <div class="info-content">
        <el-tabs stretch v-model="activeName">
          <!--Group首页内容/群细节 --->
          <el-tab-pane label="Information" name="index">
            <div class="info-item">
              <p class="info-item-title">Grp Intro</p>
              <p>Created at{{ describe }}</p>
            </div>
            <div class="info-item">
              <p class="info-item-title">Managers: </p>
              <p>{{ creator_name }}</p>
            </div>
            <div class="info-members">
              <p class="info-item-title">Members</p>
              <div class="info-members-items">
                <div class="info-members-item" v-for="item in info.members" :key="item.user_id">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                    <img :src="item.avatar ? getAvatarPath(item.avatar) : require('@/static/logo.png')"
                         alt="" width="40px" height="40px">
                  </el-tooltip>

                </div>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="Members" name="members">
            <el-table :data="info.members" style="width: 100%" height="300">
              <el-table-column prop="name" label="Username" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="nickname" label="Memo" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="" label="Add at:" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ new Date(scope.row.created_at).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column prop="" label="Last msg at:" align="center" show-overflow-tooltip>
                <template slot-scope="scope">

                  {{ scope.row.lastMessageTime ? new Date(scope.row.lastMessageTime).toLocaleString() : ""
                  }}
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="info-footer">
        <el-button style="width: 45%;" @click.prevent.stop="ShowinvitationFriend">Invite Friends</el-button>
        <el-button type="primary" style="width: 45%;" @click.prevent.stop="sendGroupMessage">Send Msg</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { groupInfo } from '@/api/grp';
import { toggleTime2 } from '@/utils/timeFormat';
export default {
  props: {
    group_id: {
      default: 0
    },
  },
  data() {
    return {
      info: "",
      editBtn: false,
      formData: {
        "old_group_id": "",
        "new_group_id": "",
        "user_id": "",
        "remark": ""
      },
      activeName: "index"

    }
  },
  created() {
    if (this.group_id != 0) {
      this.loadData()
    }
  },
  watch: {
    group_id(newgroup_id, oldgroup_id) {
      if (newgroup_id == oldgroup_id) {
        return
      }
      if (this.group_id != 0) {
        this.loadData()
      }
    },
    deep: true
  },
  computed: {
    describe() {
      return `${new Date(this.info.created_at).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')}:${this.info.announcement ? this.info.announcement :
          'No Grp Intro'}`
    },
    creator_name() {
      if (this.info.members) {
        for (const item of this.info.members) {
          if (this.info.creator_id == item.user_id) {
            return item.name
          }
        }
      } else {
        return ""
      }

    }
  },
  methods: {
    loadData() {
      groupInfo({ group_id: this.group_id })
          .then((res) => {
            if (res.code == 200) {
              this.info = res.data
            }
          })
    },
    //获取头像地址
    getAvatarPath(content) {
      if (content.includes("upload")) {
        return this.ipaddress + content
      }
      return content
    },
    //保存信息
    saveInfo() {
      updateFriend(this.formData)
          .then((res) => {
            if (res.code == 200) {
              this.$msg.success("Saved Successfully")
              this.options.group_id = this.formData.new_group_id
              this.loadData()
            } else {
              this.$msg.error(res.msg)
            }
          })
    },
    //去聊天
    sendGroupMessage() {
      let item = {
        room: this.info.room,
        group_id: this.info.id,
        name: this.info.name
      }
      this.$emit("sendGroupMessage", item)
    },
    //展示邀请好友列表
    ShowinvitationFriend() {
      this.$emit("ShowinvitationFriend", this.group_id)
    },

  },
}
</script>

<style lang="scss" scoped>
.info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f6f7;
  height: 100vh;
  width: calc(100vw - 260px);

  .info-card {
    background-color: #fff;
    width: 460px;
    height: 560px;
    border-radius: 5px;
    position: relative;
    box-shadow: 0 0 1px rgba($color: #000000, $alpha: 0.5);
    box-sizing: border-box;
    padding: 10px 20px;

    .info-header {
      display: flex;
      align-items: center;
      height: 90px;
      position: relative;

      img {
        border-radius: 5px;
      }

      .info-name {
        margin-left: 20px;
        line-height: 1.5;
        font-size: 20px;
      }
    }

    .info-content {
      height: calc(560px - 180px);

      .info-item {
        display: flex;
        font-size: 14px;
        margin: 10px 0;
        align-items: center;

        .info-item-title {
          color: #87CEEB;
          width: 80px;
          font-size: 12px;
          letter-spacing: 0.1em;
        }
      }

      .info-members {
        font-size: 14px;
        margin: 10px 0;
        height: 245px;
        overflow: auto;

        .info-item-title {
          color: #87CEEB;
          width: 80px;
          font-size: 12px;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .info-members-items {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-gap: 10px;
        }
      }
    }
  }
}
</style>