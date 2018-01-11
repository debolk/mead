<template>
    <div class="modal" :class="{'is-active': member}" v-if="member">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ member.name }}</p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <table class="table is-bordered is-striped is-narrow is-fullwidth" v-if="!loading">
                    <tbody>
                        <tr>
                            <th>Foto</th>
                            <td>
                                <img :src="pictureURL" class="profile" height="128" width="128">
                            </td>
                        </tr>
                        <tr><th>Gebruikersnaam</th>     <td>{{ member.uid }}</td></tr>
                        <tr><th>Naam</th>               <td>{{ member.name }}</td></tr>
                        <tr><th>Voorletters</th>        <td>{{ member.initials.split('').join('.') }}.</td></tr>
                        <tr><th>Lidmaatschap</th>       <td>{{ member.membership }}</td></tr>
                        <tr>
                            <th>Telefoon</th>
                            <td>
                                <a :href="member.mobile | phoneLink">
                                    {{ member.mobile | phoneNumber }}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>Telefoon ouders</th>
                            <td>
                                <a :href="member.phone_parents | phoneLink">
                                    {{ member.phone_parents | phoneNumber }}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>E-mailadres</th>
                            <td>
                                <a :href="emailLink" target="_blank">{{ member.email }}</a>
                            </td>
                        </tr>
                        <tr>
                            <th>Adres</th>
                            <td>
                                <a :href="mapsLink" target="_blank">{{ member.address }}</a>
                            </td>
                        </tr>
                        <tr>
                            <th>Geslacht</th>
                            <td>
                                <i class="fa fa-fw" :class="genderClass"></i>
                                {{ member.gender === 'F' ? 'Vrouw' : 'Man' }}
                            </td>
                        </tr>
                        <tr><th>Geboortedatum</th>      <td>{{ member.dateofbirth }}</td></tr>
                        <tr><th>Bijnaam</th>            <td>{{ extra.nickname }}</td></tr>
                        <tr><th>Studie</th>             <td>{{ extra.study }}</td></tr>
                        <tr><th>Overleden</th>          <td>{{ extra.alive ? 'nee' : 'ja' }}</td></tr>
                        <tr><th>Datum inauguratie</th>  <td>{{ extra.inauguration }}</td></tr>
                        <tr><th>Datum lid-af brief</th> <td>{{ extra.resignation_letter }}</td></tr>
                        <tr><th>Datum lid-af</th>       <td>{{ extra.resignation }}</td></tr>
                    </tbody>
                </table>

                <p v-if="loading">
                    <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
                    <i>Extra gegevens opzoeken</i>
                </p>
            </section>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['member', 'accessToken'],

    data() {
        return {
            loading: true,
            extra: null
        };
    },

    watch: {
        member(newVal) {
            if (newVal !== null) {
                this.getExtraDetails();
            }
        }
    },

    computed: {
        pictureURL() {
            const uid = this.member.uid;
            const token = this.accessToken;
            return `https://people.i.bolkhuis.nl/persons/${uid}/photo/128/128?access_token=${token}`;
        },

        genderClass() {
            return {
                'fa-male': this.member.gender === 'M',
                'fa-female': this.member.gender === 'F',
            };
        },

        emailLink() {
            return `mailto:${this.member.email}`;
        },

        mapsLink() {
            const address = encodeURIComponent(this.member.address);
            return `https://www.google.nl/maps/place/${address}`;
        },
    },

    methods: {
        close() {
            this.extra = null;
            this.$emit('update:member', null);
        },

        getExtraDetails() {
            this.loading = true;
            const uid = this.member.uid;
            const token = this.accessToken;
            const url = `https://operculum.i.bolkhuis.nl/person/${uid}?access_token=${token}`

            axios.get(url).then((response) => {
                this.extra = response.data;
                this.loading = false;
            }).catch((error) => {
                // Not actually an error, there's just no extended data available
                if (error.response.status === 404) {
                    return;
                }
                alert(`Fatal error: ${error}`);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.profile {
    border-radius: 10%;
    width: 128px;
    height: 128px;
}
</style>
