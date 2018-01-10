<template>
    <div class="box">
        <article>
            <div class="media-content">
                <div class="content">
                    <h2>{{ member.name }}</h2>
                    <p>
                        <i class="fa fa-fw fa-envelope-o"></i>
                        <a :href="emailLink" v-if="emailPresent">{{ member.email }}</a>
                        <span class="missing" v-if="!emailPresent">
                            Geen e-mailadres bekend
                        </span>

                        <br>

                        <i class="fa fa-fw fa-phone"></i>
                        <a :href="mobileLink" v-if="mobileLink">{{ mobileDisplay }}</a>
                        <span class="missing" v-if="!mobileLink">
                            Geen mobiel nummer bekend
                        </span>

                        <br>

                        <i class="fa fa-fw fa-address-card-o"></i>
                        <a href="#" @click="">Alle informatie</a>
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

        mobileLink() {
            let phone = this.mobileCleaned;
            if (!phone) {
                return null;
            }
            if (phone[0] === '0') {
                phone = phone.substring(1);
            }
            return `tel:+31${phone}`;
        },

        mobileDisplay() {
            let phone = this.mobileCleaned;
            return phone ? phone.match(/.{1,2}/g).join(' ') : null;
        },

        mobileCleaned() {
            let phone = this.member.mobile;
            if (!phone) {
                return null;
            }
            return phone.replace(/[^0-9\+]/, '');
        }


    },
};
</script>

<style lang="scss" scoped>
.box {
    width: 25em;
    float: left;
    margin: 0.25em;
}
h2 {
    margin-bottom: 0;
}
.missing {
    color: #999;
}
</style>
