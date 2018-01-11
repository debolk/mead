<template>
    <div id="app">
        <nav class="navbar is-warning" role="navigation" aria-label="main navigation">
            <div class="navbar-start">
                <h1>Contactgegevens</h1>
                <div class="field search">
                    <p class="control has-icons-left">
                        <input
                            class="input"
                            type="search"
                            placeholder="Zoeken op naam"
                            v-model="filter.search"
                            :disabled="!oauth.loggedIn">
                        <span class="icon is-small is-left">
                            <i class="fa fa-search"></i>
                        </span>
                    </p>
                </div>

                <div class="field checkbox">
                    <input
                        id="ex_members"
                        type="checkbox"
                        name="ex_members"
                        class="switch is-rounded"
                        v-model="filter.ex_members"
                        :disabled="!oauth.loggedIn">
                    <label for="ex_members">Oud- en ex-leden</label>
                </div>
            </div>
        </nav>

        <p class="notification" v-if="displayedMembers.length === 0 && state === 'loaded'">
            Geen resultaten
        </p>
        <p class="notification is-danger" v-if="state === 'permission_refused'">
            Je moet toestemming geven voor toegang tot je Bolkaccount, anders kunnen
            we de gegevens van alle andere Bolkers niet downloaden. Probeer opnieuw
            door te herladen.
        </p>

        <p class="notification is-danger" v-if="state === 'token_expired'">
            Je inlog is verlopen. Het openen van extra informatie zal niet meer werken.
            Herlaad, en log opnieuw in.
        </p>

        <table class="table is-bordered is-striped is-narrow" v-if="displayedMembers.length > 0">
            <thead>
                <tr>
                    <th>
                        <i class="fa fa-fw fa-user"></i>
                        Naam
                    </th>
                    <th class="is-hidden-mobile">
                        <i class="fa fa-fw fa-envelope-o"></i>
                        E-mailadres
                    </th>
                    <th class="is-hidden-mobile">
                        <i class="fa fa-fw fa-phone"></i>
                        Telefoonnummer
                    </th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                <member
                    v-for="member in displayedMembers"
                    :key="member.uid"
                    :member="member"
                    @more-info="setDetailedMember"></member>
            </tbody>
        </table>

        <member-detail :member.sync="detailedMember" :access-token="oauth.token"></member-detail>
    </div>

</template>

<script>
import axios from 'axios';
import Member from './Member';
import MemberDetail from './MemberDetail';
import OAuth from './OAuth/OAuth';

export default {
    components: { Member, MemberDetail },
    data() {
        return {
            members: [],
            filter: {
                search: null,
                ex_members: false,
            },
            oauth: {
                loggedIn: false,
                token: null,
            },
            detailedMember: null,
            // authenticating -> permission_refused
            // authenticating -> loading -> loaded
            state: 'authenticating',
        };
    },

    mounted() {
        new OAuth(window.config).token().then(this.loggedIn).catch((error) => {
            if (error === 'user_refused_permission') {
                this.state = 'permission_refused';
                return;
            }
            this.fatalError(error);
        });
    },

    computed: {
        displayedMembers() {
            let members = this.members;

            if (!this.filter.ex_members) {
                members = members.filter(m => m.membership === 'lid' || m.membership == 'kandidaatlid');
            }

            if (this.filter.search) {
                const query = this.filter.search.toLowerCase();
                members = members.filter(m => m.name.toLowerCase().indexOf(query) !== -1);
            }

            members = members.sort((a, b) => {
                const first = a.firstname.localeCompare(b.firstname);
                const last = a.lastname.localeCompare(b.lastname);
                return first || last;
            });

            return members;
        }
    },

    methods: {
        loggedIn(token) {
            if (!token) return;
            this.state = 'loading';
            // Clean up URL and set OAuth page state
            history.pushState(null, null, '/');
            this.oauth.token = token.accessToken();
            this.oauth.loggedIn = true;

            // Get member data
            axios.request({
                method: 'get',
                url: `https://people.i.bolkhuis.nl/persons?access_token=${token.accessToken()}`,
                timeout: 10000,
            }).then((response) => {
                this.members = response.data;
                this.state = 'loaded';
            }).catch(this.fatalError);

            token.whenExpired().then(() => this.state = 'token_expired');
        },

        fatalError(error) {
            alert(`Fatal error: ${error}`);
        },

        setDetailedMember(member) {
            this.detailedMember = member;
        },
    },
};
</script>

<style lang="scss">
@import '~bulma/bulma';
@import '~bulma-switch/switch';

.navbar {
    h1 {
        font-size: 1.5em;
        font-weight: bold;
        padding: 0.25em 2em 0.25em 0.75em;
    }

    .search {
        margin: 0.5em;
    }

    .checkbox {
        margin: 1em;
    }
}

@media(max-width: 768px) {
    table {
        width: 100%;
    }
}
</style>
