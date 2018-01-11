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

        <p class="notification" v-if="displayedMembers.length === 0">
            Geen resultaten
        </p>

        <member-detail :member.sync="detailedMember" :access-token="oauth.token"></member-detail>
    </div>

</template>

<script>
import axios from 'axios';
import Member from './Member';
import MemberDetail from './MemberDetail';
import OAuth from './OAuth';

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
        };
    },

    mounted() {
        new OAuth(window.config).authenticate().then(this.loggedIn).catch(this.fatalError);
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
            if (token === false) return;
            this.oauth.token = token;
            this.oauth.loggedIn = true;
            axios.request({
                method: 'get',
                url: `https://people.i.bolkhuis.nl/persons?access_token=${token}`,
                timeout: 10000,
            }).then((response) => {
                this.members = response.data;
            }).catch(this.fatalError);
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
