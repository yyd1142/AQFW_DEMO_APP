/**
 * Created by queue on 2017/9/4.
 */
import DialogBox from './DialogBox.vue';

class MkoDialogBox {
  constructor() {
  }
}


MkoDialogBox.installed = false;

MkoDialogBox.install = function (Vue, options) {
  Vue.prototype.$MKODialog = function (op) {
    return new Promise(function (resolve, reject) {
      const tpl = `<dialog-box :title="title" :msg="message" :cancel-btn="cancelBtn" :confirm-btn="confirmBtn" :cancel-text="cancelText" :confirm-text="confirmText"  @confirm="confirm" @close="close" v-if="show"></dialog-box>`;
      let div = document.getElementById('MKODialog');
      if (div) {
        div.innerHTML = '';
        div.innerHTML = tpl;
      } else {
        div = document.createElement('div');
        div.id = 'MKODialog';
        div.innerHTML = tpl;
        document.body.appendChild(div);
      }

      window.MKODialogShow = new Vue({
        el: div,
        data: {
          show: true,
          title: op.title,
          message: op.msg,
          cancelBtn: op.cancelBtn,
          cancelText: op.cancelText,
          confirmText: op.confirmText,
          confirmBtn: op.confirmBtn
        },
        created(){
        },
        methods: {
          confirm(){
            this.show = false;
            resolve('confirm')
          },
          close(){
            this.show = false;
            resolve('cancel')
          }
        },
        components: {
          DialogBox
        }
      });
    });
  };
};

export default MkoDialogBox;
