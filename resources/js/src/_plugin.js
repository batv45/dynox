import * as moment from 'moment';
import 'moment/locale/tr'
import { Inertia } from '@inertiajs/inertia'

export default {
    install: (app, options) => {
        moment.locale('tr')
        app.mixin({
            created() {
                if (this._uid===0) {
                    Inertia.on('error', (errors) => {
                        this.$notyf.error('Bir hata oluştu!')
                    })
                }
            },
            mounted() {
            },
            methods: {
                route: (name, params, absolute) => route(name, params, absolute),
                asset(url){

                    return this.$page.props.app.asset_url+ url;
                },
                userHasRole(role,user=null){
                    user = user === null ? this.$page.props.user : user;
                    return user.roles.some((r)=>r.name === role);
                },
                userHasPermission(perm,user=null){
                    user = user === null ? this.$page.props.user : user;
                    return user.permissions_all.some((p)=>p.name === perm);
                },
                swalConfirm(text){
                    return this.$swal({
                        title: 'Emin misin?',
                        text: text,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'Hayır',
                        confirmButtonText: 'Evet'
                    })
                },
                decodeBase64: function (string) {
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                    var result = ''
                    var i = 0
                    do {
                        var b1 = characters.indexOf(string.charAt(i++))
                        var b2 = characters.indexOf(string.charAt(i++))
                        var b3 = characters.indexOf(string.charAt(i++))
                        var b4 = characters.indexOf(string.charAt(i++))
                        var a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3)
                        var b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF)
                        var c = ((b3 & 0x3) << 6) | (b4 & 0x3F)
                        result += String.fromCharCode(a) + (b ? String.fromCharCode(b) : '') + (c ? String.fromCharCode(c) : '')
                    } while (i < string.length)
                    return result
                }
            },
            filters: {
                moment: function (date) {
                    return moment(date).format('DD/MM/YYYY HH:mm');
                },
                moments: function (date) {
                    return moment(date).format('DD/MM/YYYY HH:mm:ss');
                },
                momentFromNow: function (date) {

                    return moment(date).fromNow();
                }
            }
        })
    }
}
