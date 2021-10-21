<template>
    <AppLayout>
        <div class="row mb-2">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <span class="badge bg-red"></span>
                            LoginAuth</h2>
                        <div class="card-actions">
                            <button class="btn btn-primary btn-sm" @click="getGuid">GetGUID</button>
                            <button class="btn btn-primary btn-sm" @click="getSession">Bağlan</button>
                        </div>
                    </div>
                    <div class="card-options"></div>
                    <pre class="border-0 m-0"><code>{{ LoginAuth }}</code></pre>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">SessionResult</h2>
                    </div>
                    <div class="card-body">
                        <p>AppGuID: {{AppGuID}}</p>
                        <p>SessionKey: {{SessionKey}}</p>
                        <p>PasswordKey: {{PasswordKey}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-3">
                <input type="text" class="form-control"/>
            </div>
            <div class="col-auto">
                <button class="btn btn-primary">Ara</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="table-responsive mb-0">
                      <table class="table table-vcenter table-nowrap">
                        <thead>
                          <tr>
                            <th class="text-muted font-italic w-1">#ID</th>
                            <th>Title</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th class="w-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="text-muted font-italic">#123</td>
                            <td class="text-muted" >
                              UI Designer, Training
                            </td>
                            <td class="text-muted" ><a href="#" class="text-reset">paweluna@howstuffworks.com</a></td>
                            <td class="text-muted" >
                              User
                            </td>
                            <td>
                              <a href="#">Edit</a>
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
            search_text:null,
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
    },
    methods:{
        searchText(){
            this.post('ProductSearch',{
                auth:this.LoginAuth
            })
        },
        getGuid(){
            axios.post("InstallationGuid",{
                "companyId": 1,
                "osName": "Windows"
            }).then((response)=>{
                if(response.data.hasOwnProperty('GetInstallationGuidResult')){
                    this.AppGuID = response.data.GetInstallationGuidResult
                    localStorage.appGuid = this.AppGuID;

                }
            })
        },
        getSession(){
            this.LoginAuth.InstallationGUID = this.AppGuID
            axios.post("Session",{
                auth:this.LoginAuth
            }).then((response)=>{
                if(response.data.hasOwnProperty('SessionResult')){
                    this.SessionResult = JSON.parse(response.data.SessionResult)
                    this.SessionKey = this.SessionResult.SessionKey
                    this.PasswordKey = this.SessionResult.PasswordKey
                    localStorage.sessionKey = this.SessionKey
                    localStorage.passwordKey = this.PasswordKey
                    console.log(this.SessionResult)

                }
            })
        }
    }
}
</script>

<style scoped>

</style>
