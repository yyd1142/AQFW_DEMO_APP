/**
 * Created by queue on 2017/8/23.
 */
import Vue from 'vue'
import MkoInfoBar from './Bar/InfoBar.vue'
import MkoButton from './Button/Button.vue'
import MkoCheckBox from './Button/CheckBox.vue'
import MkoNumberButton from './Button/NumberButton.vue'
import MkoEditCard from './Card/EditCard.vue'
import MkoDialogBox from './DialogBox/index.js'
import MkoFormCell from './Form/FormCell.vue'
import MkoSelectBox from './Form/SelectBox.vue'
import MkoTextarea from './Form/Textarea.vue'
import MkoCell from './List/BasicCell.vue'
import MkoDoubleCell from './List/DoubleCell.vue'
import MkoMenuHeader from './Menu/MenuHeader.vue'
import MkoMenuCell from './Menu/MenuCell.vue'
import MkoHeader from './Header/index.vue'
import MkoPopupBottom from './Popup/PopupBottom.vue'
import MkoPopupRight from './Popup/PopupRight.vue'
import MkoSearchBar from './SearchBar/SearchBar.vue'
import MkoDropdowns from './Dropdowns/Dropdowns.vue'
import MkoNavBar from './Tabs/NavBar.vue'
import MkoTabItem from './Tabs/TabItem.vue'

Vue.use(MkoDialogBox);

export {
    MkoInfoBar,
    MkoButton,
    MkoCheckBox,
    MkoNumberButton,
    MkoEditCard,
    // MkoDialogBox,
    MkoFormCell,
    MkoSelectBox,
    MkoTextarea,
    MkoCell,
    MkoDoubleCell,
    MkoMenuHeader,
    MkoMenuCell,
    MkoHeader,
    MkoPopupBottom,
    MkoPopupRight,
    MkoSearchBar
}


class MkoUI {
    constructor() {
    }
}

MkoUI.installed = false;
MkoUI.install = function (Vue, options) {

    Vue.component('MkoInfoBar', MkoInfoBar);
    Vue.component('MkoButton', MkoButton);
    Vue.component('MkoCheckBox', MkoCheckBox);
    Vue.component('MkoNumberButton', MkoNumberButton);
    Vue.component('MkoEditCard', MkoEditCard);
    Vue.component('MkoFormCell', MkoFormCell);
    Vue.component('MkoSelectBox', MkoSelectBox);
    Vue.component('MkoTextarea', MkoTextarea);
    Vue.component('MkoCell', MkoCell);
    Vue.component('MkoDoubleCell', MkoDoubleCell);
    Vue.component('MkoMenuHeader', MkoMenuHeader);
    Vue.component('MkoMenuCell', MkoMenuCell);
    Vue.component('MkoHeader', MkoHeader);
    Vue.component('MkoPopupBottom', MkoPopupBottom);
    Vue.component('MkoPopupRight', MkoPopupRight);
    Vue.component('MkoSearchBar', MkoSearchBar);
    Vue.component('MkoDropdowns', MkoDropdowns);
    Vue.component('MkoNavBar', MkoNavBar);
    Vue.component('MkoTabItem', MkoTabItem);
};

export default MkoUI;





