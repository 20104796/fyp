<template>
  <div class="login-container" :style="sty">
    <div class="avatar">
      <img :src="require('@/static/sidebar/avatar.jpg')" alt="" width="55" height="55"
           style="object-fit: cover;object-position: center;">
    </div>
    <div class="form">
      <div class="form-user">
        <img src="../../../static/login/user.png" alt="" width="20px" class="form-icon">
        <input type="text" placeholder="Username" v-model="formData.username">
      </div>
      <div class="form-password">
        <img src="../../../static/login/lock.png" alt="" width="20px" class="form-icon">
        <input type="password" placeholder="Password" v-model="formData.password" @keydown.enter="submitForm">
      </div>
      <div class="form-options">
        <span class="forget-password" @click="toForgetPassword">FindPwd</span>
      </div>
      <button class="form-button" @click="submitForm">
        <span class="form-btn-text"> Login</span>
      </button>

    </div>
    <div class="footer">
      <div @click="toRegister" style="cursor: pointer;">Register</div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "@/api/auth.js";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      autoLogin: false,
      rememberPassword: false,
      sty: "",
      formData: {
        username: "",
        password: ""
      }
    }
  },
  created() {
    this.formData = {
      username: window.localStorage.getItem("last_username"),
      password: window.localStorage.getItem("last_password"),
    }
    this.rememberPassword = window.localStorage.getItem("remember_password") == 'true'
    this.autoLogin = window.localStorage.getItem("auto_login") == 'true'
    if (this.autoLogin) {
      this.submitForm()
    }
  },
  methods: {
    ...mapActions(["Login"]),
    submitForm() {
      if (!(this.formData.username && this.formData.password)) {
        return this.$msg.warning("Fill in full information!!")
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      loginUser(this.formData)
          .then((res) => {
            if (res.code == 200) {
              this.Login(res.data);
              this.$msg.success("login successfully");
              if (this.rememberPassword) {
                window.localStorage.setItem("last_password", this.formData.password)
              } else {
                window.localStorage.setItem("last_password", "")
              }
              this.$router.push("/");
            } else {
              this.$msg.error(res.msg);

              this.formData.password = ""
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            window.localStorage.setItem("last_username", this.formData.username)
            loading.close()
          })

    },

    toRegister() {
      this.sty = 'transform: translateX(-100vw);opacity: 0;'
      setTimeout(() => {
        this.$emit('toLink', "register")

      }, 1000);
    },
    toForgetPassword() {
      this.sty = 'transform: translateX(-100vw);opacity: 0;'
      setTimeout(() => {
        this.$emit('toLink', "forgetPassword")
      }, 1000);
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: all 1s ease-in;
  opacity: 1;
  position: relative;

  .avatar {
    position: absolute;
    overflow: hidden;
    border-radius: 50%;
    width: 55px;
    height: 55px;
    top: -35px;
    z-index: 999;
    // margin-top: -35px;
    // margin-bottom: 10px;

  }

  .form {
    position: relative;
    margin-top: 35px;
    z-index: 10;

    .form-user,
    .form-password {
      position: relative;

      .form-icon {
        position: absolute;
        top: 4px;
      }

      input {
        width: 200px;
        border: 0px;
        padding: 5px 0 5px 25px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        font-size: 16px;
        outline: none;
        margin-bottom: 5px;

        &:focus {
          border-bottom-color: #5ccdf8;
        }
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #cacaca;

      .form-checkbox {

        display: flex;
        align-items: center;

        label {
          cursor: pointer;
        }
      }

      .forget-password {
        cursor: pointer;
        width: 50px;

        &:hover {
          color: #c0c0c0;
        }
      }

    }

    .form-button {
      cursor: pointer;
      color: white;
      background-color: #05bbfb;
      margin-top: 15px;
      width: 200px;
      height: 30px;
      border: 0;
      border-radius: 5px;
      font-size: 12px;
      box-shadow: inset 0 0px 2px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.2s ease-in-out;
      z-index: 10;

      &:active {
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.3);
      }
    }

  }

  .footer {
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: -20px;
    box-sizing: border-box;
    padding: 0 5px;
    font-size: 10px;
    color: #cacaca;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;


  }
}
</style>