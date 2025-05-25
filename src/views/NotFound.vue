<template>
        <!-- 404 Start -->
        <div class="container-xxl py-5">
            <div class="container text-center">
                <div class="row justify-content-center">
                    <div class="col-lg-6">
                        <!-- <i class="fa fa-exclamation display-1 text-primary"></i> -->
                        <div class="display-1">
                            <svg xmlns="http://www.w3.org/2000/svg" height="64" width="64" viewBox="0 0 512 512"><path fill="var(--secondary)" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                        </div>
                        <h1 class="display-1">404</h1>
                        <h1 class="mb-4">{{ $t('notFound.title', 'Page Not Found') }}</h1>
                        <p class="mb-4">{{ $t('notFound.description', "We're sorry, the page you have looked for does not exist in our website! Maybe go to our home page or try to use a search?") }}</p>
                        <router-link to="/" class="btn btn-primary py-3 px-5">{{ $t('notFound.goHome', 'Go Back To Home') }}</router-link>
                    </div>
                </div>
            </div>
        </div>
        <!-- 404 End -->

</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
    name: 'NotFound',
    setup() {
        const { t } = useI18n();
        return {
            $t: t
        };
    }
}
</script>