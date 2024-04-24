<template>
  <div class="contact-list">
    <el-tabs v-model="activeName" stretch>
      <!--左列展示Friends-->
      <el-tab-pane label="Friends" name="chat">

        <div style=" width: 100%; height: calc(100vh - 120px);overflow: auto;" class="contact" @contextmenu.prevent.stop="showMenu">
          <el-tree :data="FriendList" :props="defaultProps">
            <div slot-scope="{ node, data }">
              <!--这里是展示不同的下拉朋友分组的-->
              <div v-if="data.children" @contextmenu.prevent.stop="showFriendMenu(node.label, $event)">
                                <span :style="data.children.length == 0 ? 'padding-left:24px' : ''"> {{ node.label }} {{
                                    data.len + '/' + data.len
                                  }}</span>

              </div>
              <!--这里是展示下拉朋友分组的具体朋友-->
              <div v-else class="tree-item" @click="showFriendInfo(data)" @contextmenu.prevent.stop="">
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


      </el-tab-pane>
      <!--右列展示Groups-->
      <el-tab-pane label="Groups" name="groupChat">
        <div style=" width: 100%;
                height: calc(100vh - 120px);overflow: auto;" @contextmenu.prevent.stop="showGroupMenu">
          <div class="grp-tree-item" v-for="item in groupList" :key="item.id"
               @contextmenu.prevent.stop="showGroupItemMenu(item.name, item.id, $event)"
               @click="showGroupInfo(item.id)" :style="group_current == item.id ? 'background:#eee' : ''">
            <div class="grp-tree-item-avatar">
              <img :src="item.avatar ? getAvatarPath(item.avatar) : require('@/static/logo.png')" alt=""
                   width="40" height="40" style="object-fit: cover;">
            </div>
            <div class="grp-tree-item-info">
              {{ item.name }} ({{ item.members_len + '/' + item.members_len }})
            </div>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>
    <div class="menu" v-if="isShowMenu" :style="{ 'left': menuLeft + 'px', 'top': menuTop + 'px' }">
      <home-menu :menus="menus" @hiddenMenu="hiddenMenu" />
    </div>
  </div>
</template>

<script>
import { getListFrd, friendGroupList, postCreate } from '@/api/frd';
import { groupList, exitGroup, renameGroup } from '@/api/grp';
import homeMenu from '@/comp/HomeMenu'

export default {
  name: 'Contact',
  components: {
    homeMenu
  },
  data() {
    return {
      search: "",
      showAdd: false,
      activeName: "chat",
      FriendList: [],
      groupList: [],
      friendgroupList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        len: 'len',
        user_id: 'user_id',
        group_id: 'group_id',
      },
      menus: [],
      group_current: 0,
      /**
       * 菜单相关
       */
      isShowMenu: false,
      menuLeft: 0,
      menuTop: 0,
      //原分组名
      old_name: "",
    };
  },
  created() {
    this.loadData()
    document.addEventListener('click', () => {
      this.isShowMenu = false
    })
    document.addEventListener('mousedown', (e) => {
      const { button } = e
      if (button === 2) {
        this.isShowMenu = false
      }
    })
  },
  methods: {
    loadData() {
      //加载好友列表
      this.loadFriendData()
      //加载群聊列表
      this.loadGroupData()
      //加载分组列表
      this.loadGroupList()
    },
    loadFriendData() {
      getListFrd()
          .then((res) => {
            if (res.code == 200) {
              let FriendList = []
              for (const item of res.data) {
                let frd = { label: item.name, children: [], len: item.frd.length }
                for (const f of item.frd) {
                  frd.children.push({ label: f.remark, value: f.user_id, group_id: f.group_id, user_id: f.user_id, avatar: f.avatar })
                }
                FriendList.push(frd)
              }
              this.FriendList = FriendList
            }
          })
    },
    loadGroupData() {
      groupList()
          .then((res) => {
            if (res.code == 200) {
              let groupList = res.data
              this.groupList = groupList
            }
          })
    },
    //加载当前用户所有分组
    loadGroupList() {
      friendGroupList()
          .then((res) => {
            if (res.code == 200) {
              let friendgroupList = []
              for (const item of res.data) {
                let friendgroup = { label: item.name, value: item.id }

                friendgroupList.push(friendgroup)
              }
              this.friendgroupList = friendgroupList
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
    /**
     * 好友相关方法
     */
    showFriendInfo(data) {
      this.group_current = 0
      this.$emit('showFriendInfo', { group_id: data.group_id, user_id: data.user_id, friendgroupList: this.friendgroupList });
    },
    /**
     * 群聊相关
     */
    showGroupInfo(id) {
      this.group_current = id
      this.$emit('showGroupInfo', id);
    },
    /**
     * 菜单相关
     */
    // Friends 右键单机之后
    showMenu(e) {
      this.menus = [
        { name: "Add New Class", RowClick: this.AddGroup },
        { name: "Refresh", RowClick: this.refreshGroup },
      ]
      this.isShowMenu = true
      this.menuLeft = e.pageX
      this.menuTop = e.pageY
    },
    //选定 我的好友之后出现的菜单
    showFriendMenu(label, e) {
      this.old_name = label
      this.menus = [
        { name: "Rename", RowClick: this.renameGroup },
        { name: "Add New Class", RowClick: this.AddGroup },
        { name: "Refresh", RowClick: this.refreshGroup },
        { name: "Delete Class", RowClick: this.refreshGroup },
      ]
      this.isShowMenu = true
      this.menuLeft = e.pageX
      this.menuTop = e.pageY
    },
    // Groups 右键单机之后
    showGroupMenu(e) {
      this.menus = [
        { name: "Add ", RowClick: () => { this.$emit("openCreateDialog") } },
        { name: "Refresh", RowClick: this.loadGroupData },
      ]
      this.isShowMenu = true
      this.menuLeft = e.pageX
      this.menuTop = e.pageY
    },
    //
    showGroupItemMenu(label, group_id, e) {
      this.group_current = group_id
      this.menus = []
      let user_id = this.$store.getters.userInfo.id
      for (const { id, creator_id, name } of this.groupList) {
        if (id == group_id) {
          if (creator_id == user_id) {
            this.menus.push({ name: "Rename", RowClick: () => { this.renameGroup(label, id) } })
            break
          }
        }
      }
      this.menus.push(
          { name: "Invite friends", RowClick: () => { this.$emit("ShowinvitationFriend", group_id) } },
          { name: "Create New Group", RowClick: () => { this.$emit("openCreateDialog") } },
          { name: "Refresh", RowClick: this.loadGroupData },
          { name: "Leave Group", RowClick: () => { this.ToExitGroupChat(group_id) } },)
      this.isShowMenu = true
      this.menuLeft = e.pageX
      this.menuTop = e.pageY
    },
    hiddenMenu() {
      this.isShowMenu = false
    },
    //添加分组
    //Friends 中添加功能 Add new Class 后弹出对话框
    AddGroup() {
      this.$prompt('Input new Class name', 'Create Class', {
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        inputValidator: this.inputValidator,
      }).then(({ value }) => {
        postCreate({ name: value, username: this.$store.getters.userInfo.username, user_id: this.$store.getters.userInfo.id })
            .then((res) => {
              if (res.code == 200) {
                this.$msg.success("Create Successfully")
                //加载好友列表
                this.loadFriendData()
                //加载分组列表
                this.loadGroupList()
              } else {
                this.$msg.error(res.msg)
              }
            })
      })
    },
    inputValidator(text) {
      if (text) {
        return true
      } else {
        return "Class Name cannot be null"
      }
    },
    /***
     * 群聊相关
     */
    //重命名群聊
    renameGroup(old_name, group_id) {
      this.$prompt('Input New Group Name', 'Rename', {
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValue: old_name,
        inputValidator: this.inputValidator,
      }).then(({ value }) => {
        renameGroup({ name: value, old_name, group_id })
            .then((res) => {
              if (res.code == 200) {
                this.$msg.success("Renamed Successfully")
                this.loadGroupData()
              } else {
                this.$msg.error(res.msg)
              }
            })
      })
    },
    //退出群聊
    ToExitGroupChat(group_id) {
      let group_name = ""
      let user_id = this.$store.getters.userInfo.id
      let tips = ""
      for (const { id, creator_id, name } of this.groupList) {
        if (id == group_id) {
          group_name = name
          if (creator_id == user_id) {
            tips = `Wanna exit <span style="color:red">${group_name}</span> grp ?`
          } else {
            tips = `Wanna exit <span style="color:red">${group_name}</span> grp ?`
          }
        }
      }
      this.$confirm(tips, 'Tip', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        exitGroup({ group_id })
            .then((res) => {
              if (res.code == 200) {
                this.$msg.success("Exit successfully")
                this.loadGroupData()
              } else {
                this.$msg.error(res.msg)
              }
            })
      })
    },
    //刷新分组
    refreshGroup() {
      this.loadData()
    }
  },
}
</script>

<style lang="scss" scoped>
.contact-list {
  width: 100%;
  height: calc(100vh - 70px);

  .contact {
    .contact-headers {
      color: #999999;
      font-size: 12px;
      margin: 10px 0;
      margin-left: 10px;
    }

    .contact-new {
      cursor: pointer;
      padding: 5px 10px;
      display: flex;
      align-items: center;

      .contact-new-info {
        white-space: nowrap;
        margin-left: 10px;
        width: 120px;
        overflow: hidden;
      }

      &:hover {
        background-color: #eee;
      }
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


  .grp-tree-item {
    cursor: pointer;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #eee;
    }

    &:focus {
      background-color: #eee;

    }

    &::selection {
      background-color: #eee;

    }

    .grp-tree-item-info {
      white-space: nowrap;
      margin-left: 10px;
      width: 120px;
      overflow: hidden;

    }
  }
}

.menu {
  position: fixed;
  z-index: 1004;
  background-color: #fff;
  border-radius: 5px;
}
</style>