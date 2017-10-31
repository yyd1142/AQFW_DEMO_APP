import api from 'api'
import { Tabs } from 'components'
export default {
    data() {
        return {}
    },
    activated() {
    },
    deactivated() {
    },
    computed: {
        isAdmin() {
            return this.$store.state.user.isAdmin;
        }
    },
    methods: {},
    components: {
        Tabs
    }
}


