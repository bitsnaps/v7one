<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
<div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5" dir="ltr">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">{{ $t('footer.getInTouch') }}</h5>
            <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>{{ $t('footer.address') }}</p>
            <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+213 (0) 656 242 575</p>
            <p class="mb-2"><i class="fa fa-envelope me-3"></i>contact@v7one.com</p>
            <div class="d-flex pt-2">
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-twitter"></i></a>
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-facebook-f"></i></a>
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-youtube"></i></a>
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">{{ $t('footer.quickLinks') }}</h5>
            <router-link class="btn btn-link text-white-50" to="/about">{{ $t('footer.aboutUs') }}</router-link>
            <router-link class="btn btn-link text-white-50" to="/contact">{{ $t('footer.contactUs') }}</router-link>
            <a class="btn btn-link text-white-50" href="">{{ $t('footer.ourServices') }}</a> <!-- Placeholder -->
            <a class="btn btn-link text-white-50" href="">{{ $t('footer.privacyPolicy') }}</a> <!-- Placeholder -->
            <a class="btn btn-link text-white-50" href="">{{ $t('footer.termsAndCondition') }}</a> <!-- Placeholder -->
          </div>
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">{{ $t('footer.newsletterTitle') }}</h5>
            <p>{{ $t('footer.newsletterText') }}</p>
            <div class="position-relative mx-auto" style="max-width: 400px;">
              <input class="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" :placeholder="$t('footer.newsletterPlaceholder')">
              <button type="button" class="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">{{ $t('footer.newsletterButton') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="copyright">
          <div class="row">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <router-link class="border-bottom" to="/">v7</router-link> 2025, {{ $t('footer.copyrightText') }}
            </div>
            <div class="col-md-6 text-center text-md-end">
              <div class="footer-menu">
                <router-link to="/">{{ $t('footer.home') }}</router-link>
                <a href="">{{ $t('footer.cookies') }}</a>
                <a href="">{{ $t('footer.help') }}</a> |
                <a href="">{{ $t('footer.faqs') }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
