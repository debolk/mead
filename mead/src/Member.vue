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
        <td>
            <a href="#" class="button is-small" @click.prevent="updateDetailedView">Alle informatie</a>
        </td>
    </tr>
</template>

<script>
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
    },
};
</script>

<style lang="scss" scoped>
.missing {
    color: #999;
}
</style>
