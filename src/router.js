import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
    showSpinner: false,
    easing: 'ease',
    speed: 1000,
    template: '<div class="page-progress-bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
}); //进度条配置

Vue.use(Router)

const routers = {
    // mode: 'history',
    routes: [
        //登陆
        {
            path: '/login',
            component: resolve => require(['views/login/login.vue'], resolve),
            name: 'login'
        },
        //入口首页
        {
            path: '/',
            redirect: '/enter',
            component: resolve => require(['views/login/login.vue'], resolve)
        },
        {
            path: '/enter',
            component: resolve => require(['./views/enter/enter.vue'], resolve),
            title: '首页-TAB',
            redirect: '/enter/home',
            name: 'Enter',
            children: [
                {
                    path: 'home',
                    component: resolve => require(['./views/home/home.vue'], resolve),
                    title: '首页',
                    name: 'home'
                }
            ]
        },
        {
            path: '/videoSurveillance',
            component: resolve => require(['./views/VideoSurveillance/index.vue'], resolve),
            name: 'VideoSurveillance'
        }
    ]
};

const router = new Router(routers);

router.beforeEach((to, from, next) => {
    // if (to.name == 'home') {
    //     NProgress.remove();
    // } else {
    //     NProgress.start();
    // }
    NProgress.start();
    next();
})
router.afterEach(transition => {
    NProgress.done();
});

export default router;

