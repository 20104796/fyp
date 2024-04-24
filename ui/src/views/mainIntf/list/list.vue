<template>
  <div class="list" @click="showAdd = false">

    <!--最上面的搜索框-->
    <div class="search">
      <el-input placeholder="Search" prefix-icon="el-icon-search" v-model="search" class="search-input" />
      <div class="search-add">
        <el-button type="text" icon="el-icon-plus" style="padding:0;color: #000;"
                   @click.stop="showAdd = true"></el-button>
      </div>
      <!--右边小案件 添加好友之类的-->
      <div class="search-mune" v-if="showAdd">
        <div class="search-menu-item" @click="openAddDialog">Add Frd/Grp</div>
        <div class="search-menu-item" @click="openCreateDialog">Create Group</div>
      </div>
    </div>


    <div class="chat-list" v-if="current == 'chat'">
      <Chat v-if="current == 'chat'" ref="chat" @chooseRoom="chooseRoom"></Chat>
    </div>

    <div class="contact-list" v-else>
      <Contact v-if="current == 'contact'" ref="contact" @showFriendInfo="showFriendInfo"
               @openCreateDialog="openCreateDialog" @showGroupInfo="showGroupInfo" @ShowinvitationFriend="ShowinvitationFriend"></Contact>
    </div>


    <!--展示小窗 添加好友-->
    <el-dialog :visible.sync="showAddDialog" width="600px" custom-class="add-dialog" top="25vh">
      <el-tabs v-model="activeName" stretch>
        <el-tab-pane label="Find Friend" name="find_friend">

          <div>
            <div style="display: flex;">
              <el-input placeholder="Input User name of Friend" prefix-icon="el-icon-search" v-model="username"
                        style="height: 32px;" @keyup.enter.native="searchData('frd')">
              </el-input>
              <button class="search-btn" @click="searchData('frd')">Find</button>
            </div>
            <div class="list" v-if="friendList.length != 0">
              <div class="list-item" v-for="item in friendList" :key="item.username">
                <img :src="require('@/static/logo.png')" alt="" width="50" height="50" style="object-fit: cover;">
                <!---点击之后展示是否真的添加-->
                <div class="list-item-desc">
                  <p class="list-item-username">{{ item.name }}({{ item.username }})</p>
                  <button v-if="!item.status" @click="addFriend(item.username, item.id)">Add</button>
                  <span  v-if="item.status" style="font-size: 12px;color: red;">Have been frd</span>
                </div>
              </div>
            </div>
          </div>

        </el-tab-pane>
        <!--展示小窗 添加群聊-->
        <el-tab-pane label="Find Group" name="find_group">
          <div style="display: flex;">
            <el-input placeholder="Group name" prefix-icon="el-icon-search" v-model="name" style="height: 32px;"
                      @keyup.enter.native="searchData('grp')">
            </el-input>
            <button class="search-btn " @click="searchData('grp')">Find</button>
          </div>
          <div class="list" v-if="groupList.length != 0">
            <div class="list-item" v-for="item in groupList" :key="item.group_id">
              <img :src="require('@/static/logo.png')" alt="" width="50" height="50"
                   style="object-fit: cover;">
              <div class="list-item-desc">
                <p class="list-item-username">{{ item.name }} ({{ item.number }})</p>
                <button v-if="!item.status" @click="joinGroup(item.name, item.group_id)">Join in</button>
                <span  v-if="item.status" style="font-size: 12px;color: red;">Have been in</span>

              </div>
            </div>
          </div>

        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--创建群聊-->
    <el-dialog title="Create Group" :visible.sync="showCreateDialog" width="660px" custom-class="create-dialog" top="20px">
      <!--选人-->
      <div class="create-step-first" :style="create_ani" v-if="!step">
        <div class="members-chooses">
          <!--展示所有好友-->
          <div class="all-frd">
            <div class="header">
              Friend List
            </div>
            <el-tree :data="FriendTree" :props="defaultProps" show-checkbox @check="CheckChange" ref="tree">
              <div slot-scope="{ node, data }">
                <div v-if="data.children">
                  {{ node.label }} {{ data.len + '/' + data.len }}
                </div>
                <div v-else class="tree-item">
                  <div class="tree-item-avatar">
                    <img :src="require('@/static/sidebar/avatar.jpg')" alt="" width="30" height="30"
                         style="object-fit: cover;">
                  </div>
                  <div class="tree-item-info">
                    {{ node.label }}

                  </div>
                </div>

              </div>
            </el-tree>
          </div>
          <!--展示已邀请的好友-->
          <div class="members-the-select">
            <div class="header">
              Invite Friends List
            </div>
            <div v-for="item in formData.members" :key="item.id" class="members-the-select-item">
              <div class="members-the-select-avatar">
                <img :src="require('@/static/sidebar/avatar.jpg')" alt="" width="45" height="45"
                     style="object-fit: cover;">
              </div>
              <div class="members-the-select-avatar-info">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <!--下一步-->
        <div style="margin-top: 10px;text-align: right;">
          <el-button type="primary" @click="nextStep">Next Step</el-button>
        </div>
      </div>
      <!--设置群的具体信息-->
      <div class="create-step-second" v-else :style="create_ani2">

        <el-form :model="formData" label-position="left" style="padding: 20px 10px" ref="ruleForm">
          <!--头像-->
          <el-form-item label="Grp Avatar:" label-width="140px" style="font-size: 18px" prop="scriptContent">
            <el-upload accept=".jpg,.png,.gif,.webp,.jpeg" :class="!showUploadList ? 'upload-cancle' : ''"
                       action="#" list-type="picture-card" v-if="showCreateDialog" :auto-upload="false"
                       :on-change="handleChange" :on-remove="removeFile" drag :limit="1">
              <i slot="default" class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <!--名字-->
          <el-form-item label="Grp Name:" label-width="140px" style="font-size: 18px" prop="ployId">
            <el-input v-model="formData.name" auto-complete="off" style="width: 400px" maxlength="10"
                      show-word-limit />
          </el-form-item>
          <!--Intro-->
          <el-form-item label="Intro:" label-width="140px" style="font-size: 18px" prop="ploySubId">
            <el-input v-model="formData.announcement" auto-complete="off" style="width: 400px" type="textarea"
                      maxlength="30" show-word-limit />
          </el-form-item>
        </el-form>
        <div style="margin-top: 10px;text-align: right;">
          <el-button type="primary" @click="previousStep">Forward</el-button>
          <el-button type="primary" @click="CreateGroup">Create Group</el-button>
        </div>
      </div>
    </el-dialog>

    <!--邀请好友 右键-->
    <el-dialog title="Invite Friend" :visible.sync="showInvitationDialog" width="660px" custom-class="create-dialog" top="20px">
      <div class="create-step-first">
        <!--选择朋友页面-->
        <div class="members-chooses">
          <div class="all-frd">
            <!--左边朋友列表--->
            <div class="header">
              Friend List
            </div>
            <el-tree :data="FriendTree" :props="defaultProps" show-checkbox @check="CheckChange2" ref="tree2">
              <div slot-scope="{ node, data }">
                <!--2/2--->
                <div v-if="data.children">
                  {{ node.label }} {{ data.len + '/' + data.len }}
                </div>
                <!--具体朋友信息--->
                <div v-else class="tree-item">
                  <div class="tree-item-avatar">
                    <img :src="data.avatar ? getAvatarPath(data.avatar) : require('@/static/logo.png')"
                         alt="" width="30" height="30" style="object-fit: cover;">
                  </div>
                  <div class="tree-item-info">
                    {{ node.label }}
                  </div>
                </div>
              </div>
            </el-tree>
          </div>
          <!--右边已经选择列表--->
          <div class="members-the-select">
            <div class="header">
              Selected Friends
            </div>
            <div v-for="item in invitationList" :key="item.id" class="members-the-select-item">
              <div class="members-the-select-avatar">
                <img :src="item.avatar ? getAvatarPath(item.avatar) : require('@/static/logo.png')" alt="" width="45" height="45" style="object-fit: cover;">
              </div>
              <div class="members-the-select-avatar-info">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;text-align: right;">
          <el-button type="primary" @click="toCompleteInvitation">Invite</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Chat from './chatting.vue';
import Contact from './contactList.vue';
import { getListFrd, friendAdd, friendSearch } from '@/api/frd';
import { createGroup, groupSearch, groupJoin, groupInvitation } from '@/api/grp';
export default {
  name: "List",
  components: {
    Chat,
    Contact
  },
  props: {
    current: {
      default: 'chat',

    }
  },
  data() {
    return {
      search: "",
      showAdd: false,
      /**
       * 添加相关
       */
      showAddDialog: false,
      name: "",
      username: "",
      friendList: [],
      groupList: [],
      activeName: "find_friend",
      /**
       * 创建群聊
       */
      showCreateDialog: false,
      FriendTree: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        len: 'len'
      },
      formData: {
        "name": "",
        "creator_id": 0,
        "avatar": "",
        "announcement": "",
        "members": []
      },
      //邀请好友
      showInvitationDialog: false,
      invitationList: [],
      invitationformData: {
        invitationList: [],
        group_id: 0,
      },
      showUploadList: true,
      create_ani: "",
      create_ani2: "",
      step: false,

    };
  },
  methods: {
    //打开添加好友/群聊窗口
    openAddDialog() {
      this.showAddDialog = true
      this.name = ""
      this.username = ""
      this.friendList = []
      this.groupList = []

    },
    //搜索好友/群聊
    searchData(t) {
      if (t == 'frd') {
        if (!this.username) {
          return
        }
        friendSearch({ username: this.username })
            .then((res) => {
              let friendList = []
              if (res.code == 200) {
                friendList = res.data
              }
              this.friendList = friendList
            })
      } else {
        if (!this.name) {
          return
        }
        groupSearch({ name: this.name })
            .then((res) => {
              if (res.code == 200) {
                let groupList = []
                if (res.code == 200) {
                  groupList = res.data
                }
                this.groupList = groupList
              }
            })
      }
    },
    //添加好友
    addFriend(username, id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        msg: h('p', null, [
          h('span', null, 'Want to add '),
          h('span', { style: 'color: #51cf66' }, username),
          h('span', null, 'as your frd?'),
        ]),
        showCancelButton: true,
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        cancelButtonClass: "cancelButtonClass",
        confirmButtonClass: "confirmButtonClass",
        type: 'success'
      })
          .then(() => {
            friendAdd({ username: username, id: id })
                .then((res) => {
                  if (res.code == 200) {
                    this.$msg.success("Add successfully")
                    this.showAddDialog = false
                    this.$emit('sendFriendMessage', res.data);
                  } else {
                    this.$msg.error(res.msg)
                  }
                })
          })
    },
    //加入群聊
    joinGroup(name, group_id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        msg: h('p', null, [
          h('span', null, 'Wanna join '),
          h('span', { style: 'color: #51cf66' }, name),
          h('span', null, 'grp?'),
        ]),
        showCancelButton: true,
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        cancelButtonClass: "cancelButtonClass",
        confirmButtonClass: "confirmButtonClass",
        type: 'success'
      })
          .then(() => {
            groupJoin({ group_id })
                .then((res) => {
                  if (res.code == 200) {
                    this.$msg.success("Add successfully")
                    this.$emit('sendGroupMessage', res.data);
                  } else {
                    this.$msg.error(res.msg)
                  }
                })
          })
    },
    updatecurrentRoom(user_id,group_id) {
      this.$refs.chat.updatecurrentRoom(user_id,group_id)
    },
    /**
     * 添加群聊相关
     * */
    async openCreateDialog() {
      await this.loadFriendData()
      this.showCreateDialog = true;
      this.formData = {
        "name": "",
        "avatar": "",
        "announcement": "",
        "members": []
      }
      this.step = false
      this.create_ani = ""
      this.create_ani2 = ""
      this.showUploadList = true
    },
    //加载所有好友
    async loadFriendData() {
      let res = await getListFrd()
      if (res.code == 200) {
        let FriendTree = []
        for (const item of res.data) {
          let frd = { label: item.name, children: [], len: item.frd.length }
          for (const f of item.frd) {
            frd.children.push({ label: f.remark, value: f.user_id, avatar: f.avatar })
          }
          FriendTree.push(frd)
        }
        this.FriendTree = FriendTree
      }
    },
    //当复选框被修改
    CheckChange() {
      let members = []
      let checkList = this.$refs.tree.getCheckedNodes()
      for (const item of checkList) {
        if (item.children && item.children.length >= 0) {
          continue
        }
        members.push({ id: item.value, name: item.label, avatar: item.avatar })
      }
      this.formData.members = members
    },
    //下一步
    nextStep() {
      if (this.formData.members.length == 0) {
        return this.$msg.warning("Please choose member!!!")
      }
      this.create_ani = "opacity: 0;"
      setTimeout(() => {
        this.create_ani = "display: none"
        this.step = true
      }, 900);
    },
    previousStep() {
      this.create_ani = "opacity: 1;"
      this.create_ani2 = "opacity: 0;"
      setTimeout(() => {
        this.create_ani2 = "display: none"
        this.step = false
      }, 900);
    },
    CreateGroup() {
      if (this.formData.name == "") {
        return this.$msg.warning("Grp Name cannot be null")
      }
      let formData = new FormData();
      formData.append("name", this.formData.name)
      formData.append("avatar", this.formData.avatar)
      formData.append("announcement", this.formData.announcement)
      formData.append("members", JSON.stringify(this.formData.members))
      createGroup(formData)
          .then((res) => {
            if (res.code == 200) {
              this.$msg.success("Created Successfully")
              this.showCreateDialog = false
              this.$emit('sendGroupMessage', res.data);
            } else {
              this.$msg.error(res.msg)
            }
          })
    },
    /**
     * 文件相关
     */

    //上传前判断
    removeFile() {
      this.formData.avatar = "";
      this.showUploadList = true;
    },
    handleChange(file) {
      this.formData.avatar = file.raw;
      if (file.raw) {
        this.showUploadList = false;
      }
    },
    /**
     * 聊天框相关参数
     */
    //选择聊天用户
    chooseRoom(item) {
      this.$emit('chooseRoom', item);
    },
    loadListData() {
      this.$refs.chat.loadData()
    },
    //去聊天
    toChat() {
      this.current = 'chat'
      this.$emit('ListChangeStatus', 'chat');
      this.showAddDialog = false;
    },
    /**
     * 好友/群聊详情相关方法
     */
    showFriendInfo(item) {
      this.$emit('showFriendInfo', item)
    },
    showGroupInfo(item) {
      this.$emit('showGroupInfo', item)
    },
    async ShowinvitationFriend(group_id) {
      await this.loadFriendData()
      this.invitationList = []
      this.invitationformData = {
        group_id,
        invitationList: []
      }
      this.showInvitationDialog = true

    },
    CheckChange2() {
      let invitationList = []
      let checkList = this.$refs.tree2.getCheckedNodes()
      for (const item of checkList) {
        if (item.children && item.children.length >= 0) {
          continue
        }
        invitationList.push({ id: item.value, name: item.label, avatar: item.avatar })
      }
      this.invitationList = invitationList
    },
    //完成邀请
    toCompleteInvitation() {
      if (this.invitationList.length == 0) {
        return this.$msg.warning("Please select friends before inviting!!!")
      }
      for (const { id } of this.invitationList) {
        this.invitationformData.invitationList.push(id)
      }
      groupInvitation(this.invitationformData)
          .then((res) => {
            if (res.code == 200) {
              this.$msg.success("Successfully invited")
              this.showInvitationDialog = false
              this.$refs.contact.loadGroupData()
            } else {
              this.$msg.error(res.msg)
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
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;

  .list {
    width: 220px;
    box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.5);

    .search {
      position: relative;
      margin-top: 20px;
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding-left: 10px;
      display: flex;
      align-items: center;

      .search-input {
        width: 170px;
        height: 25px;
      }

      .search-add {
        box-sizing: border-box;
        padding: 3px;
        text-align: center;
        margin-left: 8px;
        color: #000;
        font-weight: bold;
      }

      .search-mune {
        width: 100px;
        text-align: left;
        position: absolute;
        top: 42px;
        right: 17px;
        z-index: 999;
        box-shadow: 0 0 3px rgb(0 0 0 / 50%);
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        background-color: white;

        .search-menu-item {
          cursor: pointer;
          width: 100%;
          height: 35px;
          padding-left: 10px;
          box-sizing: border-box;
          line-height: 35px;

          &:hover {
            background-color: #eee;
          }
        }
      }
    }




  }
}

::v-deep .el-input--prefix .el-input__inner {
  height: 25px;
}

::v-deep .el-input__prefix {
  top: -7px;
}

::v-deep .el-tree-node__expand-icon.is-leaf {
  display: none;
}

::v-deep .el-tree-node__content {
  height: auto;
}

::v-deep .add-dialog {
  padding-bottom: 20px;

  .el-dialog__body {
    padding: 0 20px;

    .el-input__inner {
      height: 32px;
    }

    .el-input__prefix {
      top: -3px;
    }

    .search-btn {
      cursor: pointer;
      width: 100px;
      height: 32px;
      border: none;
      border-radius: 2px;
      background-color: #1e6fff;
      color: white;
      margin-left: 20px;
    }

    .list {
      margin-top: 20px;
      box-sizing: border-box;
      padding: 20px;
      width: 100%;
      background-color: #f7f7f7;
      display: grid;
      grid-template-columns: repeat(3, 180px);
      grid-gap: 10px;
      max-height: 500px;
      overflow: auto;

      .list-item {
        display: flex;
        align-items: center;
        font-size: 15px;

        .list-item-desc {
          margin-left: 10px;
          width: 50%;


          .list-item-username {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          button {
            cursor: pointer;
            width: 50px;
            height: 20px;
            border: none;
            border-radius: 2px;
            font-size: 12px;
            background-color: #1e6fff;
            color: white;
            margin-top: 10px;
          }
        }

      }
    }
  }
}

::v-deep .create-dialog {
  padding-bottom: 20px;
  height: 520px;
  overflow: auto;

  .el-dialog__body {
    padding: 10px 20px;

    .create-step-first {
      opacity: 1;
      transition: opacity 0.8s ease;
    }

    .create-step-second {
      opacity: 1;
      transition: opacity 0.8s ease;
    }

    .members-chooses {
      width: 400px;
      width: 100%;
      display: flex;


      .all-frd {
        box-shadow: 0 0 1px rgba($color: #000000, $alpha: 0.5);
        height: 400px;
        overflow: auto;
        flex: 1;

        .header {
          height: 50px;
          background-color: #f5f7fa;
          width: 100%;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tree-item {
          cursor: pointer;
          padding: 5px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .tree-item-info {
            white-space: nowrap;
            margin-left: 10px;
            width: 120px;
            overflow: hidden;
          }
        }
      }

      .members-the-select {
        box-shadow: 0 0 1px rgba($color: #000000, $alpha: 0.5);
        flex: 1;
        height: 400px;
        overflow: auto;

        .header {
          height: 50px;
          background-color: #f5f7fa;
          width: 100%;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .members-the-select-item {
          display: flex;
          padding: 10px 20px 0px;
          align-items: center;
          font-size: 18px;
          border-bottom: 2px solid #eee;

          .members-the-select-avatar-info {
            margin-left: 20px;
          }
        }
      }
    }

  }
}

::v-deep .el-upload-dragger {
  width: inherit;
  height: inherit;
}

.upload-cancle ::v-deep .el-upload {

  display: none;
}
</style>