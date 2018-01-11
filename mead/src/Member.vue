<template>
    <div class="box">
        <article>
            <div class="media-content">
                <div class="content">
                    <h2>{{ member.name }}</h2>
                    <p>
                        <i class="fa fa-fw fa-envelope-o"></i>
                        <a target="_blank" :href="emailLink" v-if="emailPresent">{{ member.email }}</a>
                        <span class="missing" v-if="!emailPresent">
                            Geen e-mailadres bekend
                        </span>

                        <br>

                        <i class="fa fa-fw fa-phone"></i>
                        <a target="_blank" :href="member.mobile | phoneLink" v-if="member.mobile">
                            {{ member.mobile | phoneNumber }}
                        </a>
                        <span class="missing" v-if="!member.mobile">
                            Geen mobiel nummer bekend
                        </span>

                        <br>

                        <i class="fa fa-fw fa-address-card-o"></i>
                        <a href="#" @click.prevent="updateDetailedView">Alle informatie</a>
                    </p>
                </div>
            </div>
        </article>
    </div>
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
.box {
    overflow: hidden;
    max-width: 30em;
    margin-bottom: 0.5em;
}
h2 {
    margin-bottom: 0;
}
.missing {
    color: #999;
}
</style>
