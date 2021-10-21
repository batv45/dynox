<template>
    <AppLayout>
        <div class="row mb-2">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">

                            <span class="badge" :class="SessionKey ? 'bg-green' : 'bg-red'"></span>
                            SessionResult</h2>
                        <div class="card-options">
                            <button class="btn btn-primary btn-sm" @click="getGuid">GetGUID</button>
                            <button v-if="!SessionKey" class="btn btn-primary btn-sm" @click="getSession">Bağlan</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="mb-1">AppGuID: {{AppGuID}}</p>
                        <p class="mb-1">SessionKey:
                            {{SessionKey}}
                        </p>
                        <p>PasswordKey: {{PasswordKey}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-3" v-if="SessionKey">
            <div class="col-md-3">
                <input type="text" v-model="search_text" @keypress.enter.prevent="searchText" class="form-control"/>
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" @click.prevent="searchText">Ara</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="table-responsive mb-0">
                      <table class="table table-sm table-vcenter">
                        <thead>
                          <tr>
                            <th>Ürün Kodu</th>
                            <th>Açıklama</th>
                            <th>Miktar</th>
                            <th></th>
                            <th>Fiyat</th>
                            <th class="w-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="prod in SearchResult" :class="prod.EvenOdd ? 'bg-azure-lt' : ''">
                            <td>{{decodeURI(decodeBase64(prod.ProductCode).substr(36))}}</td>
                            <td>{{prod.Name_PType}}</td>
                            <td>
                                <span v-if="prod.StockAmount == 0" class="badge bg-red">X</span>
                                <span v-else-if="prod.StockAmount < 5" class="badge bg-light text-dark">{{ prod.StockAmount }}</span>
                                <span v-else  class="badge bg-green">OK</span>
                            </td>
                            <td>{{prod.UnitType}}</td>
                            <td><span :title="prod.NetPriceWVat | formatMoney">{{prod.NetPriceWVat | formatMoney}} - {{ prod.NetPriceWVat | hesapla| formatMoney }}
                             - {{prod.LocalListPriceWVat | formatMoney}}</span>
                            </td>

                            <td>
                              <a href="#">Ekle</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import AppLayout from "../../Layouts/AppLayout";
export default {
    metaInfo:{
        title:'Dinamik Bağlantı'
    },
    name: "Index",
    components: {AppLayout},
    data(){
        return {
            base_url:"https://bayi.adaoto.com.tr/Service/JsonService.svc",
            LoginAuth:{
                "CustomerCode": "da450317",
                "Password": "[BARE]450317",
                "Username": "depo",
                "IsRepresentative": false,
                "InstallationGUID": null
            },
            SessionAuth:{
                "CustomerCode": "da450317",
                "Password": null,
                "SessionID": null,
                "Username": "depo",
                "IsRepresentative": false,
                "InstallationGUID": null
            },
            SessionResult:null,
            SessionKey:0,
            PasswordKey:null,
            AppGuID:null,
            search_text:"m131 rot bas",
            SearchResult:[]
        }
    },
    mounted() {
      axios.defaults.baseURL = this.base_url
        this.AppGuID = localStorage.appGuid
        if (this.AppGuID == null){
            this.getGuid()
        }
        this.SessionKey = localStorage.sessionKey
        this.PasswordKey = localStorage.passwordKey
        this.SessionResult = localStorage.sessionResult

        this.LoginAuth.InstallationGUID = this.AppGuID
        this.SessionAuth.InstallationGUID = this.AppGuID
        this.SessionAuth.SessionID = this.SessionKey.split('||')[0]
        this.SessionAuth.Password = this.PasswordKey
    },
    filters:{
         formatMoney: function(n) {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').replace(/\.(\d+)$/,',$1');
        },
        hesapla: function(n){
                let yuzde = 18;
                return  n+(n*yuzde/100);

        }
    },
    methods:{
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
        },
        searchText(){
            axios.post('ProductSearch',{
                auth:this.SessionAuth,
                text:this.search_text,
                "searchDetails": {
                    "includeGroup": true,
                    "loadType": 20,
                    "NotInStockOption": null,
                    "discountProducts": false,
                    "newProducts": false
                }
            }).then( (response)=>{
                if(response.data.hasOwnProperty('ProductSearchResult')){
                    this.SearchResult = JSON.parse(response.data.ProductSearchResult).ResultDetailed
                    console.log(JSON.parse(response.data.ProductSearchResult))
                }
            } )
        },
        getGuid(){
            axios.post("InstallationGuid",{
                "companyId": 1,
                "osName": "Windows"
            }).then((response)=>{
                if(response.data.hasOwnProperty('GetInstallationGuidResult')){
                    this.AppGuID = response.data.GetInstallationGuidResult
                    localStorage.appGuid = this.AppGuID;

                    this.LoginAuth.InstallationGUID = this.AppGuID
                    this.SessionAuth.InstallationGUID = this.AppGuID
                    localStorage.removeItem('sessionKey')
                    localStorage.removeItem('passwordKey')
                    this.PasswordKey = null
                    this.SessionKey = null
                }
            })
        },
        getSession(){
            axios.post("Session",{
                auth:this.LoginAuth,
            }).then((response)=>{
                if(response.data.hasOwnProperty('SessionResult')){
                    this.SessionResult = JSON.parse(response.data.SessionResult)
                    this.SessionKey = this.SessionResult.SessionKey
                    this.PasswordKey = this.SessionResult.PasswordKey
                    this.SessionAuth.Password = this.SessionKey.split('||')[2]
                    this.SessionAuth.SessionID = this.SessionResult.SessionValue
                    localStorage.sessionKey = this.SessionKey
                    localStorage.passwordKey = this.PasswordKey
                    localStorage.sessionResult = JSON.stringify(this.SessionResult)
                    this.SessionAuth.Password = this.PasswordKey
                    console.log(this.SessionResult)

                }
            })
        }
    }
}
</script>

<style scoped>

</style>
