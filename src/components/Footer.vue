<template>
<div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">Get In Touch</h5>
            <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>25 Bvd. Gaci Amar Staoueli, Algiers, Algeria</p>
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
            <h5 class="text-white mb-4">Quick Links</h5>
            <router-link class="btn btn-link text-white-50" to="/about">About Us</router-link>
            <router-link class="btn btn-link text-white-50" to="/contact">Contact Us</router-link>
            <a class="btn btn-link text-white-50" href="">Our Services</a> <!-- Placeholder -->
            <a class="btn btn-link text-white-50" href="">Privacy Policy</a> <!-- Placeholder -->
            <a class="btn btn-link text-white-50" href="">Terms & Condition</a> <!-- Placeholder -->
          </div>
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">Newsletter</h5>
            <p>Stay updated with the latest deals and news from V7.</p>
            <div class="position-relative mx-auto" style="max-width: 400px;">
              <input class="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email">
              <button type="button" class="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="copyright">
          <div class="row">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <router-link class="border-bottom" to="/">v7</router-link> 2025, All Right Reserved.
            </div>
            <div class="col-md-6 text-center text-md-end">
              <div class="footer-menu">
                <router-link to="/">Home</router-link>
                <a href="">Cookies</a> <!-- Placeholder -->
                <a href="">Help</a> <!-- Placeholder -->
                <a href="">FQAs</a> <!-- Placeholder -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
