<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  -webkit-overflow-scrolling: touch;
}
html,body,#app {
  width: 100%;
  height: 100%;
}
li {
  list-style: none;
}
.el-dialog__wrapper {
  width: 100% !important;
}
.sortContentWrpa {
  padding: 40px 0;
}
.el-input input {
  border: 1px solid #DCDFE6; /*no*/
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  background-color: transparent;
  border-color: #CCC;
  padding-left: 0 !important;
}
.el-dialog {
  width: 80% !important;
  border-radius: 10px;
}
.mint-header {
  background-image: linear-gradient( 153deg, rgb(255,215,0) 0%, rgb(10,200,30) 100%);
}
.myBtn {
  padding: 8px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #9400D3;
  color: white;
  border-radius: 5px;
}
.el-button span {
  font-size: 12px; /*no*/
}
.el-input__inner {
  font-size: 13px !important; /*no*/
  color: rgb(150,150,150) !important;
}
.mint-header-title {
  font-size: 15px !important; /*no*/
}
.goBack {
  width: 150px;
  position: relative;
  left: 20px;
  top: 20px;
  color: white;
  font-size: 15px; /*no*/
  z-index: 9999;
}
.el-dialog__title,.el-message-box__title>span {
  font-size: 16px !important;/*no*/
}
.dialog_sp,.el-select-dropdown__item>span,.el-radio__label,.el-checkbox__label {
  font-size: 15px !important;/*no*/
}
.el-textarea__inner {
  font-size: 15px !important;/*no*/
  color: #606266;
}
.el-message-box {
  width: 80% !important;
  padding: 30px 0;
}
.el-message-box__message>p {
  font-size: 14px !important;/*no*/
  padding: 5px 0;
}
.el-radio__inner,.el-checkbox__inner {
  width: 30px !important;
  height: 30px !important;
}
.el-checkbox__inner::after {
  width: 10px !important;
  height: 25px !important;
  left: 8px !important;
}
.picker-items{ 
  width:100%;
}
/*按钮css*/
.bubbly-button {
  width: 100%;
  cursor: pointer;
  font-family: 'Helvetica', 'Arial', sans-serif;
  display: inline-block;
  font-size: 1em;
  padding: 1em 2em;
  margin-top: 100px;
  margin-bottom: 60px;
  -webkit-appearance: none;
  appearance: none;
  background-color: #ff0081;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
}
.bubbly-button:focus {
  outline: 0;
}
.bubbly-button:before, .bubbly-button:after {
  position: absolute;
  content: '';
  display: block;
  width: 140%;
  height: 100%;
  left: -20%;
  z-index: -1000;
  transition: all ease-in-out 0.5s;
  background-repeat: no-repeat;
}
.bubbly-button:before {
  display: none;
  top: -75%;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
}
.bubbly-button:after {
  display: none;
  bottom: -75%;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
}
.bubbly-button:active {
  transform: scale(0.9);
  background-color: #e60074;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
}
.bubbly-button.animate:before {
  display: block;
  animation: topBubbles ease-in-out 0.75s forwards;
}
.bubbly-button.animate:after {
  display: block;
  animation: bottomBubbles ease-in-out 0.75s forwards;
}

@keyframes topBubbles {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
  }
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
  }
}
@keyframes bottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
  }
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
  }
}
</style>
