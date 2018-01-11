<template>
    <tr>
        <td>{{ member.name }}</td>
        <td class="is-hidden-mobile">
            <a target="_blank" :href="emailLink" v-if="emailPresent">
                {{ member.email }}
            </a>
            <span class="missing" v-if="!emailPresent">
                Geen e-mailadres bekend
            </span>
        </td>
        <td class="is-hidden-mobile">
            <a target="_blank" :href="member.mobile | phoneLink" v-if="member.mobile">
                {{ member.mobile | phoneNumber }}
            </a>
            <span class="missing" v-if="!member.mobile">
                Geen mobiel nummer bekend
            </span>
        </td>
        <td class="actions">
            <button class="button is-small is-hidden-tablet" @click="email" :disabled="!emailPresent">
                <i class="fa fa-fw fa-envelope-o"></i>
            </button>
            <button class="button is-small is-hidden-tablet" @click="call" :disabled="!member.mobile">
                <i class="fa fa-fw fa-phone"></i>
            </button>
            <button class="button is-small is-hidden-tablet" href="#" @click.prevent="updateDetailedView">
                <i class="fa fa-fw fa-address-card-o"></i>
            </button>

            <a class="button is-small is-hidden-mobile" href="#" @click.prevent="updateDetailedView">
                Alle informatie
            </a>
        </td>
    </tr>
</template>

<script>
import { link } from './helpers/PhoneNumber';

export default {
    props: ['member'],

    computed: {
        emailPresent() {
            return this.member.email && this.member.email !== 'unknown@nieuwedelft.nl.invalid';
        },

        emailLink() {
            return `mailto:${this.member.email}`;
        },
    },

    methods: {
        updateDetailedView() {
            this.$emit('more-info', this.member);
        },

        call() {
            window.location.href = link(this.member.mobile);
        },

        email() {
            window.location.href = this.emailLink;
        },
    },
};
</script>

<style lang="scss" scoped>
.missing {
    color: #999;
}
.actions {
    min-width: 9em;
}

button[disabled] {
    border-color: #999;
    color: #999;
}
</style>
